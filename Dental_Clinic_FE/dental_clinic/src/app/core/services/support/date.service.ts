import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root',
})
export class DateSupportService {

    constructor(
    ) {
    }

    combineDateAndTime(date: Date, time: Date): string {
        try {
            // Lấy các thành phần ngày từ tham số `date`
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');

            // Lấy các thành phần giờ từ tham số `time`
            const hours = time.getHours().toString().padStart(2, '0');
            const minutes = time.getMinutes().toString().padStart(2, '0');
            const seconds = time.getSeconds().toString().padStart(2, '0');

            // Kết hợp ngày và giờ thành chuỗi định dạng `yyyy-MM-ddTHH:mm:ss`
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        } catch (error) {
            console.error("Error combining date and time:", error);
            return '';
        }
    }
}