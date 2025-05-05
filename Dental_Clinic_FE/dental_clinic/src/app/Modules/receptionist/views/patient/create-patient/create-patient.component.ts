import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { PatientService } from '../../../../../core/services/patient.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { CreatePatientReq } from '../../../../../share/dto/request/patient-create-req';

@Component({
  selector: 'app-create-patient',
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
  templateUrl: './create-patient.component.html',
  styleUrl: './create-patient.component.scss'
})
export class CreatePatientComponent {
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

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private patientService: PatientService,
    private router: Router
  ) {
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
    console.log(this.selectedFileImage);

    if (form.valid) {
      const patientCreateReq: CreatePatientReq = {
        email: this.email,
        phone: this.phone,
        name: this.name,
        address: this.address,
        birthday: this.birthday,
        gender: this.gender,
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.patientService.createPatient(patientCreateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.userId = res.result.id; // Lưu ID người dùng từ phản hồi
            // Upload ảnh nếu có
            if (this.selectedFileImage) {
              await this.uploadImage(this.userId, this.selectedFileImage);
            }
            this.snackbar.notifySuccess('Tạo tài khoản thành công! - Đang chuyển hướng đến danh sách bệnh nhân');
            setTimeout(() => {
              this.goTopatientList(); // Chuyển hướng đến danh sách bệnh nhân
            }, 3000); // Thời gian chờ 3 giây trước khi chuyển hướng
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

  goTopatientList() {
    this.router.navigate([ROUTES.RECEPTIONIST.children.PATIENT.children.LIST.fullPath]);
  }
}
