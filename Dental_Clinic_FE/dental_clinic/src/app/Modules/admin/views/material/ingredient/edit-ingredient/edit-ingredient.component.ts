
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTES } from '../../../../../../core/constants/routes.constant';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { IngredientService } from '../../../../../../core/services/ingredient.service';

@Component({
  selector: 'app-edit-ingredient',
  imports: [
    CommonModule,
    FormsModule,
    RowComponent,
    ColComponent,
    CardModule,
    FormDirective,
    ButtonDirective,
    FormFeedbackComponent,
    DatePickerModule,
    FormControlDirective
  ],
  standalone: true,
  templateUrl: './edit-ingredient.component.html',
  styleUrl: './edit-ingredient.component.scss'
})
export class EditIngredientComponent implements OnInit {
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  ingredientId: number = -1;

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private ingredientService: IngredientService,
    private router: Router,
    private url: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.ingredientId = Number(this.url.snapshot.paramMap.get('id'))

    this.ingredientService.getIngredientById(this.ingredientId)
      .subscribe({
        next: (res) => {
          this.name = res.result.name
        },
        error: (err) => {
          this.snackbar.notifyError(err.error.message)
        },
      })
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      const ingredientCreateReq: any = {
        name: this.name,
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.ingredientService.createIngredient(ingredientCreateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.snackbar.notifySuccess(`${res.message}- Đang chuyển hướng đến danh sách nguyên liệu`);
            setTimeout(() => {
              this.goToIngredientList(); // Chuyển hướng đến danh sách khoa
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

  goToIngredientList() {
    this.router.navigate([ROUTES.ADMIN.children.MATERIAL.children.INGREDIENT.children.LIST.fullPath]);
  }
}
