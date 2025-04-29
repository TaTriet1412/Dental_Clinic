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

    getNameIdUserListByRoleId(role_id: number): Observable<NameIdUserResponse[]> {
        return this.http.get<NameIdUserResponse[]>(`${this.apiUrl}/role/${role_id}`);
    }
}