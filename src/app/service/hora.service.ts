import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HoraModel } from '../interfaces/hora.model';
import { Dia } from '../interfaces/dia';

@Injectable({
  providedIn: 'root'
})
export class HoraService {

  constructor(private httpClient: HttpClient) { }

  public list(dia: Dia): Observable<HoraModel[]> {
    const data = { dia: dia.dia };
    return this.httpClient.post<HoraModel[]>('http://localhost:8000/horario/horasDisponibles/' + dia, dia);
  }


}
