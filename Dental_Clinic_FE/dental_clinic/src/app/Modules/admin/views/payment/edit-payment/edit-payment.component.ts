import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common'; // Import pipes
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
import { ROUTES } from '../../../../../core/constants/routes.constant'; // Import ROUTES
import { NameIdUserResponse } from '../../../../../share/dto/response/name-id-user-response';
import { NameIdPatientResponse } from '../../../../../share/dto/response/name-id-patient-response';
import { DentalService } from '../../../../../core/services/dental.service';
import { PaymentService } from '../../../../../core/services/payment.service';
import { BillCreateReq } from '../../../../../share/dto/request/bill-create-req';
import { PrescriptionService } from '../../../../../core/services/prescription.service';
import { BillUpdateReq } from '../../../../../share/dto/request/bill-update-req';

@Component({
  selector: 'app-edit-payment',
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
  providers: [CurrencyPipe, DecimalPipe], 
  templateUrl: './edit-payment.component.html',
  styleUrl: './edit-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPaymentComponent implements OnInit {
  patId: string = '';
  preId: string = ''; // ID của toa thuốc được chọn
  billId: number = -1; // ID của toa thuốc được chọn (để gửi lên server)
  bill: any;
  patientList: NameIdPatientResponse[] = [];
  allPrescriptions: any[] = []; // Lưu trữ danh sách TẤT CẢ toa thuốc gốc
  prescriptionList: any[] = []; // Danh sách toa thuốc đã lọc để hiển thị
  selectedPatient: string = '';
  validated: boolean = false;
  note: string = '';
  disabledBtnSubmit: boolean = false;
  dentalList: { id: string; name: string; price: number }[] = []; // Full list of available dentals
  selectedDentals: { id: string | null; quantity: number }[] = []; // List of dentals added to the bill
  selectedPrescriptionPrice: number = 0; // Giá của toa thuốc được chọn
  overallTotalPrice: number = 0; // Tổng giá trị hóa đơn
  originalPrescriptionId: string | null = null; // Lưu ID toa thuốc gốc của hóa đơn

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
    private decimalPipe: DecimalPipe,
    private url: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    try {
      this.billId = Number(this.url.snapshot.paramMap.get('id')) || -1;
      const fetchedBill = await firstValueFrom(
        this.paymentService.getBillById(this.billId)
      );
      console.log('Fetched Bill:', fetchedBill); // Debug

      if (!fetchedBill?.result) {
        throw new Error("Không tìm thấy thông tin hóa đơn.");
      }
      this.bill = fetchedBill.result;
      this.note = this.bill.note || '';
      this.patId = this.bill.patientId.toString();
      this.originalPrescriptionId = this.bill.prescriptionId ? this.bill.prescriptionId.toString() : null;

      // Fetch patient details
      const fetchedPatient = await firstValueFrom(
        this.patientService.getPatientById(this.patId)
      );
      this.selectedPatient = fetchedPatient?.result?.name || '';

      // Fetch patient list
      const patientResponse: any = await firstValueFrom(
        this.patientService.getNameIdPatientList()
      );
      this.patientList = patientResponse.result || [];

      // Fetch dental list
      const dentalResponse: any = await firstValueFrom(
        this.dentalService.getAllDental()
      );
      this.dentalList = (dentalResponse.result || [])
        .filter((dental: any) => dental.able === true)
        .map((dental: any) => ({
          id: dental.id.toString(), // Đảm bảo id là string
          name: dental.name,
          price: dental.price,
        }));
      console.log('Dental List with string IDs:', this.dentalList); // Debug

      // Fetch ALL prescriptions
      const prescriptionResponse: any = await firstValueFrom(
        this.prescriptionService.getAllPrescription()
      );
      this.allPrescriptions = prescriptionResponse.result || [];

      // --- Populate selectedDentals from billServiceEntities - Keep id as string ---
      if (Array.isArray(this.bill.billServiceEntities)) {
          this.selectedDentals = this.bill.billServiceEntities.map((serviceEntity: any) => {
              // --- Lấy serviceId trực tiếp (là string) ---
              const serviceIdAsString = serviceEntity.serviceId;
              // --- Kiểm tra serviceId có tồn tại và là string không ---
              if (typeof serviceIdAsString !== 'string' || !serviceIdAsString) {
                   console.error(`Invalid or missing serviceId found in billServiceEntities: ${serviceEntity.serviceId}`);
                   return { id: null, quantity: serviceEntity.quantityService || 1 };
              }
              // --- Kiểm tra xem ID này có trong dentalList không (để đảm bảo hợp lệ) ---
              const existsInDentalList = this.dentalList.some(d => d.id === serviceIdAsString);
              if (!existsInDentalList) {
                  console.warn(`Service ID ${serviceIdAsString} from bill exists but not found or not 'able' in current dentalList.`);
                  // return { id: null, quantity: serviceEntity.quantityService || 1 }; // Option: Bỏ qua nếu không tìm thấy
              }

              return {
                  id: serviceIdAsString, // Sử dụng ID dạng string
                  quantity: serviceEntity.quantityService || 1
              };
          // --- Lọc bỏ các mục có id là null nếu có lỗi hoặc quyết định bỏ qua ---
          }).filter((dental:any): dental is { id: string; quantity: number } => dental.id !== null); // Type guard cho string
      } else {
          console.warn("bill.billServiceEntities is not an array or is missing.");
          this.selectedDentals = [];
      }
      console.log('Populated selectedDentals (string IDs):', this.selectedDentals); // Debug

      // --- Lọc danh sách toa thuốc ban đầu (bao gồm cả toa gốc) ---
      this.filterPrescriptionsByPatient();

      // --- Đặt giá trị ban đầu cho preId và tính giá ---
      if (this.originalPrescriptionId) {
        this.preId = this.originalPrescriptionId;
        this.onPrescriptionChange(this.preId);
      } else {
        this.preId = '';
        this.calculateTotalPrice();
      }

      this.cdf.markForCheck();
    } catch (error: any) {
      this.snackBar.notifyError(
        error?.error?.message || 'Lỗi không xác định khi tải dữ liệu'
      );
      console.error('Error loading initial data:', error);
    } finally {
      this.spinner.hide();
    }
    // this.calculateTotalPrice(); // Đã gọi trong if/else ở trên hoặc trong onPrescriptionChange
  }

  // --- Hàm lọc danh sách toa thuốc theo patId ---
  private filterPrescriptionsByPatient(): void {
    let availablePrescriptions: any[] = [];
    if (this.patId) {
      // 1. Lọc các toa thuốc khả dụng (chưa có bill_id) cho bệnh nhân này
      availablePrescriptions = this.allPrescriptions.filter(
        (prescription: any) =>
          prescription.pat_id.toString() === this.patId && // So sánh pat_id
          prescription.bill_id === null && // Chỉ lấy toa chưa có hóa đơn
          prescription.is_deleted === false // Chỉ lấy toa đang hoạt động
      );
      console.log(`Available prescriptions for patient ${this.patId}:`, availablePrescriptions);

      // 2. Tìm thông tin toa thuốc gốc
      if (this.originalPrescriptionId) {
        const originalPrescriptionDetails = this.allPrescriptions.find(
          p => p.id.toString() === this.originalPrescriptionId
        );

        // 3. Nếu tìm thấy toa gốc và nó chưa có trong danh sách khả dụng, thêm vào
        if (originalPrescriptionDetails) {
          const isOriginalAlreadyIncluded = availablePrescriptions.some(
            p => p.id.toString() === this.originalPrescriptionId
          );
          if (!isOriginalAlreadyIncluded) {
            console.log('Adding original prescription to the list:', originalPrescriptionDetails);
            // Thêm vào đầu danh sách để dễ thấy
            availablePrescriptions.unshift(originalPrescriptionDetails);
          }
        } else {
            console.warn(`Original prescription with ID ${this.originalPrescriptionId} not found in allPrescriptions.`);
        }
      }

    } else {
      availablePrescriptions = []; // Hiển thị rỗng nếu chưa chọn bệnh nhân
    }

    this.prescriptionList = availablePrescriptions;

    // --- Không reset preId ở đây nữa, nó sẽ được set trong ngOnInit hoặc onPatientChange ---
    // this.preId = '';
    // this.selectedPrescriptionPrice = 0;
    // this.calculateTotalPrice();
    this.cdf.markForCheck(); // Cập nhật dropdown toa thuốc
  }

  // --- Xử lý khi chọn toa thuốc ---
  onPrescriptionChange(selectedPreId: string | null): void { // Cho phép null
    this.preId = selectedPreId || ''; // Cập nhật preId, đảm bảo là chuỗi
    const selectedPrescription = this.allPrescriptions.find(p => p.id.toString() === this.preId); // Tìm trong allPrescriptions
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
    const newPatId = inputCodePatId.value;

    // Chỉ lọc lại nếu patId thực sự thay đổi
    if (newPatId !== this.patId) {
        this.patId = newPatId;
        const matchedPatient = this.patientList.find(
          (patient) => patient.id.toString() === this.patId
        );
        this.selectedPatient = matchedPatient ? matchedPatient.name : '';

        // Lọc lại danh sách toa thuốc VÀ reset lựa chọn toa thuốc hiện tại
        this.filterPrescriptionsByPatient();
        this.preId = ''; // Reset lựa chọn toa thuốc
        this.selectedPrescriptionPrice = 0; // Reset giá
        this.calculateTotalPrice(); // Tính lại tổng
    }
  }

  onPatientChange(event: Event) {
    const selectedName = (event.target as HTMLSelectElement).value;
    const matchedPatient = this.patientList.find(
      (patient) => patient.name === selectedName
    );
    const newPatId = matchedPatient ? matchedPatient.id.toString() : '';

    // Chỉ lọc lại nếu patId thực sự thay đổi
    if (newPatId !== this.patId) {
        this.selectedPatient = selectedName;
        this.patId = newPatId;

        // Lọc lại danh sách toa thuốc VÀ reset lựa chọn toa thuốc hiện tại
        this.filterPrescriptionsByPatient();
        this.preId = ''; // Reset lựa chọn toa thuốc
        this.selectedPrescriptionPrice = 0; // Reset giá
        this.calculateTotalPrice(); // Tính lại tổng
    }
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
  getAvailableDentals(rowIndex: number): { id: string; name: string }[] {
    const selectedIdsInOtherRows = this.selectedDentals
      .filter((_, index) => index !== rowIndex) // Lọc ra các dòng khác
      .map(med => med.id) // Lấy ID của các dòng khác
      // --- Lọc bỏ null ---
      .filter((id): id is string => id !== null); // Type guard để đảm bảo chỉ còn string

    // Trả về danh sách dịch vụ nha khoa gốc mà ID không nằm trong danh sách đã chọn ở các dòng khác
    return this.dentalList.filter(med => !selectedIdsInOtherRows.includes(med.id));
  }

  // Trả về dịch vụ nha khoa chưa được chọn ở bất kỳ dòng nào (cho nút Thêm dịch vụ nha khoa)
  getAvailableDentalsForAdding(): { id: string; name: string }[] {
    const allSelectedIds = this.selectedDentals
      .map(med => med.id) // Lấy tất cả ID đã chọn
      // --- Lọc bỏ null ---
      .filter((id): id is string => id !== null); // Type guard

    // Trả về danh sách dịch vụ nha khoa gốc mà ID không nằm trong danh sách đã chọn
    return this.dentalList.filter(med => !allSelectedIds.includes(med.id));
  }

  // Lấy tên dịch vụ nha khoa theo ID
  getDentalName(id: string | null): string {
    // --- Xử lý trường hợp id là null ---
    if (id === null) {
      return 'N/A';
    }
    // So sánh string === string
    const found = this.dentalList.find(med => med.id === id);
    return found ? found.name : 'N/A';
  }

  // --- Lấy chi tiết dịch vụ (bao gồm giá) ---
  getDentalDetails(id: string | null): { id: string; name: string; price: number } | undefined {
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
        .filter((dental): dental is { id: string; quantity: number } => dental.id !== null && dental.quantity >= 1)
        .map(dental => ({
            serviceId: dental.id, // Giữ nguyên string
            quantityService: dental.quantity,
        }));

    const billData : BillUpdateReq = {
      id: this.billId,
      prescriptionId: this.preId ? this.preId : '',
      note: this.note,
      services: validServices // Gửi mảng dịch vụ đã lọc
    };

    console.log('Submitting Bill Update Data:', billData);

    this.paymentService.updateBill(billData).subscribe({ // Chỉ cần truyền billData
        next: (response: any) => {
            this.spinner.hide();
            this.snackBar.notifySuccess((response.message || 'Cập nhật hóa đơn thành công!') + " - Đang chuyển hướng...");
            setTimeout(() => {
              this.goToBillList();
            }, 1500);
          },
          error: (error: any) => {
            this.spinner.hide();
            this.disabledBtnSubmit = false;
            this.snackBar.notifyError(error?.error?.message || 'Có lỗi xảy ra khi cập nhật hóa đơn.');
            console.error('Bill update error:', error);
            this.cdf.markForCheck();
          },
          complete: () => {
            this.spinner.hide();
            this.cdf.markForCheck();
          }
    });
  }

  goToBillList() {
    this.router.navigate([ROUTES.ADMIN.children.PAYMENT.children.LIST.fullPath]);
  }
}
