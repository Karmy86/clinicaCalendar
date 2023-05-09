import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { HomeComponent } from './views/home/home.component';
import { FisioComponent } from './views/fisio/fisio.component';
import { SueloPelvicoComponent } from './views/suelo-pelvico/suelo-pelvico.component';
import { PodologiaComponent } from './views/podologia/podologia.component';
import { EnfermeriaComponent } from './views/enfermeria/enfermeria.component';
import { EquipoComponent } from './views/equipo/equipo.component';
import { ContactoComponent } from './views/contacto/contacto.component';
import { NuevoUsuarioComponent } from './views/nuevo-usuario/nuevo-usuario.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LogueoComponent } from './views/logueo/logueo.component';
import { ReservasComponent } from './views/reservas/reservas.component';
import { CommonModule } from '@angular/common';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        HomeComponent,
        FisioComponent,
        SueloPelvicoComponent,
        PodologiaComponent,
        EnfermeriaComponent,
        EquipoComponent,
        ContactoComponent,
        NuevoUsuarioComponent,
        LogueoComponent,
        ReservasComponent
    ],
    providers: [],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientModule,
        CommonModule,
        FormsModule,
        NgbModalModule,
        FlatpickrModule.forRoot(),
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
    ]
})
export class AppModule { }
