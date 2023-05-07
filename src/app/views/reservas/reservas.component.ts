import { ReservasService } from './../../service/reservas.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Dia } from 'src/app/interfaces/dia';
import { DiaService } from 'src/app/service/dia.service';
import { HoraModel } from 'src/app/interfaces/hora.model';
import { HoraService } from 'src/app/service/hora.service';
import {
  startOfWeek,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  endOfWeek,
} from 'date-fns';
import { ClinicCalendarComponent } from 'src/app/components/calendar/clinic-calendar.component';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {

  @ViewChild('calendario') calendario: ClinicCalendarComponent | undefined;
  
  public availableDays: Dia[] = []; // Lista de días disponibles
  public availableHours: HoraModel[] = []; // Lista de horas disponibles para el día seleccionado
  public selectedDay: Dia | null = null; // Día seleccionado por el paciente
  public fechaSemana: Date | null = null;

  constructor(private diaService: DiaService, private horaService: HoraService, private reservasService: ReservasService) {}

  ngOnInit(): void {
    // this.loadAvailableDays();
    this.loadAllReservedDays();
  }

  loadAllReservedDays() {
    const from = startOfWeek(new Date());
    console.log(from);
    this.reservasService.findAllByWeek(startOfWeek(new Date()), endOfWeek(new Date())).subscribe({
      next: (value) => {
        value.forEach((reserva) => this.calendario?.addEventFromReservaDate(reserva.dia_hora));
      },
      error: (error) => console.error('Error al obtener los días disponibles: ', error)
    });
  }

  loadAvailableDays() {
    this.diaService.list().subscribe({
      next: (value) => {
        console.log('Completado' + value);
        this.availableDays = value;
      },
      error: (error) => console.error('Error al obtener los días disponibles: ', error)
    });
  }

  onDayChange() {
    if (this.selectedDay) {
      const formattedDay = this.selectedDay.dia;

      this.horaService.list(this.selectedDay).subscribe({
        next: (value) => {
          this.availableHours = value;
        },
        error: (error) => console.error('Error al obtener las horas disponibles:', error)
      });
    }
  }

  reservarHora() {

  }
  
}

