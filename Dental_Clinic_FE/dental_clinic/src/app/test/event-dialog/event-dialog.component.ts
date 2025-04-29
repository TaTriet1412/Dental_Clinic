import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';
import { registerLocaleData } from '@angular/common';
import localeVi from '@angular/common/locales/vi';
// Kiểu dữ liệu truyền vào dialog
interface DialogData {
  mode: 'add' | 'edit'; // Mode of the dialog (add or edit)
  eventData: {
    id?: string;          // Event ID (optional for new events)
    title?: string;       // Event title
    start?: string;       // Start date/time in ISO format
    end?: string;         // End date/time in ISO format
    resourceId?: string;  // Associated resource (e.g., employee ID)
    extendedProps?: any;  // Additional custom properties
  };
  resources: { id: string; title: string }[]; // List of resources (e.g., employees)
}
// Kiểu dữ liệu kết quả trả về từ dialog
export interface EventDialogResult {
  action: 'save' | 'delete'; // Action type: save or delete
  event?: {
    id?: string;          // Event ID (optional for new events)
    title: string;        // Event title
    start: string;        // Start date/time in ISO format
    end: string;          // End date/time in ISO format
    resourceId?: string;  // Associated resource (e.g., employee ID)
    extendedProps?: any;  // Additional custom properties
  };
  eventId?: string;        // Event ID for deletion
}

@Component({
  selector: 'app-event-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
  ],
  standalone: true,
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'vi-VN' },
  ],
})
export class EventDialogComponent implements OnInit {
  eventForm: FormGroup;
  mode: 'add' | 'edit';
  resources: { id: string, title: string }[];
  originalEventData: any;
  dialogTitle: string;
  minStartDate: string;
  minEndDate: string;

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent, EventDialogResult>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    const today = new Date();
    this.minStartDate = this.formatDateTimeForInput(today); // Ngày bắt đầu phải là ngày hiện tại
    this.minEndDate = this.formatDateTimeForInput(today); // Ngày kết thúc ít nhất là ngày hiện tại
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    this.mode = data.mode;
    this.resources = data.resources || [];
    this.originalEventData = data.eventData;
    this.dialogTitle = this.mode === 'add' ? 'Thêm Lịch Làm Việc Mới' : 'Chi Tiết/Sửa Lịch Làm Việc';

    const initialValues = this.extractInitialValues(this.originalEventData, this.mode);

