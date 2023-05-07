import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dia } from '../interfaces/dia';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DiaService {

  constructor(private httpClient: HttpClient) { }

  public list(): Observable<Dia[]> {
    return this.httpClient.post<Dia[]>('http://localhost:8000/horario/diasDisponibles', {});
  }

}
