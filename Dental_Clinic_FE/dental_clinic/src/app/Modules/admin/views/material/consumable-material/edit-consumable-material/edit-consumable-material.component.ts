import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonDirective, CardModule, FormCheckComponent, FormCheckInputDirective, FormControlDirective, FormDirective, FormFeedbackComponent, ImgDirective, InputGroupComponent, InputGroupTextDirective, RowComponent } from '@coreui/angular';
import { ColComponent, DatePickerModule, FormSelectDirective, MultiSelectModule, MultiSelectOptgroupComponent } from '@coreui/angular-pro';
import { NgxSpinnerService } from 'ngx-spinner';
import { ROUTES } from '../../../../../../core/constants/routes.constant';
import { MaterialService } from '../../../../../../core/services/material.service';
import { SnackBarService } from '../../../../../../core/services/snack-bar.service';
import { IngredientService } from '../../../../../../core/services/ingredient.service';
import { ConsumableMaterialUpdateReq } from '../../../../../../share/dto/request/consumable-material-update-req';
import { MedicineUpdateReq } from '../../../../../../share/dto/request/medicine-update-req';

@Component({
  selector: 'app-edit-consumable-material',
  imports: [
    CommonModule,
    FormsModule,
    RowComponent,
    ColComponent,
    CardModule,
    FormDirective,
    ImgDirective,
    InputGroupComponent,
    FormControlDirective,
    ButtonDirective,
    FormFeedbackComponent,
    DatePickerModule,
    MultiSelectModule,
    FormCheckComponent,
    FormCheckInputDirective,
    InputGroupTextDirective,
  ],
  standalone: true,
  templateUrl: './edit-consumable-material.component.html',
  styleUrl: './edit-consumable-material.component.scss'
})
export class EditConsumableMaterialComponent implements OnInit {
  selectedImage: string = 'template/blank_material.png'; // Đường dẫn mặc định cho ảnh
  selectedFileImage!: File;
  validated = false; // Biến để theo dõi trạng thái xác thực của form
  name: string = ''; // Biến để lưu tên người dùng
  unit: string = ''; // Biến để lưu đơn vị
  func: string = ''; // Địa chỉ
  mfg_date: Date = new Date();
  maxMfgDay: Date = new Date();
  quantity: number = 1; // Biến để lưu số lượng
  disabledBtnSubmit = false; // Biến để theo dõi trạng thái nút gửi
  categoryList: any[] = [];
  ingredientList: any[] = [];
  selectedCategory: string = '';
  consumableMaterialId: number = -1;
  selectedIngredients: number[] = []; // Biến để lưu danh sách các ID nguyên liệu đã chọn
  is_medicine: boolean = false; // Biến để theo dõi xem có phải là thuốc hay không
  cost: number = 0; // Biến để lưu chi phí
  price: number = 0; // Biến để lưu giá
  cared_actor: string = ''; // Biến để lưu người chăm sóc
  instruction: string = ''; // Biến để lưu hướng dẫn sử dụng

  constructor(
    private snackbar: SnackBarService,
    private spinner: NgxSpinnerService,
    private materialService: MaterialService,
    private ingredientService: IngredientService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private url: ActivatedRoute,
  ) {
  }

  async ngOnInit(): Promise<void> {
    this.consumableMaterialId = Number(this.url.snapshot.paramMap.get('id'));
    this.spinner.show(); // Hiện spinner khi bắt đầu xử lý

    try {
      const medicineRes: any = await this.materialService.getMedicineById(this.consumableMaterialId).toPromise();
      this.is_medicine = true;
      this.name = medicineRes.result.name;
      this.unit = medicineRes.result.unit;
      this.func = medicineRes.result.func;
      this.mfg_date = new Date(medicineRes.result.mfg_date);
      this.quantity = medicineRes.result.quantity;
      this.selectedCategory = medicineRes.result.categoryId.toString();
      this.selectedIngredients = medicineRes.result.ingreIdList;
      this.cost = medicineRes.result.cost;
      this.price = medicineRes.result.price;
      this.cared_actor = medicineRes.result.cared_actor;
      this.instruction = medicineRes.result.instruction;
      this.selectedImage = this.changeImgToServerImg(medicineRes.result.img) || this.changeImgToServerImg(this.selectedImage); // Đường dẫn ảnh từ server
      console.log(medicineRes.result.ingreIdList);
    } catch (medicineErr: any) {
      this.is_medicine = false;
      try {
        const consumableRes: any = await this.materialService.getConsumableMaterialById(this.consumableMaterialId).toPromise();
        this.name = consumableRes.result.name;
        this.unit = consumableRes.result.unit;
        this.func = consumableRes.result.func;
        this.mfg_date = new Date(consumableRes.result.mfg_date);
        this.quantity = consumableRes.result.quantity;
        this.selectedCategory = consumableRes.result.categoryId.toString();
        this.selectedIngredients = consumableRes.result.ingreIdList;
        this.selectedImage = this.changeImgToServerImg(consumableRes.result.img) || this.changeImgToServerImg(this.selectedImage);
      } catch (consumableErr: any) {
        this.snackbar.notifyError(consumableErr.error?.message || 'Lỗi khi lấy thông tin vật tư tiêu hao'); // Hiển thị thông báo lỗi
      }
    }

    try {
      const [categoryResponse, ingredientResponse] = await Promise.all([
        this.materialService.getAllCategory().toPromise(),
        this.ingredientService.getAllIngredient().toPromise()
      ]);

      this.categoryList = (categoryResponse.result || []).filter((cat: any) => cat.able === true || cat.id == this.selectedCategory);
      this.ingredientList = (ingredientResponse.result || []).filter((ingre: any) => ingre.able === true || this.selectedIngredients.includes(ingre.id));
      this.cdr.markForCheck();

    } catch (error: any) {
      this.snackbar.notifyError(error.error?.message || 'Lỗi khi tải danh mục hoặc thành phần');
    } finally {
      this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý hoặc có lỗi
    }
  }

