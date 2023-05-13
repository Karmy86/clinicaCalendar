import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginDataModel } from 'src/app/interfaces/login-data.model';
import { LoginService } from 'src/app/service/login.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-logueo',
  templateUrl: './logueo.component.html',
  styleUrls: ['./logueo.component.css']
})
export class LogueoComponent {

  loginError = false;
  loginData: LoginDataModel = new LoginDataModel;
  
  constructor(private loginService: LoginService, private router: Router) {}

  onSubmit(form: NgForm): void {
    this.loginService.login(this.loginData).subscribe({
      next: (value) => {
        this.loginService.setCurrentPatientId(value);
        this.router.navigate(['/reservas']);
      },
      error: () => this.loginError = true
    });
  }

}
