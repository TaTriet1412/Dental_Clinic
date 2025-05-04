import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { firstValueFrom } from 'rxjs';
import { MaterialService } from '../../../../../../core/services/material.service';

@Component({
  selector: 'app-edit-category',
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
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.scss'
})
export class EditCategoryComponent implements OnInit {
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên
  note: string = ''; // Biến để lưu ghi chú
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  categoryId: number = -1; // Biến để lưu ID
  description: string = '';

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private materialService: MaterialService,
    private url: ActivatedRoute
  ) {
  }

  async ngOnInit(): Promise<void> {
      try {
        this.categoryId = Number(this.url.snapshot.params['id']); // Lấy ID từ URL
        const category = await firstValueFrom(this.materialService.getCategoryById(this.categoryId)); // Lấy danh mục theo ID
        this.name = category.result.name; // Gán tên từ danh mục
        this.note = category.result.note; // Gán ghi chú từ danh mục
        this.description = category.result.description
      }
      catch (error:any) {
        this.snackbar.notifyError(error.error.message); // Hiển thị thông báo lỗi nếu có lỗi xảy ra
      }
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      const categoryUpdateReq: any = {
        name: this.name,
        note: this.note,
        description: this.description
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.materialService.updateCategory(this.categoryId,categoryUpdateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.snackbar.notifySuccess(res.message); // Hiển thị thông báo thành công
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
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
}
