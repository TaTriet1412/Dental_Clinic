import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule, ColComponent, RowComponent, TableModule } from '@coreui/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { FacultyService } from '../../../../../core/services/faculty.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service';
import { FacultyResponse } from '../../../../../share/dto/response/faculty-response';

@Component({
  selector: 'app-detail-faculty',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
  ],
  standalone: true,
  templateUrl: './detail-faculty.component.html',
  styleUrl: './detail-faculty.component.scss'
})
export class DetailFacultyComponent implements OnInit {
  facultyId: number = -1;
  faculty: FacultyResponse = {} as FacultyResponse;

  constructor(
    private facultyService: FacultyService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.facultyId = Number.parseInt(this.url.snapshot.paramMap.get('id')!) || -1;

    try {
      this.spinner.show();
      const fetchedFaculty = await firstValueFrom(this.facultyService.getFacultyById(this.facultyId));
      this.faculty = { ...fetchedFaculty.result };

    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }
}