    this.eventForm = this.fb.group({
      id: [initialValues.id],
      title: [initialValues.title, Validators.required],
      resourceId: [initialValues.resourceId, Validators.required],
      startDate: [initialValues.startDate, Validators.required],
      startTime: [initialValues.startTime, Validators.required],
      endDate: [initialValues.endDate, Validators.required],
      endTime: [initialValues.endTime, Validators.required]
    });
  }

  ngOnInit(): void { }

  // --- Helper: Trích xuất giá trị ban đầu cho form ---
  private extractInitialValues(data: any, mode: 'add' | 'edit'): any {
    if (mode === 'add') {
      return {
        id: null,
        title: '',
        resourceId: data?.resourceId || null,
        startDate: this.formatDateForInput(data?.startStr),
        startTime: this.formatTimeForInput(data?.startStr),
        endDate: this.formatDateForInput(data?.endStr || this.calculateDefaultEndTime(data?.startStr)),
        endTime: this.formatTimeForInput(data?.endStr || this.calculateDefaultEndTime(data?.startStr)),
      };
    } else {
      return {
        id: data?.id || null,
        title: data?.title || '',
        resourceId: data?.resourceId || null, // Lấy resourceId đã chuẩn bị trước
        startDate: this.formatDateForInput(data?.start), // Tách ngày từ start
        startTime: this.formatTimeForInput(data?.start), // Tách thời gian từ start
        endDate: this.formatDateForInput(data?.end),     // Tách ngày từ end
        endTime: this.formatTimeForInput(data?.end),     // Tách thời gian từ end
      };
    }
  }

  // --- Helper: Tính toán EndTime mặc định khi Add ---
  private calculateDefaultEndTime(startStr: string | undefined): string | null {
    if (!startStr) return null;

    try {
      const startDate = new Date(startStr);
      if (isNaN(startDate.getTime())) return null;
      startDate.setHours(startDate.getHours() + 1);
      return startDate.toISOString();
    } catch {
      return null;
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

  formatDateForInput(dateInput: string | Date | undefined): string {
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
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date for input:", dateInput, error);
      return '';
    }
  }

  // --- Helper: Format Time thành chuỗi 'HH:mm' cho input ---
  private formatTimeForInput(dateInput: string | Date | undefined): string {
    if (!dateInput) return '';
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        console.error("Invalid date input for formatting time:", dateInput);
        return '';
      }
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting time for input:", dateInput, error);
      return '';
    }
  }

  // --- Custom Validator cho End Date ---
  private endDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.eventForm) {
      return null;
    }
    const startControl = this.eventForm.get('start');
    const endControl = control;

    if (!startControl || !endControl || !startControl.value || !endControl.value) {
      return null;
    }

    try {
      const startDate = new Date(startControl.value);
      const endDate = new Date(endControl.value);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return { 'invalidDate': true };
      }

      if (endDate <= startDate) {
        return { 'endDateMustBeAfterStart': true };
      }
    } catch (e) {
      return { 'invalidDate': true };
    }

    return null;
  }

  // --- Actions ---
  onSave(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;

      // Chuyển đổi startTime và endTime từ định dạng 12 giờ sang 24 giờ
      const startTime24 = this.convertTo24HourFormat(formValue.startTime);
      const endTime24 = this.convertTo24HourFormat(formValue.endTime);

      // Chuyển đổi startDate và endDate từ chuỗi sang đối tượng Date
      const startDate = new Date(formValue.startDate);
      const endDate = new Date(formValue.endDate);

      // Kiểm tra tính hợp lệ của startDate và endDate
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        alert('Ngày bắt đầu hoặc ngày kết thúc không hợp lệ. Vui lòng kiểm tra lại.');
        return;
      }

      // Tạo chuỗi ngày giờ ISO
      const startDateTime = `${this.toVietnamISOString(startDate).split('T')[0]}T${startTime24}:00`; // Thêm múi giờ GMT+7
      const endDateTime = `${this.toVietnamISOString(endDate).split('T')[0]}T${endTime24}:00`;     // Thêm múi giờ GMT+7

      // Kiểm tra nếu ngày kết thúc trước ngày bắt đầu
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      if (end <= start) {
        alert(
          `Thời gian kết thúc (${end.toLocaleString()}) phải sau thời gian bắt đầu (${start.toLocaleString()}).`
        );
        return;
      }

      // Chuẩn bị dữ liệu để trả về
      const eventDataToReturn = {
        id: formValue.id,
        title: formValue.title,
        resourceId: formValue.resourceId,
        start: startDateTime, // Định dạng ISO với múi giờ
        end: endDateTime,     // Định dạng ISO với múi giờ
      };

      // Đóng dialog và trả về dữ liệu
      this.dialogRef.close({ action: 'save', event: eventDataToReturn });
    } else {
      this.showFormErrors(); // Hiển thị lỗi nếu form không hợp lệ
    }
  }

  private toVietnamISOString(date: Date): string {
    const timeZoneOffset = 7 * 60 * 60 * 1000; // GMT+7
    const vietnamDate = new Date(date.getTime() + timeZoneOffset);
    return vietnamDate.toISOString().replace('Z', '+07:00'); // Thay Z bằng +07:00
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.dialogRef.close({ action: 'delete' });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  // --- Hiển thị lỗi form ---
  private showFormErrors(): void {
    let errorMessage = 'Vui lòng kiểm tra lại các lỗi sau:\n';
    Object.keys(this.eventForm.controls).forEach(key => {
      const controlErrors = this.eventForm.get(key)?.errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          errorMessage += `- Lỗi trường "${this.getControlLabel(key)}": ${this.getErrorMessage(key, keyError)}\n`;
        });
      }
    });
    alert(errorMessage);
    this.eventForm.markAllAsTouched();
  }

  private getControlLabel(key: string): string {
    switch (key) {
      case 'title': return 'Tiêu đề';
      case 'resourceId': return 'Nhân viên';
      case 'start': return 'Thời gian bắt đầu';
      case 'end': return 'Thời gian kết thúc';
      default: return key;
    }
  }

  private getErrorMessage(key: string, errorKey: string): string {
    switch (errorKey) {
      case 'required': return 'Không được để trống.';
      case 'endDateMustBeAfterStart': return 'Thời gian kết thúc phải sau thời gian bắt đầu.';
      case 'invalidDate': return 'Ngày giờ không hợp lệ.';
      default: return `Lỗi không xác định (${errorKey})`;
    }
  }

  // Hàm chuyển đổi thời gian từ định dạng 12 giờ sang 24 giờ
  private convertTo24HourFormat(time: string): string {
    const [timePart, modifier] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (modifier === 'PM' && hours !== 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
}