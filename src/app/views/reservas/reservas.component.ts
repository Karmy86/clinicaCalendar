import { Component, OnInit } from '@angular/core';
import { Dia } from 'src/app/interfaces/dia';
import { DiaService } from 'src/app/service/dia.service';
import { HoraModel } from 'src/app/interfaces/hora.model';
import { HoraService } from 'src/app/service/hora.service';

@Component({
  selector: 'app-reservas',
  templateUrl: './reservas.component.html',
  styleUrls: ['./reservas.component.css']
})
export class ReservasComponent implements OnInit {
  
  public availableDays: Dia[] = []; // Lista de días disponibles
  public availableHours: HoraModel[] = []; // Lista de horas disponibles para el día seleccionado
  public selectedDay: Dia | null = null; // Día seleccionado por el paciente

  constructor(private diaService: DiaService, private horaService: HoraService) {}

  ngOnInit(): void {
    this.loadAvailableDays();
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

