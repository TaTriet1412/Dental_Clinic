import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule, ColComponent, ImgDirective, RowComponent, TableModule } from '@coreui/angular';
import { UserDetailResponse } from '../../../../../../share/dto/response/user-detail-response';
import { UserService } from '../../../../../../core/services/user.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-detail-assistant',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    ImgDirective
  ],
  standalone: true,
  templateUrl: './detail-assistant.component.html',
  styleUrl: './detail-assistant.component.scss'
})
export class DetailAssistantComponent implements OnInit {
  assistantId: number = -1;
  assistant: UserDetailResponse = {} as UserDetailResponse;
  imgUrl: string = 'template/blank_user.png';

  constructor(
    private userService: UserService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.assistantId = Number.parseInt(this.url.snapshot.paramMap.get('id')!) || -1;

    try {
      this.spinner.show();
      const fetchedAppointment = await firstValueFrom(this.userService.getUserDetailById(this.assistantId));
      this.assistant = { ...fetchedAppointment.result };
      this.imgUrl = this.assistant.img;

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
