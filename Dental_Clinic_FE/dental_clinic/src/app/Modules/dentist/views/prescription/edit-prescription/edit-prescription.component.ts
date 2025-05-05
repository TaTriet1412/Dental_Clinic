import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ButtonDirective,
  CardModule,
  ColComponent,
  FormControlDirective,
  FormDirective,
  FormFeedbackComponent,
  FormLabelDirective, // Import FormLabelDirective
  FormSelectDirective,
  RowComponent,
  TimePickerModule,
} from '@coreui/angular-pro';
import { DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { PatientService } from '../../../../../core/services/patient.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { UserService } from '../../../../../core/services/user.service';
import { MaterialService } from '../../../../../core/services/material.service'; // Assuming this service exists
import { PrescriptionService } from '../../../../../core/services/prescription.service'; // Import PrescriptionService
import { ROUTES } from '../../../../../core/constants/routes.constant'; // Import ROUTES
import { NameIdUserResponse } from '../../../../../share/dto/response/name-id-user-response';
import { NameIdPatientResponse } from '../../../../../share/dto/response/name-id-patient-response';
import { AuthService } from '../../../../../core/services/auth.service';

@Component({
  selector: 'app-edit-prescription',
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
    FormLabelDirective, // Add FormLabelDirective here
    // FormCheckModule, // Add if needed
  ],
  templateUrl: './edit-prescription.component.html',
  styleUrl: './edit-prescription.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPrescriptionComponent implements OnInit {
  patId: string = '';
  denId: number = -1;
  actorName: string = ''; // Name of the dentist (den_name)
  patientList: NameIdPatientResponse[] = [];
  selectedPatient: string = '';
  validated: boolean = false;
  note: string = '';
  disabledBtnSubmit: boolean = false;
  medicineList: { id: number; name: string; price: number }[] = []; // Full list of available medicines
  selectedMedicines: { id: number | null; quantity: number }[] = []; // List of medicines added to the prescription
  prescription: any;
  prescriptionId: string = ''; // ID of the prescription to be edited

  constructor(
    private patientService: PatientService,
    private userService: UserService,
    public cdf: ChangeDetectorRef,
    private snackBar: SnackBarService,
    private router: Router,
    private url: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private materialService: MaterialService,
    private prescriptionService: PrescriptionService,
    private authService: AuthService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.denId = this.authService.getUserId() || -1; // Lấy denId từ authService
      this.actorName = this.authService.getName(); // Lấy tên bác sĩ từ userService

      // Lấy danh sách bệnh nhân
      const patientResponse: any = await firstValueFrom(
        this.patientService.getNameIdPatientList()
      );
      this.patientList = patientResponse.result;

      // Lấy danh sách thuốc
      const medicineResponse: any = await firstValueFrom(
        this.materialService.getAllMedicine()
      );
      this.medicineList = medicineResponse.result
        .filter((medicine: any) => medicine.able === true)
        .map((medicine: any) => ({
          id: medicine.id,
          name: medicine.name,
          price: medicine.price,
        }));

      this.prescriptionId = this.url.snapshot.paramMap.get('id') || '';
      const fetchedPrescription: any = await firstValueFrom(
        this.prescriptionService.getPrescriptionById(this.prescriptionId)
      );

      this.prescription = fetchedPrescription.result;
      if(this.prescription.is_deleted) {
        this.disabledBtnSubmit = true;
      }
      this.patId = this.prescription.pat_id.toString();
      this.selectedPatient = this.patientList.find(
        (patient) => patient.id.toString() === this.patId
      )?.name || '';
      this.note = this.prescription.note || '';
      this.selectedMedicines = this.prescription.medicines.map((med: any) => ({
        id: med.med_id,
        quantity: med.quantity_medicine,
      }));


      this.cdf.markForCheck(); // Đảm bảo rằng thay đổi được phát hiện
    } catch (error: any) {
      this.snackBar.notifyError(
        error?.error?.message || 'Lỗi không xác định khi tải dữ liệu'
      );
      console.error('Error loading initial data:', error);
    } finally {
      this.spinner.hide();
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

    const matchedPatient = this.patientList.find(
      (patient) => patient.id.toString() === this.patId
    );

    if (matchedPatient) {
      this.selectedPatient = matchedPatient.name;
    } else {
      this.selectedPatient = '';
    }
    this.cdf.markForCheck();
  }

  onPatientChange(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value;
    this.selectedPatient = selectedName;
    const matchedPatient = this.patientList.find(
      (patient) => patient.name === selectedName
    );

    if (matchedPatient) {
      this.patId = matchedPatient.id.toString();
    } else {
      this.patId = '';
    }
    this.cdf.markForCheck();
  }


  // --- Medicine Selection Logic ---

  addMedicineRow(): void {
    // Only add if there are available medicines not yet selected
    if (this.getAvailableMedicinesForAdding().length > 0) {
      // --- Thêm id là null ---
      this.selectedMedicines.push({ id: null, quantity: 1 });
      this.cdf.markForCheck();
    } else {
      this.snackBar.notifyWarning("Đã chọn hết các loại thuốc có sẵn.");
    }
  }

  removeMedicineRow(index: number): void {
    this.selectedMedicines.splice(index, 1);
    this.cdf.markForCheck();
  }

  // Trả về thuốc có sẵn cho dropdown của một dòng cụ thể
  getAvailableMedicines(rowIndex: number): { id: number; name: string }[] {
    const selectedIdsInOtherRows = this.selectedMedicines
      .filter((_, index) => index !== rowIndex) // Lọc ra các dòng khác
      .map(med => med.id) // Lấy ID của các dòng khác
      // --- Lọc bỏ null ---
      .filter((id): id is number => id !== null); // Type guard để đảm bảo chỉ còn number

    // Trả về danh sách thuốc gốc mà ID không nằm trong danh sách đã chọn ở các dòng khác
    return this.medicineList.filter(med => !selectedIdsInOtherRows.includes(med.id));
  }

  // Trả về thuốc chưa được chọn ở bất kỳ dòng nào (cho nút Thêm thuốc)
  getAvailableMedicinesForAdding(): { id: number; name: string }[] {
    const allSelectedIds = this.selectedMedicines
      .map(med => med.id) // Lấy tất cả ID đã chọn
      // --- Lọc bỏ null ---
      .filter((id): id is number => id !== null); // Type guard

    // Trả về danh sách thuốc gốc mà ID không nằm trong danh sách đã chọn
    return this.medicineList.filter(med => !allSelectedIds.includes(med.id));
  }


  // Lấy tên thuốc theo ID
  getMedicineName(id: number | null): string {
    // --- Xử lý trường hợp id là null ---
    if (id === null) {
      return 'N/A';
    }
    // So sánh number === number
    const found = this.medicineList.find(med => med.id === id);
    return found ? found.name : 'N/A';
  }

  // --- Form Submission ---
  onSubmit(form: NgForm) {
    this.validated = true; // Trigger validation display

    // Check basic form validity
    if (form.invalid || this.prescription.is_deleted) {
      return;
    }

    // Check if at least one medicine is selected and valid
    if (this.selectedMedicines.length === 0) {
      this.snackBar.notifyError('Vui lòng thêm ít nhất một loại thuốc.');
      return;
    }

    // Check validity of selected medicines (ID selected and quantity >= 1)
    const invalidMedicine = this.selectedMedicines.some(med => !med.id || med.quantity < 1);
    if (invalidMedicine) {
      this.snackBar.notifyError('Vui lòng chọn thuốc và nhập số lượng hợp lệ (ít nhất là 1) cho mỗi dòng thuốc.');
      return;
    }

    this.disabledBtnSubmit = true; // Disable button during submission
    this.spinner.show();

    const prescriptionData = {
      id: this.prescriptionId, // ID of the prescription to be edited
      pat_id: this.patId,
      den_id: (this.denId),
      den_name: this.actorName,
      note: this.note,
      medicines: this.selectedMedicines.map(med => ({ // Format for backend
        med_id: Number(med.id),
        quantity_medicine: med.quantity,
        price: this.medicineList.find(m => m.id === Number(med.id))?.price || 0, // Get price from the full list
      }))
    };

    console.log('Prescription Data:', prescriptionData); // Debugging line

    this.prescriptionService.updatePrescription(prescriptionData).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.snackBar.notifySuccess((response.message || 'Cập nhật toa thuốc thành công!'));

      },
      error: (error: any) => {
        this.spinner.hide();
        this.snackBar.notifyError(error?.error?.message || 'Có lỗi xảy ra khi cập nhật toa thuốc.');
        console.error('Prescription creation error:', error);
        this.cdf.markForCheck();
      },
      complete: () => {
        // Optional: Actions on completion regardless of success/error
        this.disabledBtnSubmit = false; // Re-enable button on error
        this.spinner.hide();
        this.cdf.markForCheck();
      }
    });
  }
}
