import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonDirective, CardModule, ColComponent, TableModule } from '@coreui/angular';
import { RowComponent } from '@coreui/angular-pro';
import { AppointmentResponse } from '../../../../../../share/dto/response/appoiment-response';
import { AppointmentService } from '../../../../../../core/services/appointment.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { translateStatus } from '../../../../../../share/utils/translator/appointment-translator.utils';
import { UserService } from '../../../../../../core/services/user.service';
import { PatientService } from '../../../../../../core/services/patient.service';
import { jsPDF } from 'jspdf'; // Correct import for jsPDF class
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-detail-appointment',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    ButtonDirective
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
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.appointmentId = this.url.snapshot.paramMap.get('id') || '-1';

    try {
      this.spinner.show();
      const fetchedAppointment = await firstValueFrom (this.appointmentService.getAppointmentById(this.appointmentId));
      this.appointment = { ...fetchedAppointment.result };

      this.appointment.status = translateStatus(this.appointment.status);

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
  printPDF(): void {
    if (!this.appointment) {
       this.snackbar.notifyError('Chưa tải đủ thông tin lịch hẹn để in.');
       return;
    }

    this.spinner.show(); // Show spinner

    // Use the correct ID from your HTML structure
    const data = document.getElementById('DetailsContainer');

    if (!data) {
      console.error("Element with ID 'DetailsContainer' not found!");
      this.snackbar.notifyError('Không tìm thấy nội dung để in.');
      this.spinner.hide(); // Hide spinner on error
      return;
    }

    const options = {
      scale: 2,
      useCORS: true
    };

    html2canvas(data, options).then(canvas => {
      const imgWidth = 208; // A4 width in mm (leaving some margin)
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF (portrait)
      let position = 0;

      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`lich_hen_${this.appointment.id}.pdf`); // Use bill ID in filename
      this.spinner.hide(); // Hide spinner after saving
      this.snackbar.notifySuccess('Đã tạo file PDF thành công.');

    }).catch(error => {
        console.error("Error generating PDF: ", error);
        this.spinner.hide(); // Hide spinner on error
        this.snackbar.notifyError('Lỗi khi tạo file PDF.');
    });
  }
}
