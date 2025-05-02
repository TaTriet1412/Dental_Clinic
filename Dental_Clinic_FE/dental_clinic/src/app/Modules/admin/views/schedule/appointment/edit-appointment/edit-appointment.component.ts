import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ButtonDirective, CardModule, ColComponent, ColDirective, FormDirective, FormFeedbackComponent, FormSelectDirective, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { DatePickerModule, FormControlDirective, TimePickerModule } from '@coreui/angular-pro';
import { NameIdUserResponse } from '../../../../../../share/dto/response/name-id-user-response';
import { CommonModule } from '@angular/common';
import { NameIdPatientResponse } from '../../../../../../share/dto/response/name-id-patient-response';
import { PatientService } from '../../../../../../core/services/patient.service';
import { UserService } from '../../../../../../core/services/user.service';
import { DateSupportService } from '../../../../../../core/services/support/date.service';
import { AppointmentService } from '../../../../../../core/services/appointment.service';
import { firstValueFrom } from 'rxjs';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../../../core/constants/routes.constant';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppointmentResponse } from '../../../../../../share/dto/response/appoiment-response';
import { AppointmentUpdateReq } from '../../../../../../share/dto/request/appointment-update-request';
@Component({
  selector: 'app-edit-appointment',
  standalone: true,
  imports: [
    RowComponent,
    ColComponent,
    CardModule,
    FormFeedbackComponent,
    FormsModule,
    FormSelectDirective,
    ReactiveFormsModule,
    CommonModule,
    ButtonDirective,
    DatePickerModule,
    FormDirective,
    FormControlDirective,
    TimePickerModule,
  ],
  templateUrl: './edit-appointment.component.html',
  styleUrl: './edit-appointment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,

})

export class EditAppointmentComponent implements OnInit {

  patId: string = '';
  denId: string = '';
  assiId: string = '';
  patientList: NameIdPatientResponse[] = [];
  dentistList: NameIdUserResponse[] = [];
  assistantList: NameIdUserResponse[] = [];
  selectedPatient: string = '';
  selectedDentist: string = '';
  selectedAssistant: string = '';
  validated: boolean = false;
  minStartStr: string;
  minEndStr: string;
  minStartDate: Date;
  minEndDate: Date;
  startTime? = new Date();
  endTime? = new Date(new Date().getTime() + 3 * 60 * 60 * 1000); // Thời gian kết thúc mặc định là 3 tiếng sau thời gian bắt đầu
  today = new Date();
  symptom: string = '';
  note: string = '';
  startDate? = new Date();
  endDate? = new Date();
  disabledBtnSubmit: boolean = false;
  appointmentId: string = '-1'; // ID của lịch hẹn hiện tại
  appointment: AppointmentResponse = {} as AppointmentResponse; // Dữ liệu lịch hẹn hiện tại

