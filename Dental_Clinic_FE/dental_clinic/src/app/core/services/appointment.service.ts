import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppointmentCreateReq } from "../../share/dto/request/appointment-create-req";
import { UpdateStatusRequest } from "../../share/dto/request/update-status-request";
import { AppointmentUpdateReq } from "../../share/dto/request/appointment-update-request";
import { AuthService } from "./auth.service";
@Injectable({
    providedIn: 'root',
})
export class AppointmentService {
    private apiUrl = 'http://localhost:8060/schedule/appointment';

    constructor(
        private http: HttpClient,
        private authService: AuthService, // Inject AuthService to get JWT token
    ) {
    }

    getAllAppointments(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    getPaginationAppointments(filters: Record<string, any>, page: any, size: any, sortFields: string): Observable<any> {
        let params = new HttpParams();

        // Chỉ append filters nếu object có key thực sự
        if (filters && Object.keys(filters).length > 0) {
            params = params.append('filters', JSON.stringify(filters));
        }
        if (page !== undefined && page !== null) {
            params = params.append('page', page);
        }
        if (size !== undefined && size !== null) {
            params = params.append('size', size);
        }
        if (sortFields && sortFields.length > 0) {
            params = params.append('sortFields', encodeURIComponent(sortFields));
        }
        const token = this.authService.getToken();  // Lấy JWT từ AuthService
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const url = `${this.apiUrl}/pagination`;
        console.log('GET', url, params.toString());
        return this.http.get<any>(`${this.apiUrl}/pagination`, { params, headers });
    }

    createAppointment(appointment: AppointmentCreateReq): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create`, appointment);
    }

    getAppointmentById(appointmentId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${appointmentId}`);
    }

    getAppointmentsByDentistId(dentistId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/dentist/${dentistId}`);
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