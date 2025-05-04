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
    CurrencyPipe // Add CurrencyPipe
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

  // --- Optional: Helper to get details directly in template (less preferred now) ---
  // getMedicineDetails(med_id: number): MedicineResponse | undefined {
  //   return this.medicineList.find(m => m.id === med_id);
  // }
}
