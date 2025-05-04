import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTES } from '../../../../../../core/constants/routes.constant';
import { MaterialService } from '../../../../../../core/services/material.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { FixedMaterialCreateReq } from '../../../../../../share/dto/request/fixed-material-create-req';

@Component({
  selector: 'app-create-fixed-material',
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
  templateUrl: './create-fixed-material.component.html',
  styleUrl: './create-fixed-material.component.scss'
})
export class CreateFixedMaterialComponent implements OnInit {
  selectedImage: string = '/assets/images/material/blank_material.png'; // Đường dẫn mặc định cho ảnh
  selectedFileImage!: File;
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên người dùng
  unit: string = ''; // Biến để lưu đơn vị
  func: string = ''; // Địa chỉ
  mfg_date: Date = new Date();
  maxMfgDay: Date = new Date();
  quantity: number = 1; // Biến để lưu số lượng
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  categoryList: any[] = [];
  selectedCategory: string = '';
  fixedMaterialId: number = -1;

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private materialService: MaterialService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.materialService.getAllCategory().subscribe(
      {
        next: (response) => {
          this.categoryList = (response.result || []).filter((cat: any) => cat.able === true);
          this.cdr.markForCheck();
        },
        error: (error) => {
          this.snackbar.notifyError(error.error.message);
        }
      }
    );
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
      const fixedMaterialCreateReq: FixedMaterialCreateReq = {
        name: this.name,
        quantity: this.quantity,
        unit: this.unit,
        func: this.func,
        mfg_date: new Date(this.formatDateForInput(this.mfg_date)),
        categoryId: Number.parseInt(this.selectedCategory),
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.materialService.createFixedMaterial(fixedMaterialCreateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.fixedMaterialId = res.result.id; // Lưu ID người dùng từ phản hồi
            // Upload ảnh nếu có
            if (this.selectedFileImage) {
              await this.uploadImage(this.fixedMaterialId.toString(), this.selectedFileImage);
            }
            this.snackbar.notifySuccess(`${res.message} - Đang chuyển hướng đến danh sách vật liệu cố định`);
            setTimeout(() => {
              this.goToFixedMaterialList(); // Chuyển hướng đến danh sách nhân viên
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

  async uploadImage(fixedMaterialId: string, file: File): Promise<void> {
    this.materialService.uploadImg(fixedMaterialId, file).subscribe({
      next: (res: any) => {
        this.snackbar.notifySuccess('Tải ảnh lên thành công!');
      },
      error: (err) => {
        this.snackbar.notifyError(err.error.message);
      }
    });
  }

  goToFixedMaterialList() {
    this.router.navigate([ROUTES.ADMIN.children.MATERIAL.children.FIXED.children.LIST.fullPath]);
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

}
