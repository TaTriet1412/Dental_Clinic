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
import { DentalResponse } from '../../../../../../share/dto/response/dental-response';
import { DentalService } from '../../../../../../core/services/dental.service';

@Component({
  selector: 'app-detail-dental',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    ImgDirective
  ],
  standalone: true,
  templateUrl: './detail-dental.component.html',
  styleUrl: './detail-dental.component.scss'
})
export class DetailDentalComponent implements OnInit {
  dentalId: string = '';
  dental: DentalResponse = {} as DentalResponse;
  categoryId: string = '';
  categoryName: string = '';
  imgUrl: string = 'template/blank_service.png';

  constructor(
    private dentalService: DentalService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.dentalId = (this.url.snapshot.paramMap.get('id')!) || '';

    try {
      this.spinner.show();
      const fetchedDental = await firstValueFrom(this.dentalService.getDentalById(this.dentalId));
      this.dental = { ...fetchedDental.result };
      this.imgUrl = this.dental.img;

      const fetchedCategory = await firstValueFrom(this.dentalService.getCategoryById(this.dental.categoryId));
      this.categoryId = fetchedCategory.result.id;
      this.categoryName = fetchedCategory.result.name;

    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  changeImageServer(url: string): string {
    return `http://localhost:8060/dental/images?path=${url}`;
  }
}
