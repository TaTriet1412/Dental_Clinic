import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule, ColComponent, RowComponent, TableModule } from '@coreui/angular';
import { UserDetailResponse } from '../../../../../../share/dto/response/user-detail-response';
import { UserService } from '../../../../../../core/services/user.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ImgDirective } from '@coreui/angular-pro';
import { DentistServce } from '../../../../../../core/services/dentist.service';
import { DetailDentistResponse } from '../../../../../../share/dto/response/dentist-detail-response';
import { FacultyService } from '../../../../../../core/services/faculty.service';

@Component({
  selector: 'app-detail-dentist',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    ImgDirective
  ],
  standalone: true,
  templateUrl: './detail-dentist.component.html',
  styleUrl: './detail-dentist.component.scss'
})
export class DetailDentistComponent implements OnInit {
  dentistId: number = -1;
  dentist: UserDetailResponse = {} as UserDetailResponse;
  imgUrl: string = 'template/blank_user.png';
  detailDentist: DetailDentistResponse = {} as DetailDentistResponse;
  faculties: any[] = [];

  constructor(
    private userService: UserService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
    private dentistService: DentistServce,
    private facultyService: FacultyService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.dentistId = Number.parseInt(this.url.snapshot.paramMap.get('id')!) || -1;

    try {
      this.spinner.show();
      const fetchedDentist = await firstValueFrom(this.userService.getUserDetailById(this.dentistId));
      this.dentist = { ...fetchedDentist.result };
      this.imgUrl = this.dentist.img;

      const fetchedDentistDetail = await firstValueFrom(this.dentistService.getDentistById(this.dentistId));
      this.detailDentist = { ...fetchedDentistDetail.result };

      const fetchedFaculty = await firstValueFrom(this.facultyService.getAllFaculty());
      this.faculties = [...fetchedFaculty.result];

      console.log(this.faculties);
      console.log(this.getFacultyName(1));
    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  changeImageServer(url: string): string {
    return `http://localhost:8060/auth/images?path=${url}`;
  }

  getFacultyName(facultyId: number): string {
    const faculty = this.faculties.find((faculty) => faculty.id === facultyId);
    return faculty ? faculty.name : 'Unknown Faculty';
  }

}
