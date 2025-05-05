import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common'; // Import pipes
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { ROUTES } from '../../../../../core/constants/routes.constant'; // Import ROUTES
import { NameIdUserResponse } from '../../../../../share/dto/response/name-id-user-response';
import { NameIdPatientResponse } from '../../../../../share/dto/response/name-id-patient-response';
import { DentalService } from '../../../../../core/services/dental.service';
import { PaymentService } from '../../../../../core/services/payment.service';
import { BillCreateReq } from '../../../../../share/dto/request/bill-create-req';
import { PrescriptionService } from '../../../../../core/services/prescription.service';

@Component({
  selector: 'app-create-payment',
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
    CurrencyPipe, // Import CurrencyPipe
  ],
  providers: [CurrencyPipe, DecimalPipe], // Provide pipes if not already globally provided
  templateUrl: './create-payment.component.html',
  styleUrl: './create-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePaymentComponent implements OnInit {
  patId: string = '';
  preId: string = ''; // ID của toa thuốc được chọn
  patientList: NameIdPatientResponse[] = [];
  allPrescriptions: any[] = []; // Lưu trữ danh sách TẤT CẢ toa thuốc gốc
  prescriptionList: any[] = []; // Danh sách toa thuốc đã lọc để hiển thị
  selectedPatient: string = '';
  validated: boolean = false;
  note: string = '';
  disabledBtnSubmit: boolean = false;
  dentalList: { id: number; name: string; price: number }[] = []; // Full list of available dentals
  selectedDentals: { id: number | null; quantity: number }[] = []; // List of dentals added to the bill
  selectedPrescriptionPrice: number = 0; // Giá của toa thuốc được chọn
  overallTotalPrice: number = 0; // Tổng giá trị hóa đơn

  constructor(
    private patientService: PatientService,
    public cdf: ChangeDetectorRef,
    private snackBar: SnackBarService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private dentalService: DentalService,
    private prescriptionService: PrescriptionService,
    private paymentService: PaymentService, // Inject BillService
    private currencyPipe: CurrencyPipe, // Inject pipes if needed for TS logic (optional here)
    private decimalPipe: DecimalPipe
  ) { }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      // Lấy danh sách bệnh nhân
      const patientResponse: any = await firstValueFrom(
        this.patientService.getNameIdPatientList()
      );
      this.patientList = patientResponse.result;

      // Lấy danh sách dịch vụ nha khoa
      const dentalResponse: any = await firstValueFrom(
        this.dentalService.getAllDental()
      );
      this.dentalList = dentalResponse.result
        .filter((dental: any) => dental.able === true)
        .map((dental: any) => ({
          id: dental.id,
          name: dental.name,
          price: dental.price,
        }));

      // Lấy TẤT CẢ danh sách toa thuốc và lưu vào allPrescriptions
      const prescriptionResponse: any = await firstValueFrom(
        this.prescriptionService.getAllPrescription()
      );
      // --- Lưu danh sách gốc ---
      this.allPrescriptions = prescriptionResponse.result || [];
      // Lọc ban đầu (có thể là rỗng nếu chưa chọn bệnh nhân)
      this.filterPrescriptionsByPatient();

      this.cdf.markForCheck(); // Đảm bảo rằng thay đổi được phát hiện
    } catch (error: any) {
      this.snackBar.notifyError(
        error?.error?.message || 'Lỗi không xác định khi tải dữ liệu'
      );
      console.error('Error loading initial data:', error);
    } finally {
      this.spinner.hide();
    }
    this.calculateTotalPrice(); // Tính tổng ban đầu (thường là 0)
  }

  // --- Hàm lọc danh sách toa thuốc theo patId ---
  private filterPrescriptionsByPatient(): void {
    if (this.patId) {
      // Lọc từ danh sách gốc allPrescriptions
      console.log(this.allPrescriptions)
      this.prescriptionList = this.allPrescriptions.filter(
        (prescription: any) =>
          prescription.pat_id == this.patId && // So sánh pat_id
          prescription.bill_id === null && // Chỉ lấy toa chưa có hóa đơn
          prescription.is_deleted === false // Chỉ lấy toa đang hoạt động (nếu có)
      );
      console.log(this.patId)
      console.log(this.prescriptionList)
    } else {
      // Nếu không có patId, hiển thị danh sách rỗng hoặc tất cả (tùy yêu cầu)
      this.prescriptionList = []; // Hiển thị rỗng nếu chưa chọn bệnh nhân
    }
    // --- Reset lựa chọn toa thuốc hiện tại ---
    this.preId = '';
    this.selectedPrescriptionPrice = 0; // Reset giá toa thuốc khi bệnh nhân thay đổi
    this.calculateTotalPrice(); // Tính lại tổng giá
    this.cdf.markForCheck(); // Cập nhật dropdown toa thuốc
  }

  // --- Xử lý khi chọn toa thuốc ---
  onPrescriptionChange(selectedPreId: string): void {
    this.preId = selectedPreId; // Cập nhật preId
    const selectedPrescription = this.prescriptionList.find(p => p.id.toString() === this.preId);
    this.selectedPrescriptionPrice = selectedPrescription?.total_price || 0;
    console.log('Selected Prescription:', selectedPrescription); // Debug
    console.log('Selected Prescription Price:', this.selectedPrescriptionPrice); // Debug
    this.calculateTotalPrice(); // Tính lại tổng giá
    this.cdf.markForCheck(); // Cập nhật hiển thị giá toa thuốc
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
    // --- Gọi hàm lọc và reset preId ---
    this.filterPrescriptionsByPatient();
    // this.cdf.markForCheck(); // Đã gọi trong filterPrescriptionsByPatient
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
    // --- Gọi hàm lọc và reset preId ---
    this.filterPrescriptionsByPatient();
    // this.cdf.markForCheck(); // Đã gọi trong filterPrescriptionsByPatient
  }

  // --- Dental Selection Logic ---
  addDentalRow(): void {
    // Only add if there are available dentals not yet selected
    if (this.getAvailableDentalsForAdding().length > 0) {
      // --- Thêm id là null ---
      this.selectedDentals.push({ id: null, quantity: 1 });
      this.calculateTotalPrice(); // Tính lại tổng giá
      this.cdf.markForCheck();
    } else {
      this.snackBar.notifyWarning("Đã chọn hết các loại dịch vụ nha khoa có sẵn.");
    }
  }

  removeDentalRow(index: number): void {
    this.selectedDentals.splice(index, 1);
    this.calculateTotalPrice(); // Tính lại tổng giá
    this.cdf.markForCheck();
  }

  // --- Cập nhật khi chọn dịch vụ hoặc thay đổi số lượng ---
  onDentalSelectionChange(): void {
    this.calculateTotalPrice();
    this.cdf.markForCheck();
  }

  onQuantityChange(): void {
    this.calculateTotalPrice();
    this.cdf.markForCheck();
  }

  // Trả về dịch vụ nha khoa có sẵn cho dropdown của một dòng cụ thể
  getAvailableDentals(rowIndex: number): { id: number; name: string }[] {
    const selectedIdsInOtherRows = this.selectedDentals
      .filter((_, index) => index !== rowIndex) // Lọc ra các dòng khác
      .map(med => med.id) // Lấy ID của các dòng khác
      // --- Lọc bỏ null ---
      .filter((id): id is number => id !== null); // Type guard để đảm bảo chỉ còn number

    // Trả về danh sách dịch vụ nha khoa gốc mà ID không nằm trong danh sách đã chọn ở các dòng khác
    return this.dentalList.filter(med => !selectedIdsInOtherRows.includes(med.id));
  }

  // Trả về dịch vụ nha khoa chưa được chọn ở bất kỳ dòng nào (cho nút Thêm dịch vụ nha khoa)
  getAvailableDentalsForAdding(): { id: number; name: string }[] {
    const allSelectedIds = this.selectedDentals
      .map(med => med.id) // Lấy tất cả ID đã chọn
      // --- Lọc bỏ null ---
      .filter((id): id is number => id !== null); // Type guard

    // Trả về danh sách dịch vụ nha khoa gốc mà ID không nằm trong danh sách đã chọn
    return this.dentalList.filter(med => !allSelectedIds.includes(med.id));
  }

  // Lấy tên dịch vụ nha khoa theo ID
  getDentalName(id: number | null): string {
    // --- Xử lý trường hợp id là null ---
    if (id === null) {
      return 'N/A';
    }
    // So sánh number === number
    const found = this.dentalList.find(med => med.id === id);
    return found ? found.name : 'N/A';
  }

  // --- Lấy chi tiết dịch vụ (bao gồm giá) ---
  getDentalDetails(id: number | null): { id: number; name: string; price: number } | undefined {
    if (id === null) return undefined;
    return this.dentalList.find(d => d.id === id);
  }

  // --- Hàm tính tổng giá trị hóa đơn ---
  calculateTotalPrice(): void {
    let dentalTotal = 0;
    this.selectedDentals.forEach(dental => {
      if (dental.id !== null && dental.quantity >= 1) {
        const details = this.getDentalDetails(dental.id);
        dentalTotal += (details?.price || 0) * dental.quantity;
      }
    });
    // Đảm bảo selectedPrescriptionPrice là number
    const prescriptionPrice = Number(this.selectedPrescriptionPrice) || 0;
    this.overallTotalPrice = prescriptionPrice + dentalTotal;
    console.log('Calculated Total Price:', this.overallTotalPrice); // Debug
    this.cdf.markForCheck(); // Cập nhật hiển thị tổng giá
  }

  // --- Form Submission ---
  onSubmit(form: NgForm) {
    this.validated = true; // Trigger validation display
    console.log('Selected Prescription ID:', this.preId); // Kiểm tra preId

    // Check basic form validity (patient selected?)
    if (!this.patId) {
        this.snackBar.notifyError('Vui lòng chọn bệnh nhân.');
        this.validated = false; // Có thể reset validated nếu muốn
        return;
    }

    // Check if form controls (excluding dynamic ones) are valid
    if (form.invalid) {
       // Check specific controls if needed, e.g., form.controls['note']?.invalid
       console.log("Form invalid state:", form.controls);
       // Có thể không cần return ngay nếu lỗi chỉ ở phần dynamic
    }

    // Check if at least one dental is selected OR a prescription is selected
    if (this.selectedDentals.length === 0 && !this.preId) {
      this.snackBar.notifyError('Vui lòng thêm ít nhất một dịch vụ nha khoa hoặc chọn một toa thuốc.');
      return;
    }

    // Check validity of selected dentals (ID selected and quantity >= 1)
    // Chỉ kiểm tra nếu có dịch vụ được chọn
    if (this.selectedDentals.length > 0) {
        const invalidDental = this.selectedDentals.some(dental => dental.id === null || dental.quantity < 1);
        if (invalidDental) {
          this.snackBar.notifyError('Vui lòng chọn dịch vụ nha khoa và nhập số lượng hợp lệ (ít nhất là 1) cho mỗi dòng dịch vụ.');
          return;
        }
    }

    this.disabledBtnSubmit = true; // Disable button during submission
    this.spinner.show();

    // --- Lọc ra các dịch vụ hợp lệ trước khi gửi ---
    const validServices = this.selectedDentals
        .filter((dental): dental is { id: number; quantity: number } => dental.id !== null && dental.quantity >= 1)
        .map(dental => ({
            serviceId: dental.id.toString(), // Chuyển sang string
            quantityService: dental.quantity,
        }));

    const billData : BillCreateReq = {
      patientId: this.patId,
      // --- Gửi preId nếu có giá trị, ngược lại gửi null hoặc undefined ---
      prescriptionId: this.preId ? this.preId : '', 
      note: this.note,
      services: validServices // Gửi mảng dịch vụ đã lọc
    };

    console.log('Submitting Bill Data:', billData);

    this.paymentService.createBill(billData).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        this.snackBar.notifySuccess((response.message || 'Thêm hóa đơn thành công!') + " - Đang chuyển hướng...");
        setTimeout(() => {
          this.goToBillList();
        }, 2000); // Giảm thời gian chờ
      },
      error: (error: any) => {
        this.spinner.hide();
        this.disabledBtnSubmit = false; // Re-enable button on error
        this.snackBar.notifyError(error?.error?.message || 'Có lỗi xảy ra khi thêm hóa đơn.');
        console.error('Bill creation error:', error);
        this.cdf.markForCheck();
      },
      complete: () => {
        // Optional: Actions on completion regardless of success/error
        this.spinner.hide();
        this.cdf.markForCheck();
      }
    });
  }

  goToBillList() {
    this.router.navigate([ROUTES.RECEPTIONIST.children.PAYMENT.children.LIST.fullPath]);
  }
}
