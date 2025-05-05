import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { PatientService } from '../../../../../core/services/patient.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { CreatePatientReq } from '../../../../../share/dto/request/patient-create-req';
import { firstValueFrom } from 'rxjs';
import { UpdatePatientReq } from '../../../../../share/dto/request/patient-update-req';

@Component({
  selector: 'app-edit-patient',
  imports: [
    CommonModule,
    FormsModule,
    RowComponent,
    ColComponent,
    CardModule,
    FormDirective,
    ImgDirective,
    InputGroupComponent,
    FormControlDirective,
    ButtonDirective,
    FormFeedbackComponent,
    DatePickerModule
  ],
  standalone: true,
  templateUrl: './edit-patient.component.html',
  styleUrl: './edit-patient.component.scss'
})
export class EditPatientComponent implements OnInit {
  selectedImage: string = '/assets/images/auth/blank_user.png'; // Đường dẫn mặc định cho ảnh
  selectedFileImage!: File;
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên người dùng
  phone: string = ''; // Biến để lưu số điện thoại người dùng
  email: string = ''; // Biến để lưu địa chỉ email người dùng
  salary: number = 0; // Biến để lưu lương người dùng
  address: string = ''; // Địa chỉ
  gender: boolean = true; // Giới tính: true = Nam, false = Nữ
  birthday: Date = new Date(); // Ngày sinh
  maxbirthday: Date = new Date(); // Ngày sinh tối đa (ngày hiện tại)
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  userId: string = ''; // Biến để lưu ID người dùng
  patient: any = {}; // Biến để lưu thông tin người dùng

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private patientService: PatientService,
    private router: Router,
    private url: ActivatedRoute
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.userId = (this.url.snapshot.paramMap.get('id')!) || '';

    try {
      this.spinner.show();
      const fetchedFaculty = await firstValueFrom(this.patientService.getPatientById(this.userId));
      this.patient = { ...fetchedFaculty.result };

      this.name = this.patient.name;
      this.phone = this.patient.phoneNumber;
      this.email = this.patient.email;
      this.address = this.patient.address;
      this.birthday = this.patient.birthday ? new Date(this.patient.birthday) : new Date();
      this.phone = this.patient.phone;
      this.selectedImage = this.changeImageServer(this.patient.img) || '/assets/images/auth/blank_user.png'; 

    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Kiểm tra xem tệp có phải là ảnh không
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        // Đọc tệp và cập nhật hình ảnh
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result; // Cập nhật đường dẫn ảnh
        };

        reader.readAsDataURL(file); // Đọc tệp dưới dạng Data URL
        this.selectedFileImage = event.target!.files[0]; // Lưu tệp vào biến selectedFileImage
      } else {
        this.snackbar.notifyError('Vui lòng chọn một tệp ảnh hợp lệ!');
      }
    }
  }

  maxDateForDatePicker(minDate: Date): Date {
    const yesterday = minDate;
    yesterday.setDate(yesterday.getDate());
    return yesterday;
  }


  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      const patientUpdateReq: UpdatePatientReq = {
        id: this.userId,
        email: this.email,
        phone: this.phone,
        name: this.name,
        address: this.address,
        birthday: new Date(this.formatDateForInput(this.birthday)),
        gender: this.gender,
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.patientService.updatePatient(patientUpdateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.userId = res.result.id; // Lưu ID người dùng từ phản hồi
            this.disabledBtnSubmit = false; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần

            // Upload ảnh nếu có
            if (this.selectedFileImage) {
              await this.uploadImage(this.userId, this.selectedFileImage);
            }
            this.snackbar.notifySuccess(res.message); // Hiển thị thông báo thành công
          },
          error: (err) => {
            this.spinner.hide(); // Ẩn spinner khi có lỗi xảy ra
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
            this.snackbar.notifyError(err.error.message); // Hiển thị thông báo lỗi
          }
        }
      )
    }
  }

  private formatDateForInput(dateInput: string | Date | undefined): string {
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


  async uploadImage(userId: string, file: File): Promise<void> {
    this.patientService.uploadImg(userId, file).subscribe({
      next: (res: any) => {
        this.snackbar.notifySuccess('Tải ảnh lên thành công!');
      },
      error: (err) => {
        this.snackbar.notifyError(err.error.message);
      }
    });
  }

  changeImageServer(url: string): string {
    return `http://localhost:8060/patient/images?path=${url}`;
  }

}
