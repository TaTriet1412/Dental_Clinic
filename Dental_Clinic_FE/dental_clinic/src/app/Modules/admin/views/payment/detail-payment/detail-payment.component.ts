import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common'; // Import pipes and CommonModule
import { CardModule, ColComponent, RowComponent, TableModule, ButtonDirective } from '@coreui/angular'; // Import TableModule, ButtonDirective
import { PaymentService } from '../../../../../core/services/payment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom, take } from 'rxjs';
import { DentalService } from '../../../../../core/services/dental.service';
import { PatientService } from '../../../../../core/services/patient.service'; // Import PatientService
import { PrescriptionService } from '../../../../../core/services/prescription.service'; // Import PrescriptionService
import { SnackBarService } from '../../../../../core/services/snack-bar.service'; // Import SnackBarService
import { NgxSpinnerService } from 'ngx-spinner'; // Import NgxSpinnerService
import { PatientResponse } from '../../../../../share/dto/response/patient-response'; // Assuming this type exists
import { DentalResponse } from '../../../../../share/dto/response/dental-response'; // Assuming this type exists
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { jsPDF } from 'jspdf'; // Correct import for jsPDF class
import html2canvas from 'html2canvas';


const customFonts = {
  Roboto: {
    normal: 'Roboto-Regular.ttf',
    bold: 'Roboto-Medium.ttf',
    italics: 'Roboto-Italic.ttf',
    bolditalics: 'Roboto-MediumItalic.ttf'
  }
};


// Interface for detailed service display
interface DetailedService {
  serviceId: string;
  name: string;
  quantity: number;
  unitPrice: number; // Đơn giá
  totalPrice: number; // Thành tiền (servicePrice từ API)
}

// Interface for payment transaction (adjust based on actual API response)
interface PaymentTransaction {
  id: number;
  amountPaid: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  // Add other potential fields like vnp_TransactionNo, vnp_BankCode etc. if available
  vnp_TransactionNo?: string;
  vnp_BankCode?: string;
}

@Component({
  selector: 'app-detail-payment',
  imports: [
    CommonModule, // Add CommonModule
    RowComponent,
    ColComponent,
    CardModule,
    TableModule, // Add TableModule
    ButtonDirective, // Add ButtonDirective
    CurrencyPipe, // Add CurrencyPipe
    DecimalPipe, // Add DecimalPipe
    DatePipe, // Add DatePipe
  ],
  standalone: true,
  templateUrl: './detail-payment.component.html',
  styleUrl: './detail-payment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Add ChangeDetectionStrategy
  providers: [CurrencyPipe, DecimalPipe, DatePipe] // Provide pipes
})
export class DetailPaymentComponent implements OnInit {
  billId: number = -1;
  bill: any | null = null; // Use specific type
  patient: PatientResponse | null = null; // Store patient details
  prescription: any | null = null; // Store prescription details
  dentalList: DentalResponse[] = []; // Full list of dental services
  detailedServices: DetailedService[] = []; // Processed list for display
  successfulTransaction: PaymentTransaction | null = null; // Store the successful transaction

  isLoading: boolean = true;
  errorMessage: string | null = null;
  private vnPayCallbackProcessed = false; // Flag to avoid double loading

  constructor(
    private currencyPipe: CurrencyPipe,
    private datePipe: DatePipe,
    private decimalPipe: DecimalPipe,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private dentalService: DentalService,
    private patientService: PatientService, // Inject PatientService
    private prescriptionService: PrescriptionService, // Inject PrescriptionService
    private snackBar: SnackBarService, // Inject SnackBarService
    private spinner: NgxSpinnerService, // Inject NgxSpinnerService
    private cdr: ChangeDetectorRef, // Inject ChangeDetectorRef
    private router: Router // Inject Router for navigation
  ) {}

