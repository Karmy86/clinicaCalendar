import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './views/home/home.component';
import { FisioComponent } from './views/fisio/fisio.component';
import { SueloPelvicoComponent } from './views/suelo-pelvico/suelo-pelvico.component';
import { PodologiaComponent } from './views/podologia/podologia.component';
import { EnfermeriaComponent } from './views/enfermeria/enfermeria.component';
import { EquipoComponent } from './views/equipo/equipo.component';
import { ContactoComponent } from './views/contacto/contacto.component';
import { NuevoUsuarioComponent } from './views/nuevo-usuario/nuevo-usuario.component';
import { LogueoComponent } from './views/logueo/logueo.component';
import { ReservasComponent } from './views/reservas/reservas.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'fisio', component: FisioComponent },
  { path: 'sueloPelvico', component: SueloPelvicoComponent },
  { path: 'podologia', component: PodologiaComponent },
  { path: 'enfermeria', component: EnfermeriaComponent },
  { path: 'equipo', component: EquipoComponent },
  { path: 'contacto', component: ContactoComponent},
  { path: 'logueo/nuevo-usuario', component: NuevoUsuarioComponent},
  { path: 'logueo', component: LogueoComponent},
  { path: 'reservas', component: ReservasComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
