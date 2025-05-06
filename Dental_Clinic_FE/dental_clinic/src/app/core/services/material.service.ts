import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { FixedMaterialCreateReq } from "../../share/dto/request/fixed-material-create-req";
import { FixedMaterialUpdateReq } from "../../share/dto/request/fixed-material-update.req";
import { MedicineCreateReq } from "../../share/dto/request/medicine-create-req";
import { MedicineUpdateReq } from "../../share/dto/request/medicine-update-req";
import { ConsumableMaterialCreateReq } from "../../share/dto/request/consumable-material-create-req";
import { ConsumableMaterialUpdateReq } from "../../share/dto/request/consumable-material-update-req";
@Injectable({
    providedIn: 'root',
})
export class MaterialService {
    private apiUrl = 'http://localhost:8060/material/';
    private apiConsumableUrl = `${this.apiUrl}consumable-material`;
    private apiFixedUrl = `${this.apiUrl}fixed-material`;
    private apiMedicine = `${this.apiConsumableUrl}/medicine`;
    private categoryUrl = `${this.apiUrl}category`;

    constructor(
        private http: HttpClient
    ) {
    }

    getAllFixedMaterial(): Observable<any> {
        return this.http.get<any>(`${this.apiFixedUrl}`);
    }

    getFixedMaterialById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiFixedUrl}/${id}`);
    }

    getAllLogsByMaterialId(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}${id}/logs`);
    }

    createFixedMaterial(fixedMaterialCreateReq: FixedMaterialCreateReq): Observable<any> {
        return this.http.post<any>(`${this.apiFixedUrl}`, fixedMaterialCreateReq);
    }

    updateFixedMaterial(fixedMaterialCreateReq: FixedMaterialUpdateReq): Observable<any> {
        return this.http.put<any>(`${this.apiFixedUrl}`, fixedMaterialCreateReq);
    }

    getAllConsumableMaterial(): Observable<any> {
        return this.http.get<any>(`${this.apiConsumableUrl}`);
    }

    getConsumableMaterialById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiConsumableUrl}/${id}`);
    }

    createConsumableMaterial(consumableMaterialCreateReq: ConsumableMaterialCreateReq): Observable<any> {
        return this.http.post<any>(`${this.apiConsumableUrl}`, consumableMaterialCreateReq);
    }

    updateConsumableMaterial(consumableMaterialCreateReq: ConsumableMaterialUpdateReq): Observable<any> {
        return this.http.put<any>(`${this.apiConsumableUrl}`, consumableMaterialCreateReq);
    }

    createMedicine(medicineCreateReq: MedicineCreateReq): Observable<any> {
        return this.http.post<any>(`${this.apiMedicine}`, medicineCreateReq);
    }

    updateMedicine(medicineUpdateReq: MedicineUpdateReq): Observable<any> {
        return this.http.put<any>(`${this.apiMedicine}`, medicineUpdateReq);
    }


    getAllMedicine(): Observable<any> {
        return this.http.get<any>(`${this.apiMedicine}`);
    }

    getMedicineById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiMedicine}/${id}`);
    }

    getAllIngredientAbleTrue(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/able-true`);
    }

    toggleAbleMaterial(id: number) {
        return this.http.patch<any>(`${this.apiUrl}/${id}/able`, {});
    }

    getAllCategory(): Observable<any> {
        return this.http.get<any>(`${this.categoryUrl}`);
    }

    getCategoryById(id: number): Observable<any> {
        return this.http.get<any>(`${this.categoryUrl}/${id}`);
    }

    toggleAbleCategory(id: number) {
        return this.http.patch<any>(`${this.categoryUrl}/${id}/able`, {});
    }

    createCategory(categoryCreateReq: any): Observable<any> {
        return this.http.post<any>(`${this.categoryUrl}`, categoryCreateReq);
    }

    updateCategory(id: number, categoryUpdateReq: any): Observable<any> {
        return this.http.put<any>(`${this.categoryUrl}/${id}`, categoryUpdateReq);
    }

    deleteCategory(id: number) {
        return this.http.delete<any>(`${this.categoryUrl}/${id}`);
    }


    uploadImg(materialId: string, img: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('materialId', materialId.toString());
        formData.append('image', img, img.name);

        return this.http.put<any>(`${this.apiUrl}/change-img`,
            formData);
    }
}