  ngOnInit(): void {
    this.isLoading = true; // Start loading state
    this.errorMessage = null;
    this.spinner.show(); // Show spinner immediately

    const idParam = this.route.snapshot.paramMap.get('id');
    this.billId = idParam !== null && idParam !== undefined ? Number(idParam) : -1;

    if (this.billId === -1) {
      this.handleLoadingError("ID hóa đơn không hợp lệ.");
      return;
    }

    // Subscribe to queryParams to handle potential VNPay callback FIRST
    this.route.queryParams.pipe(take(1)).subscribe(params => { // Use take(1) if you only need the initial params
      const hasVnPayParams = params['vnp_OrderInfo'] && params['vnp_PayDate'] && params['vnp_TransactionNo'] &&
                             params['vnp_Amount'] && params['vnp_TxnRef'] && params['vnp_ResponseCode'];

      if (hasVnPayParams) {
        this.vnPayCallbackProcessed = true; // Mark as processed
        const paymentDetails = {
          vnp_OrderInfo: params['vnp_OrderInfo'],
          vnp_PayDate: params['vnp_PayDate'],
          vnp_TransactionNo: params['vnp_TransactionNo'],
          vnp_Amount: params['vnp_Amount'],
          vnp_TxnRef: params['vnp_TxnRef'],
          vnp_ResponseCode: params['vnp_ResponseCode'],
          vnp_BankCode: params["vnp_BankCode"],
          vnp_BankTranNo: params["vnp_BankTranNo"],
          vnp_CardType: params["vnp_CardType"]
        };

        // Send payment result to backend
        this.paymentService.sendPaymentResult(paymentDetails).subscribe({
          next: (response: any) => {
            this.snackBar.notifySuccess(response.message || 'Xử lý kết quả thanh toán thành công.');
            // --- Load bill details AFTER successful callback processing ---
            this.loadBillDetails();
            // --- Remove query params after processing ---
            this.clearQueryParams();
          },
          error: (response: any) => {
            console.error("Error in sendPaymentResult:", response);
            this.snackBar.notifyError(response?.error?.message || 'Lỗi xử lý kết quả thanh toán.');
            // --- Still load bill details even if callback processing fails ---
            // --- to show the current state of the bill ---
            this.loadBillDetails();
            // --- Optionally remove query params even on error ---
            this.clearQueryParams();
          }
        });
      } else {
        // --- No VNPay params, load bill details directly ---
        this.loadBillDetails();
      }
    });
  }

