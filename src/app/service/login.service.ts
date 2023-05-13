import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginDataModel } from '../interfaces/login-data.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private _currentPatientId: number = 0;

  constructor(private httpClient: HttpClient) { }

  public login(loginData: LoginDataModel) {
    return this.httpClient.post<number>('http://localhost:8000/pacientes/login',loginData);
  }

  public setCurrentPatientId(value: number) {
    this._currentPatientId = value;
  }

  public getCurrentPatientId(): number {
    return this._currentPatientId;
  }

}
