import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common'; // Import pipes
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectionStrategy, ChangeDetectorRef
import { ActivatedRoute } from '@angular/router';
import { CardModule, ColComponent, RowComponent, TableModule } from '@coreui/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { PrescriptionService } from '../../../../../core/services/prescription.service';
import { UserService } from '../../../../../core/services/user.service';
import { PatientService } from '../../../../../core/services/patient.service';
import { MaterialService } from '../../../../../core/services/material.service';
import { PatientResponse } from '../../../../../share/dto/response/patient-response';
import { UserResponse } from '../../../../../share/dto/response/user-response';
import { jsPDF } from 'jspdf'; // Correct import for jsPDF class
import html2canvas from 'html2canvas';
import { ButtonDirective } from '@coreui/angular-pro';

interface PrescriptionMedicineDetail {
  med_id: number;
  quantity_medicine: number;
  name?: string;
  price?: number;
  total_price?: number;
}

@Component({
  selector: 'app-detail-prescription',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    DecimalPipe, // Add DecimalPipe
    CurrencyPipe, // Add CurrencyPipe
    ButtonDirective
  ],
  standalone: true,
  templateUrl: './detail-prescription.component.html',
  styleUrl: './detail-prescription.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush // Add ChangeDetectionStrategy
})
export class DetailPrescriptionComponent implements OnInit {
  prescriptionId: string = '';
  // --- Use specific types if available ---
  prescription: any | null = null;
  patient: PatientResponse | null = null;
  dentist: UserResponse | null = null;
  medicineList: any[] = []; // Full list of medicines from service
  detailedMedicines: PrescriptionMedicineDetail[] = []; // Processed list for display

  constructor(
    private materialService: MaterialService,
    private prescriptionService: PrescriptionService,
    private userService: UserService,
    private patientService: PatientService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    this.prescriptionId = this.url.snapshot.paramMap.get('id') || '';
    if (!this.prescriptionId) {
        this.snackbar.notifyError("Không tìm thấy ID toa thuốc.");
        return;
    }

    try {
      this.spinner.show();

      // Fetch all necessary data in parallel for better performance
      const [fetchedPrescription, fetchedMedicines] = await Promise.all([
        firstValueFrom(this.prescriptionService.getPrescriptionById(this.prescriptionId)),
        firstValueFrom(this.materialService.getAllMedicine()) // Fetch all medicines once
      ]);

      if (!fetchedPrescription?.result) {
        throw new Error("Không tìm thấy thông tin toa thuốc.");
      }
      this.prescription = fetchedPrescription.result;

      // --- Assign medicineList correctly ---
      this.medicineList = Array.isArray(fetchedMedicines?.result) ? fetchedMedicines.result : [];

      // Fetch patient and dentist based on IDs from prescription
      const [fetchedPatient, fetchedDentist] = await Promise.all([
        firstValueFrom(this.patientService.getPatientById(this.prescription.pat_id)),
        firstValueFrom(this.userService.getNameIdUserById(this.prescription.den_id))
      ]);

      this.patient = fetchedPatient?.result || null;
      this.dentist = fetchedDentist?.result || null;

      // --- Process medicines for display ---
      this.processPrescriptionMedicines();

    } catch (error: any) {
      console.error("Error loading prescription details:", error);
      this.snackbar.notifyError(error?.error?.message || error?.message || 'Lỗi tải chi tiết toa thuốc.');
    } finally {
      this.spinner.hide();
      this.cdr.markForCheck(); // Trigger change detection after async operations
    }
  }

  // --- Helper to process and enrich prescription medicines ---
  private processPrescriptionMedicines(): void {
    if (!this.prescription?.medicines || !this.medicineList) {
      this.detailedMedicines = [];
      return;
    }

    this.detailedMedicines = this.prescription.medicines.map((prescribedMed: { med_id: any; quantity_medicine: number; }) => {
      const medicineDetails = this.medicineList.find(m => m.id === prescribedMed.med_id);
      const price = medicineDetails?.price || 0;
      const quantity = prescribedMed.quantity_medicine || 0;
      return {
        ...prescribedMed,
        name: medicineDetails?.name || 'Không tìm thấy tên',
        price: price,
        total_price: price * quantity
      };
    });
  }

  printPDF(): void {
    if (!this.prescription) {
       this.snackbar.notifyError('Chưa tải đủ thông tin toa thuốc để in.');
       return;
    }

    this.spinner.show(); // Show spinner

    // Use the correct ID from your HTML structure
    const data = document.getElementById('prescriptionDetailsContainer');

    if (!data) {
      console.error("Element with ID 'prescriptionDetailsContainer' not found!");
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

      pdf.save(`toa_thuoc_${this.prescription.id}.pdf`); // Use bill ID in filename
      this.spinner.hide(); // Hide spinner after saving
      this.snackbar.notifySuccess('Đã tạo file PDF thành công.');

    }).catch(error => {
        console.error("Error generating PDF: ", error);
        this.spinner.hide(); // Hide spinner on error
        this.snackbar.notifyError('Lỗi khi tạo file PDF.');
    });
  }
}
