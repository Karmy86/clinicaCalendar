import {
  Component,
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
  OnInit,
  ChangeDetectorRef, 
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  isSameDay,
  isSameMonth,
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

  weekStartsOn: 0 = 0;

  refresh = new Subject<void>();

  locale = "en";

  constructor(private modal: NgbModal, private reservasService: ReservasService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.loadAllReservedDays();
  }

  loadAllReservedDays() {
    const from = startOfWeek(new Date());
    this.reservasService.findAllByWeek(startOfWeek(new Date()), endOfWeek(new Date())).subscribe({
      next: (value) => {
        value.forEach((reserva) => this.addEventFromReservaDate(new Date(reserva.dia_hora)));
        this.refresh.next();
      },
      error: (error) => console.error('Error al obtener los días disponibles: ', error)
    });
  }

  startDragToCreateReservaEvent(segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent, segmentElement: HTMLElement) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: 'New event',
      // start: this.parseToLocalDate(segment.date),
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
          // this.refresh();
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
          // dragToSelectEvent.end = this.parseToLocalDate(newEnd);
          dragToSelectEvent.end = newEnd;
        }
        // this.refresh();
        this.refresh.next();
      });
  }

  openModalForEvent(event: CalendarEvent): void {
    this.modalData = { 
      start: event.start.toLocaleString(),
      end: event.end?.toLocaleString()
    };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEventFromReservaDate(date: Date): void {
    const endDate = new Date(date);
    endDate.setHours(date.getHours() + 1);
    console.log(endDate);
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: date,
        end: endDate,
        color: colors['red'],
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
  }

  // private refresh() {
  //   this.events = [...this.events];
  //   this.cdr.detectChanges();
  // }

  private floorToNearest(amount: number, precision: number) {
    return Math.floor(amount / precision) * precision;
  }
  
  private ceilToNearest(amount: number, precision: number) {
    return Math.ceil(amount / precision) * precision;
  }

  private parseToLocalDate(dateWithZone: Date): Date {
    const dateString = dateWithZone.toLocaleString();
    const localDateTime = new Date(dateString);
    console.log(localDateTime);
    return localDateTime;
  }

}
