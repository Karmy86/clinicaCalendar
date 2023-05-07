import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import format from 'date-fns/format';
import { Observable } from 'rxjs';
import { Reservas } from '../interfaces/reservas.model';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  rutaApi = 'http://localhost:8000/reservas';

  constructor(private httpClient : HttpClient) { }

  public findAllByWeek(from: Date, to: Date): Observable<Reservas[]> {
    let params = new HttpParams();
    params = params.append('from', format(from, 'yyyy-MM-dd HH:mm:ss'));
    params = params.append('to', format(to, 'yyyy-MM-dd HH:mm:ss'));
    const options = {params: params};
    return this.httpClient.get<Reservas[]>(this.rutaApi + '/listar', options);
  }

}
