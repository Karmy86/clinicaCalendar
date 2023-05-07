import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Paciente } from 'src/app/interfaces/paciente.model';
import { PacienteService } from 'src/app/service/paciente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent {

  public expRegEmail: string = "^[a-zA-Z0-9_.+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$";
  public expRegPassword: string = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()-_=+[\\]{};':\",.<>?/\\\\|])(?=.*[^\\s])\\S{8,}$";

  
  paciente: Paciente = new Paciente;
  
  public constructor (private pacienteService: PacienteService, private router: Router) {}


  onSubmit(form: NgForm) {

    if(this.paciente.email.match(this.expRegEmail) != null)  {
    } else {
      alert("Por favor, introduce un email correcto");
    }

    if(this.paciente.password.match(this.expRegPassword) != null) {
    } else {
      alert("Por favor, introduce una contraseña correcta");
    }
    this.pacienteService.create(this.paciente).subscribe(response => this.router.navigate(['/reservas']));
  }
  
}
