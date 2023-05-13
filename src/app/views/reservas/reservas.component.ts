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

  modalData: {
      event: CalendarEvent;
  } | undefined;

  dragToCreateActive = false;

  events: CalendarEvent[] = new Array;

  activeDayIsOpen: boolean = true;

  weekStartsOn: 0 = 0;

  refresh = new Subject<void>();

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
        this.handleEvent(dragToSelectEvent);
        // this.refresh();
        this.refresh.next();
      });
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  handleEvent(event: CalendarEvent): void {
    this.modalData = { event };
    this.modal.open(this.modalContent, { size: 'lg' });
  }

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors['red'],
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  addEventFromReservaDate(date: Date): void {
    console.log('Entra a añadir evento');
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: date,
        end: new Date(date.getHours() + 1),
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
}
