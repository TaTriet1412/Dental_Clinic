import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTES } from '../../../../../../core/constants/routes.constant';
import { DentalService } from '../../../../../../core/services/dental.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { DentalCreateReq } from '../../../../../../share/dto/request/dental-create-req';

@Component({
  selector: 'app-create-dental',
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
  templateUrl: './create-dental.component.html',
  styleUrl: './create-dental.component.scss'
})
export class CreateDentalComponent implements OnInit {
  selectedImage: string = '/assets/images/dental/blank_service.png'; // Đường dẫn mặc định cho ảnh
  selectedFileImage!: File;
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên người dùng
  cost: number = 100000; // Biến để lưu chi phí
  price: number = 100000;
  cared_actor: string = ''; // Biến để lưu tên người dùng đã tạo
  unit: string = ''; // Biến để lưu đơn vị
  description: string = ''; // Địa chỉ
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  categoryList: any[] = [];
  selectedCategory: string = '';
  dentalId: string = '';

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private dentalService: DentalService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.dentalService.getAllCategory().subscribe(
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
      const dentalCreateReq: DentalCreateReq = {
        name: this.name,
        cost: this.cost,
        price: this.price,
        cared_actor: this.cared_actor,
        unit: this.unit,
        description: this.description,
        categoryId: this.selectedCategory,
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.dentalService.createDental(dentalCreateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.dentalId = res.result.id; // Lưu ID người dùng từ phản hồi
            // Upload ảnh nếu có
            if (this.selectedFileImage) {
              await this.uploadImage(this.dentalId, this.selectedFileImage);
            }
            this.snackbar.notifySuccess('Tạo dịch vụ thành công! - Đang chuyển hướng đến danh sách dịch vụ...');
            setTimeout(() => {
              this.goToDentalList(); // Chuyển hướng đến danh sách nhân viên
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

  async uploadImage(dentalId: string, file: File): Promise<void> {
    this.dentalService.uploadImg(dentalId, file).subscribe({
      next: (res: any) => {
        this.snackbar.notifySuccess('Tải ảnh lên thành công!');
      },
      error: (err) => {
        this.snackbar.notifyError(err.error.message);
      }
    });
  }

  goToDentalList() {
    this.router.navigate([ROUTES.ADMIN.children.SERVICE.children.DENTAL.children.LIST.fullPath]);
  }
}
