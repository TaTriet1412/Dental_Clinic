import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonDirective, CardImgDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TemplateIdDirective } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { CreateAccountReq } from '../../../../../../share/dto/request/account-create-req';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../../../core/constants/routes.constant';
import { DentalService } from '../../../../../../core/services/dental.service';
import { DentalCreateReq } from '../../../../../../share/dto/request/dental-create-req';
import { DentalResponse } from '../../../../../../share/dto/response/dental-response';
import { DentalUpdateReq } from '../../../../../../share/dto/request/dental-update-req';
import { consumerPollProducersForChange } from '@angular/core/primitives/signals';

@Component({
  selector: 'app-edit-dental',
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
  templateUrl: './edit-dental.component.html',
  styleUrl: './edit-dental.component.scss'
})
export class EditDentalComponent implements OnInit {
  selectedImage: string = 'template/blank_service.png'; // Đường dẫn mặc định cho ảnh
  selectedFileImage!: File;
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên người dùng
  cost: number = 100000; // Biến để lưu chi phí
  price: number = 100000;
  cared_actor: string = ''; // Biến để lưu tên người dùng đã tạo
  unit: string = ''; // Biến để lưu đơn vị
  description: string = ''; // Địa chỉ
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  dentalId: string = '';
  categoryName: any = null; // Biến để lưu thông tin danh mục
  categoryId: string = ''; // Biến để lưu ID danh mục
  dental: DentalResponse = {} as DentalResponse; // Biến để lưu thông tin dịch vụ nha khoa

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private dentalService: DentalService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private url: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.dentalId = this.url.snapshot.params['id'];
    this.dentalService.getDentalById(this.dentalId).subscribe({
      next: (res) => {
        this.dental = res.result;
        this.name = this.dental.name;
        this.cost = this.dental.cost;
        this.price = this.dental.price;
        this.cared_actor = this.dental.cared_actor;
        this.unit = this.dental.unit;
        this.description = this.dental.description;
        if (this.dental.img) {
          this.selectedImage = this.changeImgToServer(this.dental.img); // Cập nhật đường dẫn ảnh
          console.log(this.selectedImage);
        }
        this.categoryId = this.dental.categoryId; // Lưu ID danh mục vào biến categoryId
        this.dentalService.getCategoryById(this.categoryId).subscribe({
          next: (res) => {
            this.categoryName = res.result.name; // Lưu tên danh mục vào biến categoryName
            this.cdr.detectChanges(); // Đánh dấu để kiểm tra lại

          },
          error: (err) => {
            this.snackbar.notifyError(err.error.message);
          }
        })
      },
      error: (err) => {
        this.snackbar.notifyError(err.error.message);
      }
    });
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
      const dentalUpdateReq: DentalUpdateReq = {
        name: this.name,
        cost: this.cost,
        price: this.price,
        cared_actor: this.cared_actor,
        unit: this.unit,
        description: this.description,
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.dentalService.updateDental(this.dental.id, dentalUpdateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.dentalId = res.result.id; // Lưu ID người dùng từ phản hồi
            // Upload ảnh nếu có
            if (this.selectedFileImage) {
              await this.uploadImage(this.dentalId, this.selectedFileImage);
            }
            this.snackbar.notifySuccess(res.message); // Hiển thị thông báo thành công
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
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

  changeImgToServer(url: string): string {
    return "http://localhost:8060/dental/images?path=" + url;
  }
}
