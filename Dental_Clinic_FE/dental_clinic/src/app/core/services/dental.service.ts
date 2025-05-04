import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { DentalCreateReq } from "../../share/dto/request/dental-create-req";
import { DentalUpdateReq } from "../../share/dto/request/dental-update-req";
import { DentalCategoryCreateReq } from "../../share/dto/request/dental-category-create-req";
import { DentalCategoryUpdateReq } from "../../share/dto/request/dental-category-update-req";
@Injectable({
    providedIn: 'root',
})
export class DentalService {
    private apiUrl = 'http://localhost:8060/dental';
    private dentalUrl = 'http://localhost:8060/dental/service';
    private categoryUrl = 'http://localhost:8060/dental/category';

    constructor(
        private http: HttpClient
    ) {
    }

    getDentalById(id: string): Observable<any> {
        return this.http.get<any>(`${this.dentalUrl}/${id}`);
    }

    getAllDental(): Observable<any> {
        return this.http.get<any>(`${this.dentalUrl}`);
    }

    createDental(dental: DentalCreateReq): Observable<any> {
        return this.http.post<any>(`${this.dentalUrl}`, dental);
    }

    updateDental(id: string, dental: DentalUpdateReq): Observable<any> {
        return this.http.put<any>(`${this.dentalUrl}/${id}`, dental);
    }

    toggleAble(id: string): Observable<any> {
        return this.http.patch<any>(`${this.dentalUrl}/${id}/able`, {});
    }

    toggleAbleCategory(id: string): Observable<any> {
        return this.http.patch<any>(`${this.categoryUrl}/${id}/able`, {});
    }

    getAllCategory(): Observable<any> {
        return this.http.get<any>(`${this.categoryUrl}`);
    }

    createCategory(categoryCreateReq: DentalCategoryCreateReq): Observable<any> {
        return this.http.post<any>(`${this.categoryUrl}`, categoryCreateReq);
    }

    updateCategory(id: string, categoryUpdateReq: DentalCategoryUpdateReq): Observable<any> {
        return this.http.put<any>(`${this.categoryUrl}/${id}`, categoryUpdateReq);
    }

    deleteCategory(id: string): Observable<any> {
        return this.http.delete<any>(`${this.categoryUrl}/${id}`);
    }

    getCategoryById(id: string): Observable<any> {
        return this.http.get<any>(`${this.categoryUrl}/${id}`);
    }

    uploadImg(dentalServiceId: string, img: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('dentalServiceId', dentalServiceId.toString());
        formData.append('image', img, img.name);

        return this.http.put<any>(`${this.dentalUrl}/change-img`,
            formData);
    }
}