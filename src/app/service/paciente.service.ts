import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Paciente } from '../interfaces/paciente.model';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PacienteService {

  rutaApi = 'http://localhost:8000/pacientes';

  constructor(private httpClient : HttpClient) { }

  public listar(){
    return this.httpClient.get(this.rutaApi + '/');
  }

  public create(paciente: Paciente) {
    return this.httpClient.post('http://localhost:8000/pacientes/new', paciente);
  }

  public actualizar(paciente: Paciente) {
    return this.httpClient.put(this.rutaApi + '/edit/{id}', paciente);
  }

  public eliminar(id: string | number): Observable<any> {
    return this.httpClient.delete(this.rutaApi + '/delete/{id}');
  }

}
