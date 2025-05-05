import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective, CardModule, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTES } from '../../../../../core/constants/routes.constant';
import { FacultyService } from '../../../../../core/services/faculty.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { FacultyRequest } from '../../../../../share/dto/request/faculty-create-req';
import { FacultyResponse } from '../../../../../share/dto/response/faculty-response';
import { firstValueFrom } from 'rxjs';
import { FacultyUpdateRequest } from '../../../../../share/dto/request/faculty-update-req';

@Component({
  selector: 'app-edit-faculty',
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
  templateUrl: './edit-faculty.component.html',
  styleUrl: './edit-faculty.component.scss'
})
export class EditFacultyComponent implements OnInit {
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên người dùng
  phone: string = ''; // Biến để lưu số điện thoại người dùng
  email: string = ''; // Biến để lưu địa chỉ email người dùng
  description: string = '';
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  facultyId: number = -1;
  faculty: FacultyResponse = {} as FacultyResponse;

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private facultyService: FacultyService,
    private router: Router,
    private url: ActivatedRoute
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.facultyId = Number.parseInt(this.url.snapshot.paramMap.get('id')!) || -1;

    try {
      this.spinner.show();
      const fetchedFaculty = await firstValueFrom(this.facultyService.getFacultyById(this.facultyId));
      this.faculty = { ...fetchedFaculty.result };

      this.name = this.faculty.name;
      this.phone = this.faculty.phoneNumber;
      this.email = this.faculty.email;
      this.description = this.faculty.description;

    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  onSubmit(form: NgForm) {
    this.validated = true;

    if (form.valid) {
      const facultyUpdateReq: FacultyUpdateRequest = {
        facultyId: this.facultyId,
        email: this.email,
        phoneNumber: this.phone,
        name: this.name,
        description: this.description,
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.facultyService.updateFaculty(facultyUpdateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
            this.snackbar.notifySuccess(res.message); // Hiển thị thông báo thành công

          },
          error: (err: any) => {
            this.spinner.hide(); // Ẩn spinner khi có lỗi xảy ra
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
            this.snackbar.notifyError(err.error.message); // Hiển thị thông báo lỗi
          }
        }
      )
    }
  }
}
