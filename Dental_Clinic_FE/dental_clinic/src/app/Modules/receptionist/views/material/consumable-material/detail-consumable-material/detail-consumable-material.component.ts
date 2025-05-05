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
import { ConsumableMaterialRes } from '../../../../../../share/dto/response/consumable-material-response';
import { IngredientService } from '../../../../../../core/services/ingredient.service';

@Component({
  selector: 'app-detail-consumable-material',
  imports: [
    CommonModule,
    CardModule,
    RowComponent,
    ColComponent,
    TableModule,
    ImgDirective
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
    this.ingredientService.getAllIngredient().subscribe({
      next: (res) => {
        this.ingredientList = res.result;
      },
      error: (error) => {
        this.snackbar.notifyError(error.error.message);
      }
    })

    try {
      this.spinner.show();
      const fetchedMedicine = await firstValueFrom(this.materialService.getMedicineById(this.consumableMaterialId));
      this.consumableMaterial = { ...fetchedMedicine.result };
      this.imgUrl = this.consumableMaterial.img;
      this.ingredientIdList = this.consumableMaterial.ingreIdList;

      this.isMedicine = true;
      console.log(this.isMedicine)

      const fetchedCategory = await firstValueFrom(this.materialService.getCategoryById(this.consumableMaterial.categoryId));
      this.categoryId = fetchedCategory.result.id;
      this.categoryName = fetchedCategory.result.name;

      // Giả sử this.ingredientList là mảng các object {id, name}
      // this.ingredientIdList là mảng các id thành phần

      this.ingredientNameList = this.ingredientList
        .filter(ingredient => this.ingredientIdList.includes(ingredient.id))
        .map(ingredient => ingredient.name);
      this.ingredientNameJoin = this.ingredientNameList.join(', ');
    }
    catch (error: any) {
      try {
        const fetchedConsumableMaterial = await firstValueFrom(this.materialService.getConsumableMaterialById(this.consumableMaterialId));
        this.consumableMaterial = { ...fetchedConsumableMaterial.result };
        this.imgUrl = this.consumableMaterial.img;
        this.ingredientIdList = this.consumableMaterial.ingreIdList;


        const fetchedCategory = await firstValueFrom(this.materialService.getCategoryById(this.consumableMaterial.categoryId));
        this.categoryId = fetchedCategory.result.id;
        this.categoryName = fetchedCategory.result.name;

        // Giả sử this.ingredientList là mảng các object {id, name}
        // this.ingredientIdList là mảng các id thành phần

        this.ingredientNameList = this.ingredientList
          .filter(ingredient => this.ingredientIdList.includes(ingredient.id))
          .map(ingredient => ingredient.name);

        this.ingredientNameJoin = this.ingredientNameList.join(', ');

        console.log(this.ingredientNameJoin);


      } catch (error: any) {
        this.snackbar.notifyError(error.error.message);
      }
    } finally {
      this.spinner.hide();
    }
  }

  changeImageServer(url: string): string {
    return `http://localhost:8060/material/images?path=${url}`;
  }
}