  // --- Extracted method to load bill details ---
  private async loadBillDetails(): Promise<void> {
     // Ensure spinner is shown if not already (might be hidden by error in callback)
     if (!this.isLoading) {
        this.isLoading = true;
        this.spinner.show();
     }

    try {
      // Fetch bill details and dental list in parallel
      const [fetchedBill, getDentalList] = await Promise.all([
        firstValueFrom(this.paymentService.getBillById(this.billId)),
        firstValueFrom(this.dentalService.getAllDental())
      ]);

      if (!fetchedBill?.result) {
        throw new Error("Không tìm thấy thông tin hóa đơn.");
      }
      this.bill = fetchedBill.result;
      console.log('Fetched Bill:', this.bill); // Log the fetched bill
      this.dentalList = getDentalList.result || [];

      // --- Find the successful transaction ---
      if (this.bill && Array.isArray(this.bill.paymentTransactions)) {
        // Find the latest successful transaction if multiple exist (optional)
        this.successfulTransaction = this.bill.paymentTransactions
          .filter((tx: PaymentTransaction) => tx.status?.toLowerCase() === 'success')
          .sort((a: PaymentTransaction, b: PaymentTransaction) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null; // Get the latest one
        console.log('Successful Transaction:', this.successfulTransaction); // Log the found transaction
      } else {
        this.successfulTransaction = null;
      }

      // Fetch patient details
      if (this.bill.patientId) {
        const fetchedPatient = await firstValueFrom(
          this.patientService.getPatientById(this.bill.patientId)
        );
        this.patient = fetchedPatient?.result || null;
      }

      // Fetch prescription details if prescriptionId exists
      if (this.bill.prescriptionId) {
        const fetchedPrescription = await firstValueFrom(
          this.prescriptionService.getPrescriptionById(this.bill.prescriptionId)
        );
        this.prescription = fetchedPrescription?.result || null;
      }

      // Process services for detailed display
      this.processBillServices();


    } catch (error: any) {
      this.handleLoadingError(error?.error?.message || error?.message || 'Lỗi tải chi tiết hóa đơn.');
    } finally {
      this.isLoading = false;
      this.spinner.hide();
      this.cdr.markForCheck(); // Trigger change detection
    }
  }

  // --- Helper to handle loading errors ---
  private handleLoadingError(message: string): void {
      console.error("Loading Error:", message);
      this.errorMessage = message;
      this.isLoading = false;
      this.spinner.hide();
      this.cdr.markForCheck();
  }

  // --- Helper to remove query parameters ---
  private clearQueryParams(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      // queryParamsHandling: 'merge', // or 'preserve' if you have others you want to keep
      replaceUrl: true // Prevent back button from going to the URL with params
    });
  }


  // Helper to process services and add details from dentalList
  private processBillServices(): void {
    // ... (processBillServices logic remains the same) ...
    if (!this.bill || !Array.isArray(this.bill.billServiceEntities)) {
      this.detailedServices = [];
      return;
    }

    this.detailedServices = this.bill.billServiceEntities.map((serviceEntity:any) => {
      const dentalDetail = this.dentalList.find(d => d.id === serviceEntity.serviceId);
      return {
        serviceId: serviceEntity.serviceId,
        name: dentalDetail?.name || 'Không tìm thấy tên dịch vụ',
        quantity: serviceEntity.quantityService,
        unitPrice: dentalDetail?.price || 0, // Lấy đơn giá từ dentalList
        totalPrice: serviceEntity.servicePrice // Lấy thành tiền từ billServiceEntities
      };
    });
  }

  // Placeholder for payment handling logic
  handlePayment(): void {
    // ... (handlePayment logic remains the same) ...
    if (!this.bill) return;

    const billInfo = `Thanh toán tiền hóa đơn ${this.billId}`
    // --- Đảm bảo URL trả về không chứa query params cũ ---
    const returnUrl = ROUTES.ADMIN.children.PAYMENT.children.DETAIL.fullPath(this.billId.toString())


    this.spinner.show();
    this.paymentService.payByVnPay(this.bill.totalPrice, billInfo, this.billId, returnUrl)
      .subscribe({
        next: (response: any) => {
          this.spinner.hide();
          this.cdr.markForCheck();
          if (response.redirectUrl) {
            window.location.href = response.redirectUrl; // Redirect to VNPay
          } else {
             this.snackBar.notifyError('Không nhận được URL chuyển hướng từ VNPay.');
          }
        },
        error: (response: any) => {
          this.spinner.hide();
          this.snackBar.notifyError(response?.error?.message || 'Lỗi khi tạo yêu cầu thanh toán VNPay.');
          console.error("VNPay initiation error:", response);
        }
      });
  }

  // Helper to get status text and class for BILL status
  getStatusInfo(status: string | undefined): { text: string; class: string } {
    // ... (existing getStatusInfo logic) ...
    switch (status?.toLowerCase()) {
      case 'paid':
        return { text: 'Đã thanh toán', class: 'text-success' };
      case 'confirmed': // Assuming 'confirmed' means unpaid
        return { text: 'Chưa thanh toán', class: 'text-danger' };
      case 'pending':
        return { text: 'Đang chờ', class: 'text-warning' };
      default:
        return { text: status || 'Không xác định', class: 'text-muted' };
    }
  }

  // Helper to get status text and class for TRANSACTION status
  getTransactionStatusInfo(status: string | undefined): { text: string; class: string } {
    switch (status?.toLowerCase()) {
      case 'success':
        return { text: 'Thành công', class: 'text-success' };
      case 'pending':
        return { text: 'Đang chờ', class: 'text-warning' };
      case 'failed':
        return { text: 'Thất bại', class: 'text-danger' };
      default:
        return { text: status || 'Không xác định', class: 'text-muted' };
    }
  }

  // --- Updated printPDF using jsPDF and html2canvas ---
  printPDF(): void {
    if (!this.bill) {
       this.snackBar.notifyError('Chưa tải đủ thông tin hóa đơn để in.');
       return;
    }

    this.spinner.show(); // Show spinner

    // Use the correct ID from your HTML structure
    const data = document.getElementById('billDetailsContainer');

    if (!data) {
      console.error("Element with ID 'billDetailsContainer' not found!");
      this.snackBar.notifyError('Không tìm thấy nội dung để in.');
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

      pdf.save(`hoa_don_${this.bill.id}.pdf`); // Use bill ID in filename
      this.spinner.hide(); // Hide spinner after saving
      this.snackBar.notifySuccess('Đã tạo file PDF thành công.');

    }).catch(error => {
        console.error("Error generating PDF: ", error);
        this.spinner.hide(); // Hide spinner on error
        this.snackBar.notifyError('Lỗi khi tạo file PDF.');
    });
  }
}

