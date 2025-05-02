import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreateDentistReq } from "../../share/dto/request/dentist-create-req";
import { UpdateDentistReq } from "../../share/dto/request/dentist-update-req";
@Injectable({
    providedIn: 'root',
})
export class DentistServce {
    private apiUrl = 'http://localhost:8060/dentist';

    constructor(
        private http: HttpClient
    ) {
    }

    getDentistById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    createDentist(dentist: CreateDentistReq): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create-dentist`, dentist);
    }

    updateDentist(dentist: UpdateDentistReq): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update-dentist`, dentist);
    }
}