  constructor(
    private patientService: PatientService,
    private userService: UserService, // Giả sử có service cho bác sĩ
    private cdf: ChangeDetectorRef,
    private dateSupportService: DateSupportService,
    private appointmentService: AppointmentService,
    private snackBar: SnackBarService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {
    this.minStartStr = this.formatDateTimeForInput(this.today); // Ngày bắt đầu phải là ngày hiện tại
    this.minEndStr = this.formatDateTimeForInput(this.today); // Ngày kết thúc ít nhất là ngày hiện tại
    this.minStartDate = new Date(this.minStartStr)
    this.minEndDate = new Date(this.minEndStr)
  }

  async ngOnInit(): Promise<void> {
    this.appointmentId = this.url.snapshot.paramMap.get('id') || '-1';

    try {
      const fetchedAppointment = await firstValueFrom(this.appointmentService.getAppointmentById(this.appointmentId));
      this.appointment = { ...fetchedAppointment.result };
      console.log(this.appointment);

      // Lấy danh sách bệnh nhân
      const patientResponse: any = await firstValueFrom(this.patientService.getNameIdPatientList());
      this.patientList = patientResponse.result;

      // Lấy danh sách bác sĩ
      const dentistResponse: any = await firstValueFrom(this.userService.getNameIdUserListByRoleId(3));
      this.dentistList = dentistResponse.result;

      // Lấy danh sách phụ tá
      const assistantResponse: any = await firstValueFrom(this.userService.getNameIdUserListByRoleId(4));
      this.assistantList = assistantResponse.result;


      this.startDate = new Date(this.appointment.timeStart);
      this.endDate = new Date(this.appointment.timeEnd);
      this.startTime = new Date(this.appointment.timeStart);
      this.endTime = new Date(this.appointment.timeEnd);
      this.patId = this.appointment.patId.toString();
      this.denId = this.appointment.denId.toString();
      this.assiId = this.appointment.assiId.toString();
      this.note = this.appointment.note;
      this.symptom = this.appointment.symptom;

      this.selectedPatient = this.patientList.find(patient => patient.id.toString() === this.patId)?.name || '';
      this.selectedDentist = this.dentistList.find(dentist => dentist.id.toString() === this.denId)?.name || '';
      this.selectedAssistant = this.assistantList.find(assistant => assistant.id.toString() === this.assiId)?.name || '';


      this.cdf.markForCheck(); // Đảm bảo rằng thay đổi được phát hiện
    } catch (error: any) {
      this.snackBar.notifyError(error.error.message);
    }
  }

  // --- Helper: Format Date thành chuỗi 'yyyy-MM-ddTHH:mm' cho input ---
  private formatDateTimeForInput(dateInput: string | Date | undefined): string {
    if (!dateInput) return '';
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        console.error("Invalid date input for formatting:", dateInput);
        return '';
      }
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error("Error formatting date for input:", dateInput, error);
      return '';
    }
  }

  minDateForDatePicker(minDate: Date): Date {
    const yesterday = minDate;
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
  }

  onPatIdInput(event: Event) {
    const inputCodePatId = event.target as HTMLInputElement;
    this.patId = inputCodePatId.value;

    const matchedPatient = this.patientList.find((patient) => patient.id.toString() === this.patId);

    if (matchedPatient) {
      this.selectedPatient = matchedPatient.name;
    } else {
      this.selectedPatient = '';
    }
  }

  onPatientChange(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value;
    this.selectedPatient = selectedName;
    const matchedPatient = this.patientList.find(assistant => assistant.name === selectedName);

    if (matchedPatient) {
      this.patId = matchedPatient.id.toString();
    } else {
      this.patId = '';
    }
  }


  onDentistChange(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value;
    this.selectedDentist = selectedName;
    const matchedDentist = this.dentistList.find(dentist => dentist.name === selectedName);

    if (matchedDentist) {
      this.denId = matchedDentist.id.toString();
    } else {
      this.denId = '';
    }
  }

  onDenIdInput(event: Event) {
    const inputCodeDenId = event.target as HTMLInputElement;
    this.denId = inputCodeDenId.value;
    const matchedDentist = this.dentistList.find((dentist) => dentist.id.toString() === this.denId);

    if (matchedDentist) {
      this.selectedDentist = matchedDentist.name;
    } else {
      this.selectedDentist = '';
    }
  }

  onAssistantChange(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value;
    this.selectedAssistant = selectedName;
    const matchedAssistant = this.assistantList.find(assistant => assistant.name === selectedName);

    if (matchedAssistant) {
      this.assiId = matchedAssistant.id.toString();
    } else {
      this.assiId = '';
    }
  }

  onAssiIdInput(event: Event) {
    const inputCodeAssiId = event.target as HTMLInputElement;
    this.assiId = inputCodeAssiId.value;
    const matchedAssistant = this.assistantList.find((assistant) => assistant.id.toString() === this.assiId);

    if (matchedAssistant) {
      this.selectedAssistant = matchedAssistant.name;
    } else {
      this.selectedAssistant = '';
    }
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      const appointmentUpdateReq: AppointmentUpdateReq = {
        id: this.appointmentId,
        denId: Number(this.denId),
        assiId: Number(this.assiId),
        patId: this.patId,
        timeStart: this.dateSupportService.combineDateAndTime(this.startDate!, this.startTime!),
        timeEnd: this.dateSupportService.combineDateAndTime(this.endDate!, this.endTime!),
        note: this.note,
        symptom: this.symptom,
      }

      this.spinner.show(); // Hiển thị spinner khi bắt đầu tạo lịch hẹn
      this.disabledBtnSubmit = true; // Disable button sau khi tạo lịch hẹn thành công
      this.appointmentService.updateAppointment(appointmentUpdateReq).subscribe({
        next: (response: any) => {
          this.spinner.hide(); // Ẩn spinner khi tạo lịch hẹn thành công
          this.snackBar.notifySuccess(response.message);
        },
        error: (error) => {
          this.spinner.hide(); // Ẩn spinner khi có lỗi xảy ra
          this.snackBar.notifyError(error.error.message);
          this.cdf.markForCheck(); // Đảm bảo rằng thay đổi được phát hiện
        }
      });
      this.disabledBtnSubmit = false; // Enable button nếu có lỗi xảy ra
    }
  }
}