  onFileSelected(event: any): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Kiểm tra xem tệp có phải là ảnh không
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();

        // Đọc tệp và cập nhật hình ảnh
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result; // Cập nhật đường dẫn ảnh
        };

        reader.readAsDataURL(file); // Đọc tệp dưới dạng Data URL
        this.selectedFileImage = event.target!.files[0]; // Lưu tệp vào biến selectedFileImage
      } else {
        this.snackbar.notifyError('Vui lòng chọn một tệp ảnh hợp lệ!');
      }
    }
  }

  maxDateForDatePicker(minDate: Date): Date {
    const yesterday = minDate;
    yesterday.setDate(yesterday.getDate());
    return yesterday;
  }


  onSubmit(form: NgForm) {
    this.validated = true;

    console.log(new Date(this.formatDateForInput(this.mfg_date)))

    if (form.valid) {
      if (this.is_medicine) {
        const medicineUpdateReq: MedicineUpdateReq = {
          id: this.consumableMaterialId,
          name: this.name,
          quantity: this.quantity,
          unit: this.unit,
          func: this.func,
          mfg_date: new Date(this.formatDateForInput(this.mfg_date)),
          categoryId: Number.parseInt(this.selectedCategory),
          ingreIdList: this.selectedIngredients,
          cared_actor: this.cared_actor,
          price: this.price,
          cost: this.cost,
          instruction: this.instruction,
        }

        this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
        this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
        this.materialService.updateMedicine(medicineUpdateReq).subscribe(
          {
            next: async (res: any) => {
              this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
              this.consumableMaterialId = res.result.id; // Lưu ID người dùng từ phản hồi
              // Upload ảnh nếu có
              if (this.selectedFileImage) {
                await this.uploadImage(this.consumableMaterialId.toString(), this.selectedFileImage);
              }
              this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
              this.snackbar.notifySuccess(`${res.message}`);

            },
            error: (err) => {
              this.spinner.hide(); // Ẩn spinner khi có lỗi xảy ra
              this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
              this.snackbar.notifyError(err.error.message); // Hiển thị thông báo lỗi
            }
          }
        )
        return;
      }
      const consumableMaterialUpdateReq: ConsumableMaterialUpdateReq = {
        id: this.consumableMaterialId,
        name: this.name,
        quantity: this.quantity,
        unit: this.unit,
        func: this.func,
        mfg_date: new Date(this.formatDateForInput(this.mfg_date)),
        categoryId: Number.parseInt(this.selectedCategory),
        ingreIdList: this.selectedIngredients,
      }

      this.spinner.show(); // Hiện spinner khi bắt đầu xử lý
      this.disabledBtnSubmit = true; // Vô hiệu hóa nút gửi để tránh gửi nhiều lần
      this.materialService.updateConsumableMaterial(consumableMaterialUpdateReq).subscribe(
        {
          next: async (res: any) => {
            this.spinner.hide(); // Ẩn spinner khi hoàn thành xử lý
            this.consumableMaterialId = res.result.id; // Lưu ID người dùng từ phản hồi
            // Upload ảnh nếu có
            if (this.selectedFileImage) {
              await this.uploadImage(this.consumableMaterialId.toString(), this.selectedFileImage);
            }
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
            this.snackbar.notifySuccess(`${res.message}`);
          },
          error: (err) => {
            this.spinner.hide(); // Ẩn spinner khi có lỗi xảy ra
            this.disabledBtnSubmit = false; // Kích hoạt lại nút gửi
            this.snackbar.notifyError(err.error.message); // Hiển thị thông báo lỗi
          }
        }
      )
    }
  }

  changeImgToServerImg(img: string): string {
    return "http://localhost:8060/material/images?path=" + img;
  }

  async uploadImage(consumableMaterialId: string, file: File): Promise<void> {
    this.materialService.uploadImg(consumableMaterialId, file).subscribe({
      next: (res: any) => {
      },
      error: (err) => {
        this.snackbar.notifyError(err.error.message);
      }
    });
  }

  private formatDateForInput(dateInput: string | Date | undefined): string {
    if (!dateInput) return '';
    try {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) {
        console.error("Invalid date input for formatting:", dateInput);
        return '';
      }
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date for input:", dateInput, error);
      return '';
    }
  }
}
