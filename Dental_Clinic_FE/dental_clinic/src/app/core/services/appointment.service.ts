import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppointmentCreateReq } from "../../share/dto/request/appointment-create-req";
import { UpdateStatusRequest } from "../../share/dto/request/update-status-request";
import { AppointmentUpdateReq } from "../../share/dto/request/appointment-update-request";
@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    private apiUrl = 'http://localhost:8060/schedule/appointment';

    constructor(
        private http: HttpClient
    ) {
    }

    getAllAppointments(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    createAppointment(appointment: AppointmentCreateReq): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create`, appointment);
    }

    getAppointmentById(appointmentId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${appointmentId}`);
    }

    updateStatusAppointment(appointmentId: string, status: string, note: string): Observable<any> {
        const body: UpdateStatusRequest = {
            appointment_id: appointmentId,
            status: status,
            note: note
        };

        console.log(body);

        return this.http.put<any>(`${this.apiUrl}/update-status`, body);
    }

    updateAppointment(appointment: AppointmentUpdateReq): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update`, appointment);
    }
}