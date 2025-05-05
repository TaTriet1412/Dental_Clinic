import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ButtonDirective, CardImgDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, FormSelectDirective, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent, TemplateIdDirective } from '@coreui/angular';
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
import { DentistServce } from '../../../../../../core/services/dentist.service';
import { FacultyService } from '../../../../../../core/services/faculty.service';
import { DetailDentistResponse } from '../../../../../../share/dto/response/dentist-detail-response';
import { UpdateDentistReq } from '../../../../../../share/dto/request/dentist-update-req';

@Component({
  selector: 'app-edit-dentist',
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
    FormDirective,
    FormControlDirective,
    FormSelectDirective
  ],
  standalone: true,
  templateUrl: './edit-dentist.component.html',
  styleUrl: './edit-dentist.component.scss'
})
export class EditDentistComponent implements OnInit {
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
  dentistId: number = -1; // Biến để lưu ID người dùng
  dentist: UserDetailResponse = {} as UserDetailResponse;
  validatedSpec = false; // Biến để theo dõi trạng thái xác thực của form
  facultyList: any[] = []; // Danh sách chuyên khoa
  selectedFaculty: number = -1; // Chuyên khoa đã chọn
  specialty: string = ''; // Chuyên khoa
  expYear: number = 1; // Số năm kinh nghiệm
  disabledBtnSubmitSpec = false; // Biến để theo dõi trạng thái nút gửi cho form chuyên khoa
  detailDentist: DetailDentistResponse = {} as DetailDentistResponse; // Biến để lưu thông tin chi tiết của bác sĩ

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private router: Router,
    private url: ActivatedRoute,
    private userService: UserService,
    private dentistService: DentistServce,
    private facultyService: FacultyService
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.dentistId = Number.parseInt(this.url.snapshot.paramMap.get('id')!) || -1;


    try {
      this.spinner.show();
      const fetchedAppointment = await firstValueFrom(this.userService.getUserDetailById(this.dentistId));
      this.dentist = { ...fetchedAppointment.result };
      const fetchedInfoDentist = await firstValueFrom(this.dentistService.getDentistById(this.dentistId));
      this.detailDentist = { ...fetchedInfoDentist.result };
      const fetchedFacultyList = await firstValueFrom(this.facultyService.getAllFaculty());
      this.facultyList = fetchedFacultyList.result.filter((faculty: any) =>
        faculty.able || faculty.id === this.detailDentist.facID
      ); // Lọc danh sách khoa để giữ lại khoa khả dụng hoặc khoa hiện tại của bác sĩ

      this.name = this.dentist.name;
      this.phone = this.dentist.phone;
      this.email = this.dentist.email;
      this.salary = this.dentist.salary;
      this.address = this.dentist.address;
      this.gender = this.dentist.gender;
      this.birthday = this.dentist.birthday ? new Date(this.dentist.birthday) : new Date(); // Chuyển đổi chuỗi thành đối tượng Date
      this.selectedImage = this.changeImageServer(this.dentist.img) || '/assets/images/auth/blank_user.png'; // Đường dẫn ảnh mặc định nếu không có ảnh từ API

      this.specialty = this.detailDentist.specialty || ''; // Lấy chuyên khoa từ thông tin chi tiết bác sĩ
      this.expYear = this.detailDentist.experienceYear || 1; // Lấy số năm kinh nghiệm từ thông tin chi tiết bác sĩ
      this.selectedFaculty = this.detailDentist.facID || -1; // Lấy ID khoa từ thông tin chi tiết bác sĩ
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
        userId: this.dentistId,
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
        this.uploadImage(this.dentistId, this.selectedFileImage);
      }
    }
  }

  onSpecSubmit(form: NgForm) {
    this.validatedSpec = true; // Đánh dấu form đã được xác thực
    console.log(this.selectedFaculty);

    if (form.valid) {
      const updateDentistReq: UpdateDentistReq = {
        facId: this.selectedFaculty,
        specialty: this.specialty,
        expYear: this.expYear,
        dentistId: this.dentistId
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmitSpec = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.dentistService.updateDentist(updateDentistReq).subscribe({
        next: async (res: any) => {
          this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
          this.disabledBtnSubmitSpec = false; // Kích hoạt lại nút gửi
          this.snackbar.notifySuccess(res.message);
        },
        error: (err) => {
          this.spinner.hide(); // Ẩn spinner khi có lỗi xảy ra
          this.disabledBtnSubmitSpec = false; // Kích hoạt lại nút gửi
          this.snackbar.notifyError(err.error.message); // Hiển thị thông báo lỗi
        }
      })

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


  async uploadImage(dentistId: number, file: File): Promise<void> {
    this.authService.uploadImg(dentistId, file).subscribe({
      next: (res: any) => {
      },
      error: (err) => {
        this.snackbar.notifyError(err.error.message);
      }
    });
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
}
