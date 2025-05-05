import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonDirective, CardImgDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TemplateIdDirective } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { CreateAccountReq } from '../../../../../../share/dto/request/account-create-req';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ROUTES } from '../../../../../../core/constants/routes.constant';

@Component({
  selector: 'app-create-assistant',
  imports: [
    CommonModule,
    FormsModule,
    RowComponent,
    ColComponent,
    CardModule,
    FormDirective,
    ImgDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    FormControlDirective,
    ButtonDirective,
    FormFeedbackComponent,
    DatePickerModule
  ],
  standalone: true,
  templateUrl: './create-assistant.component.html',
  styleUrl: './create-assistant.component.scss'
})
export class CreateAssistantComponent {
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
  userId: number = -1; // Biến để lưu ID người dùng

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
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

    if (form.valid) {
      const accountCreateReq: CreateAccountReq = {
        roleId: 4,
        email: this.email,
        phone: this.phone,
        name: this.name,
        address: this.address,
        birthday: this.birthday,
        gender: this.gender,
        salary: this.salary
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.authService.createAccount(accountCreateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
            this.userId = res.result.id; // Lưu ID người dùng từ phản hồi
            // Upload ảnh nếu có
            if (this.selectedFileImage) {
              await this.uploadImage(this.userId, this.selectedFileImage);
            }
            this.snackbar.notifySuccess('Tạo tài khoản thành công! - Đang chuyển hướng đến danh sách nhân viên');
            setTimeout(() => {
              this.goToAssistantList(); // Chuyển hướng đến danh sách nhân viên
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

  async uploadImage(userId: number, file: File): Promise<void> {
    this.authService.uploadImg(userId, file).subscribe({
      next: (res: any) => {
        this.snackbar.notifySuccess('Tải ảnh lên thành công!');
      },
      error: (err) => {
        this.snackbar.notifyError(err.error.message);
      }
    });
  }

    goToAssistantList() {
      this.router.navigate([ROUTES.RECEPTIONIST.children.EMPLOYEE.children.ASSISTANT.children.LIST.fullPath]);
    }
}
