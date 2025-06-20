import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root',
})
export class AppointmentSupportService {

    constructor(
    ) {
    }

    translateStatus(status: string): string {
        switch (status) {
            case 'confirmed':
                return 'Đã xác nhận';
            case 'in_progress':
                return 'Đang diễn ra';
            case 'finished':
                return 'Hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            case 'not_show':
                return 'Không đến';
            default:
                return status;
        }
    }
}