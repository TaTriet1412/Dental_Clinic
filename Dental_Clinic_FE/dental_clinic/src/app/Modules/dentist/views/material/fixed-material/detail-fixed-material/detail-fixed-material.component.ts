import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule, ColComponent, RowComponent, TableModule } from '@coreui/angular';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ImgDirective } from '@coreui/angular-pro';
import { MaterialService } from '../../../../../../core/services/material.service';
import { FixedMaterialRes } from '../../../../../../share/dto/response/fixed-material-response';

@Component({
  selector: 'app-detail-fixed-material',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    ImgDirective
  ],
  standalone: true,
  templateUrl: './detail-fixed-material.component.html',
  styleUrl: './detail-fixed-material.component.scss'
})
export class DetailFixedMaterialComponent implements OnInit {
  fixedMaterialId: number = -1;
  fixedMaterial: FixedMaterialRes = {} as FixedMaterialRes;
  categoryId: string = '';
  categoryName: string = '';
  imgUrl: string = 'template/blank_service.png';

  constructor(
    private materialService: MaterialService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.fixedMaterialId = Number(this.url.snapshot.paramMap.get('id')!) || -1;

    try {
      this.spinner.show();
      const fetchedDental = await firstValueFrom(this.materialService.getFixedMaterialById(this.fixedMaterialId));
      this.fixedMaterial = { ...fetchedDental.result };
      this.imgUrl = this.fixedMaterial.img;

      const fetchedCategory = await firstValueFrom(this.materialService.getCategoryById(this.fixedMaterial.categoryId));
      this.categoryId = fetchedCategory.result.id;
      this.categoryName = fetchedCategory.result.name;

    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }

  changeImageServer(url: string): string {
    return `http://localhost:8060/material/images?path=${url}`;
  }
}
