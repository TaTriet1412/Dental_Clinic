import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule, ColComponent, TableModule } from '@coreui/angular';
import { RowComponent } from '@coreui/angular-pro';
import { AppointmentResponse } from '../../../../../../share/dto/response/appoiment-response';
import { AppointmentService } from '../../../../../../core/services/appointment.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { AppointmentSupportService } from '../../../../../../core/services/support/appointment-support.service';
import { UserService } from '../../../../../../core/services/user.service';
import { PatientService } from '../../../../../../core/services/patient.service';

@Component({
  selector: 'app-detail-appointment',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule
  ],
  standalone: true,
  templateUrl: './detail-appointment.component.html',
  styleUrl: './detail-appointment.component.scss'
})
export class DetailAppointmentComponent  implements OnInit {
  appointmentId: string = '-1';
  appointment: AppointmentResponse = {} as AppointmentResponse;
  patientName: string = '';
  dentistName: string = '';
  assistantName: string = '';

  constructor(
    private appointmentService: AppointmentService,
    private userService: UserService,
    private patientService: PatientService,
    // private cdr: ChangeDetectorRef,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
    private appointmentSupportService: AppointmentSupportService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.appointmentId = this.url.snapshot.paramMap.get('id') || '-1';

    try {
      this.spinner.show();
      const fetchedAppointment = await firstValueFrom (this.appointmentService.getAppointmentById(this.appointmentId));
      this.appointment = { ...fetchedAppointment.result };

      this.appointment.status = this.appointmentSupportService.translateStatus(this.appointment.status);

      const fetchedNameIdDentist = await firstValueFrom(this.userService.getNameIdUserById(this.appointment.denId));
      this.dentistName = fetchedNameIdDentist.result.name;
      const fetchedNameIdAssistant = await firstValueFrom(this.userService.getNameIdUserById(this.appointment.assiId));
      this.assistantName = fetchedNameIdAssistant.result.name;
      const fetchedNameIdPatient = await firstValueFrom(this.patientService.getNameIdPatientById(this.appointment.patId));
      this.patientName = fetchedNameIdPatient.result.name;
    }catch (error:any) {
      this.snackbar.notifyError(error.error.message);
    }finally {
      this.spinner.hide();
    }
  }

}
