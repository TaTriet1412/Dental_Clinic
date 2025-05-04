import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTES } from '../../../../../../core/constants/routes.constant';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { DentalService } from '../../../../../../core/services/dental.service';
import { DentalCategoryCreateReq } from '../../../../../../share/dto/request/dental-category-create-req';

@Component({
  selector: 'app-create-category',
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
  templateUrl: './create-category.component.html',
  styleUrl: './create-category.component.scss'
})
export class CreateCategoryComponent {
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên
  note: string = ''; // Biến để lưu ghi chú
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  categoryId: string = ''; // Biến để lưu ID

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private dentalService: DentalService,
    private router: Router
  ) {
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      const categoryCreateReq: DentalCategoryCreateReq = {
        name: this.name,
        note: this.note,
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.dentalService.createCategory(categoryCreateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.snackbar.notifySuccess('Tạo danh mục thành công! - Đang chuyển hướng đến danh sách danh mục dịch vụ');
            setTimeout(() => {
              this.goToCategoryList(); // Chuyển hướng đến danh sách khoa
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

  goToCategoryList() {
    this.router.navigate([ROUTES.ADMIN.children.SERVICE.children.CATEGORY.children.LIST.fullPath]);
  }
}
