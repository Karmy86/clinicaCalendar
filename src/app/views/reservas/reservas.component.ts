import { Reservas } from './../../interfaces/reservas.model';
import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
} from '@angular/core';
import {
  startOfWeek,
  endOfWeek,
  addMinutes,
  addDays,
} from 'date-fns';
import { Subject, finalize, fromEvent, takeUntil} from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CalendarEvent,
  CalendarView,
} from 'angular-calendar';
import { EventColor, WeekViewHourSegment } from 'calendar-utils';
import { ReservasService } from 'src/app/service/reservas.service';
import { LoginService } from 'src/app/service/login.service';

const colors: Record<string, EventColor> = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'reservas',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'reservas.component.html',
})
export class ReservasComponent implements OnInit {
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any> | undefined;

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData: any;

  dragToCreateActive = false;

  events: CalendarEvent[] = new Array;

  activeDayIsOpen: boolean = true;

  weekStartsOn: 1 = 1;

  refresh = new Subject<void>();

  locale = "en";

  constructor(private modal: NgbModal, private reservasService: ReservasService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.loadAllReservedDays();
  }

  loadAllReservedDays() {
    const from = startOfWeek(new Date());
    this.reservasService.findAllByWeek(startOfWeek(this.viewDate), endOfWeek(this.viewDate)).subscribe({
      next: (value) => {
        value.forEach((reserva) => {
          if (reserva.id_paciente === this.loginService.getCurrentPatientId()) {
            this.addEventFromReservaDate(new Date(reserva.dia_hora), true);
          } else {
            this.addEventFromReservaDate(new Date(reserva.dia_hora), false);
          }
        });
        this.refresh.next();
      },
      error: (error) => console.error('Error al obtener los días disponibles: ', error)
    });
  }

  startDragToCreateReservaEvent(segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent, segmentElement: HTMLElement) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'Tu cita',
      color: colors['yellow'],
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent<MouseEvent>(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.openModalForEvent(dragToSelectEvent);
          this.refresh.next();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = this.ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          this.floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refresh.next();
      });
  }

  openModalForEvent(event: CalendarEvent): void {
    this.modalData = { 
      start: event.start.toLocaleString(),
      startDate: event.start,
      end: event.end?.toLocaleString(),
      endDate: event.end
    };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEventFromReservaDate(date: Date, isCurrentPatientReserva: boolean): void {
    const title = isCurrentPatientReserva ? 'Tu cita' : 'Reservado';
    const color = isCurrentPatientReserva ? colors['yellow'] : colors['red']
    const endDate = new Date(date);
    endDate.setHours(date.getHours() + 1);
    console.log(endDate);
    this.events = [
      ...this.events,
      {
        title: title,
        start: date,
        end: endDate,
        color: color,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
    this.loadAllReservedDays();
  }

  nuevaReserva(modalData: any) {
    const date = modalData.startDate as Date;
    const nuevaReserva: Reservas = {
      id_paciente: this.loginService.getCurrentPatientId(),
      dia_hora: modalData.start
    };
    this.reservasService.newReserva(nuevaReserva).subscribe({
      next: () => this.modal.dismissAll(),
      error: (error) => alert("Error al crear reserva. Primero debes acceder a la aplicación")
    });
  }

  closeAndDeleteLastEvent() {
    this.events.pop();
    this.modal.dismissAll();
    this.refresh.next();
  }

  private floorToNearest(amount: number, precision: number) {
    return Math.floor(amount / precision) * precision;
  }
  
  private ceilToNearest(amount: number, precision: number) {
    return Math.ceil(amount / precision) * precision;
  }

}
