import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule, ColComponent, RowComponent, TableModule } from '@coreui/angular';
import { UserDetailResponse } from '../../../../../share/dto/response/user-detail-response';
import { UserService } from '../../../../../core/services/user.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ImgDirective } from '@coreui/angular-pro';
import { PatientResponse } from '../../../../../share/dto/response/patient-response';
import { PatientService } from '../../../../../core/services/patient.service';

@Component({
  selector: 'app-detail-patient',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    ImgDirective
  ],
  standalone: true,
  templateUrl: './detail-patient.component.html',
  styleUrl: './detail-patient.component.scss'
})
export class DetailPatientComponent implements OnInit {
  patientId: string = '';
  patient: PatientResponse = {} as PatientResponse;
  imgUrl: string = 'template/blank_user.png';

  constructor(
    private patientService: PatientService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.patientId = (this.url.snapshot.paramMap.get('id')!) || '';

    try {
      this.spinner.show();
      const fetchedPatient = await firstValueFrom(this.patientService.getPatientById(this.patientId));
      this.patient = { ...fetchedPatient.result };
      this.imgUrl = this.patient.img;

    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  changeImageServer(url: string): string {
    return `http://localhost:8060/patient/images?path=${url}`;
  }
}
