import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ButtonDirective, CardModule, ColComponent, RowComponent, TableModule } from '@coreui/angular';
import { ImgDirective } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { firstValueFrom } from 'rxjs';
import { IngredientService } from '../../../../../../core/services/ingredient.service';
import { MaterialService } from '../../../../../../core/services/material.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { MaterialLogResponse } from '../../../../../../share/dto/response/material-log-response';

@Component({
  selector: 'app-detail-consumable-material',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    ImgDirective,
    ButtonDirective
  ],
  standalone: true,
  templateUrl: './detail-consumable-material.component.html',
  styleUrl: './detail-consumable-material.component.scss'
})
export class DetailConsumableMaterialComponent implements OnInit {
  consumableMaterialId: number = -1;
  consumableMaterial: any = {} as any;
  categoryId: number = -1;
  categoryName: string = '';
  imgUrl: string = 'template/blank_service.png';
  isMedicine: boolean = false;
  ingredientIdList: number[] = [];
  ingredientList: any[] = [];
  ingredientNameList: string[] = [];
  ingredientNameJoin: string = '';
  instruction: string = '';
  cared_actor: string = '';
  cost: number = 0;
  price: number = 0;
  logs: MaterialLogResponse[] = [];
  showAllLogs: boolean = false;

  constructor(
    private materialService: MaterialService,
    private snackbar: SnackBarService,
    private ingredientService: IngredientService,
    private spinner: NgxSpinnerService,
    private url: ActivatedRoute,
  ) {

  }

  async ngOnInit(): Promise<void> {
    this.consumableMaterialId = Number(this.url.snapshot.paramMap.get('id')!) || -1;
    try {
      const logResponse = await firstValueFrom(this.materialService.getAllLogsByMaterialId(this.consumableMaterialId));
      this.logs = logResponse.result || [];
    } catch (error) {
      console.error("Error fetching logs:", error);
      this.logs = [];
    }

    this.ingredientService.getAllIngredient().subscribe({
      next: (res) => {
        this.ingredientList = res.result;
        this.processIngredientInformation();
      },
      error: (error) => {
        this.snackbar.notifyError(error.error.message);
      }
    });

    try {
      this.spinner.show();
      const fetchedMedicine = await firstValueFrom(this.materialService.getMedicineById(this.consumableMaterialId));
      this.consumableMaterial = { ...fetchedMedicine.result };
      this.imgUrl = this.consumableMaterial.img;
      this.ingredientIdList = this.consumableMaterial.ingreIdList || [];

      this.isMedicine = true;

      const fetchedCategory = await firstValueFrom(this.materialService.getCategoryById(this.consumableMaterial.categoryId));
      this.categoryId = fetchedCategory.result.id;
      this.categoryName = fetchedCategory.result.name;

      this.processIngredientInformation();

    }
    catch (error: any) {
      try {
        const fetchedConsumableMaterial = await firstValueFrom(this.materialService.getConsumableMaterialById(this.consumableMaterialId));
        this.consumableMaterial = { ...fetchedConsumableMaterial.result };
        this.imgUrl = this.consumableMaterial.img;
        this.ingredientIdList = this.consumableMaterial.ingreIdList || [];

        const fetchedCategory = await firstValueFrom(this.materialService.getCategoryById(this.consumableMaterial.categoryId));
        this.categoryId = fetchedCategory.result.id;
        this.categoryName = fetchedCategory.result.name;

        this.processIngredientInformation();

      } catch (error: any) {
        this.snackbar.notifyError(error.error.message);
      }
    } finally {
      this.spinner.hide();
    }
  }

  private processIngredientInformation(): void {
    if (this.ingredientList.length > 0 && this.ingredientIdList.length > 0) {
      this.ingredientNameList = this.ingredientList
        .filter(ingredient => this.ingredientIdList.includes(ingredient.id))
        .map(ingredient => ingredient.name);
      this.ingredientNameJoin = this.ingredientNameList.join(', ');
    } else if (this.isMedicine) {
        this.ingredientNameJoin = 'Không có thông tin thành phần.';
    }
  }

  changeImageServer(url: string): string {
    return `http://localhost:8060/material/images?path=${url}`;
  }

  toggleShowAllLogs(): void {
    this.showAllLogs = !this.showAllLogs;
  }
}
