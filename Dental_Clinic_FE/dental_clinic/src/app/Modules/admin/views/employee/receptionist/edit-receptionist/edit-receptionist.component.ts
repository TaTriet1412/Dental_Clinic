import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonDirective, CardImgDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TemplateIdDirective } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { CreateAccountReq } from '../../../../../../share/dto/request/account-create-req';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '../../../../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '../../../../../../core/constants/routes.constant';
import { UserDetailResponse } from '../../../../../../share/dto/response/user-detail-response';
import { firstValueFrom } from 'rxjs';
import { UserService } from '../../../../../../core/services/user.service';
import { UpdateAccountReq } from '../../../../../../share/dto/request/account-update-req';

@Component({
  selector: 'app-edit-receptionist',
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
  templateUrl: './edit-receptionist.component.html',
  styleUrl: './edit-receptionist.component.scss'
})
export class EditReceptionistComponent implements OnInit {
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
  receptionistId: number = -1; // Biến để lưu ID người dùng
  receptionist: UserDetailResponse = {} as UserDetailResponse;

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private url: ActivatedRoute,
    private userService: UserService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.receptionistId = Number.parseInt(this.url.snapshot.paramMap.get('id')!) || -1;


    try {
      this.spinner.show();
      const fetchedAppointment = await firstValueFrom(this.userService.getUserDetailById(this.receptionistId));
      this.receptionist = { ...fetchedAppointment.result };
      console.log(this.receptionist);
      // this.imgUrl = this.receptionist.img || '/assets/images/auth/blank_user.png';

      this.name = this.receptionist.name;
      this.phone = this.receptionist.phone;
      this.email = this.receptionist.email;
      this.salary = this.receptionist.salary;
      this.address = this.receptionist.address;
      this.gender = this.receptionist.gender;
      this.birthday = this.receptionist.birthday ? new Date(this.receptionist.birthday) : new Date(); // Chuyển đổi chuỗi thành đối tượng Date
      this.selectedImage = this.changeImageServer(this.receptionist.img) || '/assets/images/auth/blank_user.png'; // Đường dẫn ảnh mặc định nếu không có ảnh từ API
    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  changeImageServer(url: string): string {
    return `http://localhost:8060/auth/images?path=${url}`;
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
      const accountUpdateReq: UpdateAccountReq = {
        userId: this.receptionistId,
        email: this.email,
        phone: this.phone,
        name: this.name,
        address: this.address,
        birthday: new Date(this.formatDateForInput(this.birthday)),
        gender: this.gender,
        salary: this.salary
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.authService.updateAccount(accountUpdateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
            this.snackbar.notifySuccess(res.message);
          },
          error: (err) => {
            this.spinner.hide(); // Ẩn spinner khi có lỗi xảy ra
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
            this.snackbar.notifyError(err.error.message); // Hiển thị thông báo lỗi
          }
        }
      )

      // Upload ảnh nếu có
      if (this.selectedFileImage) {
        this.uploadImage(this.receptionistId, this.selectedFileImage);
      }
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


  async uploadImage(receptionistId: number, file: File): Promise<void> {
    this.authService.uploadImg(receptionistId, file).subscribe({
      next: (res: any) => {
      },
      error: (err) => {
        this.snackbar.notifyError(err.error.message);
      }
    });
  }
}
