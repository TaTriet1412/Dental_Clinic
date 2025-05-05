import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardModule, ColComponent, RowComponent, TableModule } from '@coreui/angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { IngredientService } from '../../../../../../core/services/ingredient.service';

@Component({
  selector: 'app-detail-ingredient',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
  ],
  standalone: true,
  templateUrl: './detail-ingredient.component.html',
  styleUrl: './detail-ingredient.component.scss'
})
export class DetailIngredientComponent implements OnInit {
  ingredientId: number = -1;
  ingredient: any;

  constructor(
    private ingredientService: IngredientService,
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.ingredientId = Number(this.url.snapshot.paramMap.get('id')!) ;

    try {
      this.spinner.show();
      const fetchedCategory = await firstValueFrom(this.ingredientService.getIngredientById(this.ingredientId));
      this.ingredient = { ...fetchedCategory.result };

    } catch (error: any) {
      this.snackbar.notifyError(error.error.message);
    } finally {
      this.spinner.hide();
    }
  }
}
