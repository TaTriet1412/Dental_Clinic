import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CreatePrescriptionReq } from "../../share/dto/request/prescription-create-req";
import { UpdatePrescriptionReq } from "../../share/dto/request/prescriptioin-update-req";
import { DeletePrescriptionReq } from "../../share/dto/request/prescription-delete-req";

@Injectable({
    providedIn: 'root',
})
export class PrescriptionService {
    private apiUrl = 'http://localhost:8060/prescription';

    constructor(
        private http: HttpClient
    ) {
    }

    getAllPrescription(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    getPrescriptionById(prescriptionId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${prescriptionId}`);
    }

    getPrescriptionByPatientId(patientId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/patient/${patientId}`);
    }

    getPrescriptionByDentistId(dentistId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/dentist/${dentistId}`);
    }

    deletePrescription(prescriptionId: string, deletePrescriptionReq: DeletePrescriptionReq): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${prescriptionId}`, { body: deletePrescriptionReq });
    }

    createPrescription(prescription: CreatePrescriptionReq): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create-prescription`, prescription);
    }

    updatePrescription(prescription: UpdatePrescriptionReq): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update-prescription`, prescription);
    }

}