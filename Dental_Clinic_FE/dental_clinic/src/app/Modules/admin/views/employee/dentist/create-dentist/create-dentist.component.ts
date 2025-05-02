import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, FormSelectDirective, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { ROUTES } from '../../../../../../core/constants/routes.constant';
import { AuthService } from '../../../../../../core/services/auth.service';
import { DentistServce } from '../../../../../../core/services/dentist.service';
import { FacultyService } from '../../../../../../core/services/faculty.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { CreateAccountReq } from '../../../../../../share/dto/request/account-create-req';
import { CreateDentistReq } from '../../../../../../share/dto/request/dentist-create-req';

@Component({
  selector: 'app-create-dentist',
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
    DatePickerModule,
    FormSelectDirective,
    FormDirective
  ],
  standalone: true,
  templateUrl: './create-dentist.component.html',
  styleUrl: './create-dentist.component.scss'
})
export class CreateDentistComponent implements OnInit {
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
  facultyList: any[] = []; // Danh sách khoa
  selectedFaculty: number = -1;
  specialty: string = '';
  expYear: number = 1; // Số năm kinh nghiệm
  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private dentistService: DentistServce,
    private facultyService: FacultyService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    const fetchedFacultyList = await firstValueFrom(this.facultyService.getAllFaculty());
    this.facultyList = fetchedFacultyList.result;
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
    console.log(this.selectedFaculty)

    if (form.valid) {
      const dentistCreateReq: CreateDentistReq = {
        facId: this.selectedFaculty,
        specialty: this.specialty,
        expYear: this.expYear,
        account: {
          roleId: 3,
          email: this.email,
          phone: this.phone,
          name: this.name,
          address: this.address,
          birthday: new Date(this.formatDateForInput(this.birthday)),
          gender: this.gender,
          salary: this.salary
        }
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.dentistService.createDentist(dentistCreateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.userId = res.result.id; // Lưu ID người dùng từ phản hồi
            // Upload ảnh nếu có
            if (this.selectedFileImage) {
              await this.uploadImage(this.userId, this.selectedFileImage);
            }
            this.snackbar.notifySuccess('Tạo tài khoản thành công! - Đang chuyển hướng đến danh sách nhân viên');
            setTimeout(() => {
              this.goToDentistList(); // Chuyển hướng đến danh sách nhân viên
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

  goToDentistList() {
    this.router.navigate([ROUTES.ADMIN.children.EMPLOYEE.children.DENTIST.children.LIST.fullPath]);
  }

  onFacultyChange(event: any) {
    this.selectedFaculty = Number.parseInt((event.target as HTMLInputElement).value); // Lưu giá trị khoa đã chọn
    const matchedFaculty = this.facultyList.find((faculty) => faculty.id === this.selectedFaculty);

    if (matchedFaculty) {
      this.selectedFaculty = matchedFaculty.id;
    } else {
      this.selectedFaculty = -1;
    }
    console.log(this.selectedFaculty);
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
