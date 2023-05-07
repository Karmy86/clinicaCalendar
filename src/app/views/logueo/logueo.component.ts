import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscriber } from 'rxjs';
import { LoginDataModel } from 'src/app/interfaces/login-data.model';
import { LoginService } from 'src/app/service/login.service';
import { NgForm } from '@angular/forms';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.component.html',
  styleUrls: ['./logueo.component.css']
})
export class LogueoComponent {

  loginError = false;
  loginData: LoginDataModel = new LoginDataModel;
  
  constructor(private http: HttpClient, private loginService: LoginService, private router: Router) {}

  onSubmit(form: NgForm): void{
    this.loginService.login(this.loginData).subscribe(
      () => {
        // Redirección a la vista de reservas en caso de éxito
        console.log(this.router.navigate(['/reservas']));
      },
      () => {
        // Manejo de errores en caso de fallo en el login
        this.loginError = true;
        }
      );
    }

  //tryLogin() {
    /* this.loginService.login({
      next: () => console.log('Login correcto. Redirigir a pantalla de reserva con el Router'),
      error: (errorResponse: HttpErrorResponse) => {
        console.error('Email o contraseña incorrecto. Mostrar error en formulario.');
        this.loginError = true;
      },
      complete: () => console.info('Hacer algo (o no)') 
  });
  // this.router.navigate() */
  //}

  
}
