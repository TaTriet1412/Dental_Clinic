import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { FacultyService } from '../../../../../core/services/faculty.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { FacultyRequest } from '../../../../../share/dto/request/faculty-create-req';

@Component({
  selector: 'app-create-faculty',
  imports: [
    CommonModule,
    FormsModule,
    RowComponent,
    ColComponent,
    CardModule,
    FormDirective,
    FormControlDirective,
    ButtonDirective,
    FormFeedbackComponent,
    DatePickerModule
  ],
  standalone: true,
  templateUrl: './create-faculty.component.html',
  styleUrl: './create-faculty.component.scss'
})
export class CreateFacultyComponent {
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên người dùng
  phone: string = ''; // Biến để lưu số điện thoại người dùng
  email: string = ''; // Biến để lưu địa chỉ email người dùng
  description: string = '';
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  facultyId: number = -1; // Biến để lưu ID người dùng

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private facultyService: FacultyService,
    private router: Router
  ) {
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      const facultyCreateReq: FacultyRequest = {
        email: this.email,
        phoneNumber: this.phone,
        name: this.name,
        description: this.description,
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.facultyService.createFaculty(facultyCreateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.snackbar.notifySuccess('Tạo khoa thành công! - Đang chuyển hướng đến danh sách khoa');
            setTimeout(() => {
              this.goToFacultyList(); // Chuyển hướng đến danh sách khoa
            }, 3000); // Thời gian chờ 3 giây trước khi chuyển hướng
          },
          error: (err:any) => {
            this.spinner.hide(); // Ẩn spinner khi có lỗi xảy ra
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
            this.snackbar.notifyError(err.error.message); // Hiển thị thông báo lỗi
          }
        }
      )
    }
  }

  goToFacultyList() {
    this.router.navigate([ROUTES.ADMIN.children.FACULTY.children.LIST.fullPath]);
  }
}
