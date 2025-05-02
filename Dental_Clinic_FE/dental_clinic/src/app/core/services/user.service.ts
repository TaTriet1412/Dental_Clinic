import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { NameIdUserResponse } from "../../share/dto/response/name-id-user-response";

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private apiUrl = 'http://localhost:8060/user';

    constructor(
        private http: HttpClient
    ) {
    }

    getNameIdUserListByRoleId(role_id: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/role/${role_id}`);
    }

    getNameIdUserById(userId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${userId}/name-id`);
    }

    getListUserByRoleId(roleId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/list/role/${roleId}`);
    }


    getUserDetailById(userId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${userId}`);
    }
}