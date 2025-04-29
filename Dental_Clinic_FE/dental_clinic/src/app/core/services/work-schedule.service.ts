import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { EventResponse } from "../../share/dto/response/event-response";
import { EventRequest } from "../../share/dto/request/event-request";

@Injectable({
    providedIn: 'root',
})
export class WorkSchdeduleService {
    private apiUrl = 'http://localhost:8060/schedule/work-schedule';

    constructor(
        private http: HttpClient
    ) {
    }

    getEventsByRangeTime(eventReq: EventRequest): Observable<EventResponse[]> {
        return this.http.post<EventResponse[]>
            (`${this.apiUrl}/user/time-start-between`, eventReq);
    }

    createEvent(eventReq: EventRequest): Observable<EventResponse> {
        return this.http.post<EventResponse>
            (`${this.apiUrl}/create`, eventReq);
    }

    updateEvent(eventReq: EventRequest): Observable<EventResponse> {
        return this.http.put<EventResponse>
            (`${this.apiUrl}/update`, eventReq);
    }

    deleteEvent(eventId: string): Observable<EventResponse> {
        return this.http.delete<EventResponse>
            (`${this.apiUrl}/delete/${eventId}`);
    }
}