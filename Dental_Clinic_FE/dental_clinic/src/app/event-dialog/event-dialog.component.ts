import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// Kiểu dữ liệu truyền vào dialog
interface DialogData {
  mode: 'add' | 'edit';
  eventData: any; // Dữ liệu sự kiện gốc hoặc thông tin select
  resources: { id: string, title: string }[]; // Danh sách nhân viên
}

// Kiểu dữ liệu kết quả trả về từ dialog
export interface EventDialogResult {
  action: 'save' | 'delete';
  event?: any;     // Dữ liệu event nếu save
  eventId?: string; // ID event nếu delete
}

@Component({
  selector: 'app-event-dialog',
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {
  eventForm: FormGroup;
  mode: 'add' | 'edit';
  resources: { id: string, title: string }[];
  originalEventData: any;
  dialogTitle: string;

  constructor(
    public dialogRef: MatDialogRef<EventDialogComponent, EventDialogResult>, // Kiểu kết quả trả về
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private fb: FormBuilder
  ) {
    this.mode = data.mode;
    this.resources = data.resources || [];
    this.originalEventData = data.eventData;
    this.dialogTitle = this.mode === 'add' ? 'Thêm Lịch Làm Việc Mới' : 'Chi Tiết/Sửa Lịch Làm Việc';

    // --- Khởi tạo Form ---
    const initialValues = this.extractInitialValues(this.originalEventData, this.mode);

    this.eventForm = this.fb.group({
      id: [initialValues.id],
      title: [initialValues.title, Validators.required],
      resourceId: [initialValues.resourceId, Validators.required],
      allDay: [initialValues.allDay],
      // Sử dụng validator tùy chỉnh cho ngày kết thúc
      start: [initialValues.start, Validators.required],
      end: [initialValues.end, [Validators.required, this.endDateValidator.bind(this)]]
    });

    // Đồng bộ hóa validator của 'end' khi 'start' hoặc 'allDay' thay đổi
    this.eventForm.get('start')?.valueChanges.subscribe(() => {
      this.eventForm.get('end')?.updateValueAndValidity();
    });
    this.eventForm.get('allDay')?.valueChanges.subscribe(() => {
      this.eventForm.get('end')?.updateValueAndValidity();
       // Có thể tự động điều chỉnh giờ/phút về 00:00 nếu chuyển sang AllDay
       // và ngược lại, nếu bỏ AllDay, có thể đặt giờ mặc định (vd: +1 tiếng từ start)
    });
  }

  ngOnInit(): void { }

  // --- Helper: Trích xuất giá trị ban đầu cho form ---
  private extractInitialValues(data: any, mode: 'add' | 'edit'): any {
    if (mode === 'add') {
      // Dữ liệu từ selectInfo
      return {
        id: null,
        title: '',
        resourceId: data?.resourceId || null, // Lấy từ data truyền vào
        allDay: data?.allDay || false,
        start: this.formatDateTimeForInput(data?.startStr),
        // Tự động đề xuất end time (ví dụ: +1 giờ hoặc +30 phút nếu không phải allDay)
        end: this.formatDateTimeForInput(data?.endStr || this.calculateDefaultEndTime(data?.startStr, data?.allDay)),
      };
    } else {
      // Dữ liệu từ event.toPlainObject()
       // Cần đảm bảo eventData có các trường cần thiết (start, end,...)
       // FullCalendar toPlainObject() có thể không trả về startStr/endStr mà chỉ có start/end (Date object)
      return {
        id: data?.id || null,
        title: data?.title || '',
        resourceId: data?.resourceId || data?.resourceIds?.[0] || null, // Lấy resourceId đã chuẩn bị trước
        allDay: data?.allDay || false,
        start: this.formatDateTimeForInput(data?.start), // Dùng data.start (Date object)
        end: this.formatDateTimeForInput(data?.end),     // Dùng data.end (Date object)
      };
    }
  }

  // --- Helper: Tính toán EndTime mặc định khi Add ---
  private calculateDefaultEndTime(startStr: string | undefined, allDay: boolean | undefined): string | null {
      if (!startStr) return null;
      if (allDay) return startStr; // Nếu allDay, end mặc định cùng ngày start

      try {
          const startDate = new Date(startStr);
          if (isNaN(startDate.getTime())) return null;
          // Thêm 1 giờ vào thời gian bắt đầu
          startDate.setHours(startDate.getHours() + 1);
          return startDate.toISOString(); // Trả về ISO string để formatDateTimeForInput xử lý
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
           // Nếu là chuỗi YYYY-MM-DD (từ allDay=true), thêm giờ mặc định
           if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
               return dateInput + 'T00:00';
           }
           console.error("Invalid date input for formatting:", dateInput);
           return '';
       }
      // Lấy local time components
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
      console.error("Error formatting date for input:", dateInput, error);
      return '';
    }
  }

  // --- Helper: Chuyển đổi giá trị input thành định dạng phù hợp cho FullCalendar/API ---
  // Trả về Date object hoặc chuỗi ISO tùy bạn muốn gửi đi đâu
  private formatDateTimeForOutput(dateTimeLocalString: string | undefined, isAllDay: boolean): Date | string | null {
      if (!dateTimeLocalString) return null;
      try {
          const date = new Date(dateTimeLocalString); // Input 'yyyy-MM-ddTHH:mm' được Date() hiểu là local time
          if (isNaN(date.getTime())) return null;

          if (isAllDay) {
              // Nếu là AllDay, chỉ cần phần ngày YYYY-MM-DD
              // Hoặc trả về Date object với giờ phút giây = 0
              date.setHours(0, 0, 0, 0);
              // Trả về Date object: return date;
              // Trả về chuỗi YYYY-MM-DD:
              const year = date.getFullYear();
              const month = (date.getMonth() + 1).toString().padStart(2, '0');
              const day = date.getDate().toString().padStart(2, '0');
              return `${year}-${month}-${day}`;
          } else {
              // Nếu có giờ cụ thể, trả về Date object hoặc chuỗi ISO
              return date; // Trả về Date object (FullCalendar xử lý tốt)
              // return date.toISOString(); // Hoặc trả về chuỗi ISO (UTC)
          }
      } catch (error) {
          console.error("Error formatting date for output:", dateTimeLocalString, error);
          return null;
      }
  }

  // --- Custom Validator cho End Date ---
  private endDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!this.eventForm) { // Form chưa khởi tạo xong
      return null;
    }
    const startControl = this.eventForm.get('start');
    const endControl = control; // control chính là endControl
    const allDayControl = this.eventForm.get('allDay');

    if (!startControl || !endControl || !allDayControl || !startControl.value || !endControl.value) {
      return null; // Chưa đủ thông tin để validate
    }

    try {
        const startDate = new Date(startControl.value);
        const endDate = new Date(endControl.value);
        const isAllDay = allDayControl.value;

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return { 'invalidDate': true }; // Ngày không hợp lệ
        }

        // Nếu là allDay, chỉ so sánh phần ngày
        if (isAllDay) {
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            if (endDate < startDate) {
                return { 'endDateBeforeStartDateAllDay': true };
            }
        } else {
            // Nếu có giờ, so sánh cả giờ phút
            if (endDate <= startDate) { // Kết thúc phải SAU bắt đầu
                return { 'endDateMustBeAfterStart': true };
            }
        }

    } catch (e) {
        return { 'invalidDate': true }; // Lỗi khi parse date
    }

    return null; // Hợp lệ
  }


  // --- Actions ---
  onSave(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      const isAllDay = formValue.allDay;

      const startDateOutput = this.formatDateTimeForOutput(formValue.start, isAllDay);
      let endDateOutput = this.formatDateTimeForOutput(formValue.end, isAllDay);

      // Xử lý đặc biệt cho End Date của All Day Event theo chuẩn FullCalendar
      // Ngày kết thúc của sự kiện all-day là *độc quyền* (exclusive).
      // Nếu sự kiện chỉ diễn ra trong 1 ngày (start và end cùng ngày),
      // thì end date gửi cho FullCalendar thường là ngày hôm sau.
      if (isAllDay && startDateOutput && endDateOutput && typeof startDateOutput === 'string' && typeof endDateOutput === 'string') {
            const startDay = startDateOutput; // YYYY-MM-DD
            const endDay = endDateOutput;   // YYYY-MM-DD
            if (endDay === startDay) {
                // Nếu kết thúc cùng ngày bắt đầu, FC cần end là ngày hôm sau để hiển thị đúng 1 ngày
                try {
                   const nextDay = new Date(endDay);
                   nextDay.setDate(nextDay.getDate() + 1);
                   const year = nextDay.getFullYear();
                   const month = (nextDay.getMonth() + 1).toString().padStart(2, '0');
                   const day = nextDay.getDate().toString().padStart(2, '0');
                   endDateOutput = `${year}-${month}-${day}`;
                } catch {}
            }
            // Nếu endDay > startDay, thì giữ nguyên endDay (vd: nghỉ từ T2 đến T3 -> end=T4)
      }


      const eventDataToReturn = {
        id: formValue.id, // Giữ nguyên ID nếu là edit
        title: formValue.title,
        resourceId: formValue.resourceId,
        allDay: isAllDay,
        start: startDateOutput,
        end: endDateOutput
        // Thêm extendedProps nếu form có các trường đó
      };

      // console.log("Closing dialog with SAVE:", eventDataToReturn);
      this.dialogRef.close({ action: 'save', event: eventDataToReturn });

    } else {
      this.showFormErrors();
    }
  }

  onDelete(): void {
    if (confirm('Bạn có chắc chắn muốn xóa lịch làm việc này không?')) {
      this.dialogRef.close({ action: 'delete', eventId: this.originalEventData?.id });
    }
  }

  onCancel(): void {
    this.dialogRef.close(); // Không trả về kết quả (hoặc trả về null/undefined)
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
      this.eventForm.markAllAsTouched(); // Đánh dấu tất cả các trường để hiển thị lỗi UI
  }

  private getControlLabel(key: string): string {
      switch(key) {
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
           case 'endDateBeforeStartDateAllDay': return 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.';
           case 'endDateMustBeAfterStart': return 'Thời gian kết thúc phải sau thời gian bắt đầu.';
           case 'invalidDate': return 'Ngày giờ không hợp lệ.';
           default: return `Lỗi không xác định (${errorKey})`;
       }
   }

    // Helper để lấy kiểu input date/datetime
    getDateInputType(): 'date' | 'datetime-local' {
        return this.eventForm.get('allDay')?.value ? 'date' : 'datetime-local';
    }
}