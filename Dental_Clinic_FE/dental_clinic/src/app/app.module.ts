import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular'; // Module FullCalendar
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Cho Form trong Dialog

// Import các Module của Angular Material cần dùng
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core'; // Cần cho MatDatepicker
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { ScheduleComponent } from './test/schedule/schedule.component';
import { EventDialogComponent } from './test/event-dialog/event-dialog.component';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import localeVi from '@angular/common/locales/vi';
import { registerLocaleData } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './Modules/error/not-found/not-found.component';
import { AppRoutingModule } from './app-routing.module';
import { SidebarModule } from '@coreui/angular';
import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import * as allIcons from '@coreui/icons';
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';

registerLocaleData(localeVi);
@NgModule({
  declarations: [
    AppComponent,
    ScheduleComponent,
    NotFoundComponent
  ],
  imports: [
    EventDialogComponent,
    BrowserModule,
    BrowserAnimationsModule,
    FullCalendarModule, // Import module FullCalendar
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,

    // Import các module Angular Material
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatSnackBarModule,
    NgxMatTimepickerModule,
    NgxSpinnerModule,

    // SidebarModule từ CoreUI
    SidebarModule,
    IconModule,
    IconSetModule,
    HttpClientModule

  ],
  providers: [
    // MatDatepicker cần MatNativeDateModule hoặc adapter khác
    IconSetService,
    MatNativeDateModule,
    provideClientHydration(),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: 'vi-VN' },
    { provide: MAT_DATE_LOCALE, useValue: 'vi-VN' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    { 
      provide: HTTP_INTERCEPTORS, 
      useClass: ErrorInterceptor, 
      multi: true 
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private iconSet: IconSetService) {
    // Extract only the icons, excluding icon groups like brandSet, flagSet, etc.
    const icons = Object.keys(allIcons)
      .filter(key => key.startsWith('cil') || key.startsWith('cib') || key.startsWith('cis'))
      .reduce((acc, key) => {
        acc[key] = (allIcons as any)[key];
        return acc;
      }, {} as { [key: string]: string[] });

    this.iconSet.icons = icons; // Register only the valid icons
  }
}