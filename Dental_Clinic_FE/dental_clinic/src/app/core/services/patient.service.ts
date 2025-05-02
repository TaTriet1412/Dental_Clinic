import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root',
})
export class PatientService {
    private apiUrl = 'http://localhost:8060/patient';

    constructor(
        private http: HttpClient,
    ) {
    }

    getNameIdPatientList(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/all-name-id`);
    }

    getPatientById(patientId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${patientId}`);
    }

    getNameIdPatientById(patientId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${patientId}/name`);
    }

    getAllPatient(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    createPatient(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create-patient`, data);
    }

    updatePatient(data: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update-patient`, data);
    }

    uploadImg(patientId: string, img: File): Observable<any> {
        const formData: FormData = new FormData();
        formData.append('patientId', patientId);
        formData.append('image', img, img.name);
        return this.http.put<any>(`${this.apiUrl}/change-img`,
            formData);
    }
}