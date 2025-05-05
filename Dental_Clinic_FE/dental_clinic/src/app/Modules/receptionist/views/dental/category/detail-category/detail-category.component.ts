import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule, ColComponent, RowComponent, TableModule } from '@coreui/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { DentalService } from '../../../../../../core/services/dental.service';

@Component({
  selector: 'app-detail-category',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
  ],
  standalone: true,
  templateUrl: './detail-category.component.html',
  styleUrl: './detail-category.component.scss'
})
export class DetailCategoryComponent implements OnInit {
  categoryId: string = '';
  category: any;

  constructor(
    private dentalService: DentalService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.categoryId = (this.url.snapshot.paramMap.get('id')!) || '';

    try {
      this.spinner.show();
      const fetchedCategory = await firstValueFrom(this.dentalService.getCategoryById(this.categoryId));
      this.category = { ...fetchedCategory.result };

    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }
}
