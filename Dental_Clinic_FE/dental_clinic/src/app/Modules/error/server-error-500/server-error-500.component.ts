// filepath: d:\College\Year3\SOA\CK\Application\Dental_Clinic\Dental_Clinic_FE\dental_clinic\src\app\Modules\error\server-error-500\server-error-500.component.ts
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule for directives like [class]
import { SnackBarService } from '../../../core/services/snack-bar.service';

@Component({
  selector: 'app-server-error-500',
  standalone: true, // Add standalone: true
  imports: [CommonModule], // Import CommonModule
  templateUrl: './server-error-500.component.html',
  styleUrl: './server-error-500.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush // Optional: Add OnPush
})
export class ServerError500Component implements OnInit {
  isLoading = false; // Property to control the loading class

  constructor(
    private snackbar: SnackBarService, // Inject SnackBarService
  ) {}

  ngOnInit(): void {
    this.snackbar.notifyError('Server Error 500 - An error occurred while processing your request. Please try again later.');
  }
}