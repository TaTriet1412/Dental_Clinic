import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FullCalendarModule } from '@fullcalendar/angular'; // Module FullCalendar
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Cho Form trong Dialog

// Import các Module của Angular Material cần dùng
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Cần cho MatDatepicker
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { EventDialogComponent } from './event-dialog/event-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    ScheduleComponent,
    EventDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FullCalendarModule, // Import module FullCalendar
    FormsModule,
    ReactiveFormsModule,

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
    MatSnackBarModule
  ],
  providers: [
    // MatDatepicker cần MatNativeDateModule hoặc adapter khác
    MatNativeDateModule,
  ],
  bootstrap: [AppComponent]
  // entryComponents không cần thiết từ Angular 9+
})
export class AppModule { }