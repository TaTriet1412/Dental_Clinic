import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root',
})
export class FacultyService {
    private apiUrl = 'http://localhost:8060/dentist/faculty';

    constructor(
        private http: HttpClient
    ) {
    }

    getAllFaculty(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}`);
    }

    getFacultyById(id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${id}`);
    }

    toggleAbleFaculty(id: number) {
        return this.http.patch<any>(`${this.apiUrl}/${id}/toggle-able`, {});
    }

    createFaculty(facultyCreateReq: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/create-faculty`, facultyCreateReq);
    }

    updateFaculty(facultyUpdateReq: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/update-faculty`, facultyUpdateReq);
    }


}