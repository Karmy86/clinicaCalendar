import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDataModel } from '../interfaces/login-data.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  public login(loginData: LoginDataModel) {
    return this.httpClient.post<Response>('http://localhost:8000/pacientes/login',loginData);
  }

}
