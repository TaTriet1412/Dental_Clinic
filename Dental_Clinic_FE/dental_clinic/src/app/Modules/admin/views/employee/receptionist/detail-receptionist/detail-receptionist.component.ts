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

@Component({
  selector: 'app-detail-receptionist',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    ImgDirective
  ],
  standalone: true,
  templateUrl: './detail-receptionist.component.html',
  styleUrl: './detail-receptionist.component.scss'
})
export class DetailReceptionistComponent implements OnInit {
  receptionistId: number = -1;
  receptionist: UserDetailResponse = {} as UserDetailResponse;
  imgUrl: string = 'template/blank_user.png';

  constructor(
    private userService: UserService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.receptionistId = Number.parseInt(this.url.snapshot.paramMap.get('id')!) || -1;

    try {
      this.spinner.show();
      const fetchedReceptionist = await firstValueFrom(this.userService.getUserDetailById(this.receptionistId));
      this.receptionist = { ...fetchedReceptionist.result };
      this.imgUrl = this.receptionist.img;

    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  changeImageServer(url: string): string {
    return `http://localhost:8060/auth/images?path=${url}`;
  }
}
