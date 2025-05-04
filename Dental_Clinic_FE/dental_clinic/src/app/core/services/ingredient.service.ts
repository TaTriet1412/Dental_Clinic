import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root',
})
export class IngredientService {
    private apiUrl = 'http://localhost:8060/material/ingredient';

    constructor(
        private http: HttpClient
    ) {
    }

    getAllIngredient(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    getAllIngredientAbleTrue(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/able-true`);
    }

    toggleAbleIngredient(id: number) {
        return this.http.patch<any>(`${this.apiUrl}/${id}/able`, {});
    }

    createIngredient(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}`, data);
    }

    updateIngredient(id: number, data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${id}`, data);
    }

    getIngredientById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
}