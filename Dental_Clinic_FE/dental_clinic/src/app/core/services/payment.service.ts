import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BillCreateReq } from "../../share/dto/request/bill-create-req";
import { BillUpdateReq } from "../../share/dto/request/bill-update-req";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root',
})
export class PaymentService {
    
    private apiUrl = 'http://localhost:8060/payment';
    private apiBillUrl = `${this.apiUrl}/bill`;

    constructor(
        private http: HttpClient,
        private authService: AuthService, // Inject AuthService to get JWT token
    ) {
    }

    getAllBill(): Observable<any> {
        return this.http.get<any>(`${this.apiBillUrl}`);
    }

    getBillById(billId: number): Observable<any> {
        return this.http.get<any>(`${this.apiBillUrl}/${billId}`);
    }

    getBillStatusList(): Observable<any> {
        return this.http.get<any>(`${this.apiBillUrl}/status`);
    }

    getPaginationBills(filters: Record<string, any>, page: any, size: any, sortFields: string): Observable<any>  {
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
        const url = `${this.apiBillUrl}/pagination`;
        console.log('GET', url, params.toString());
        return this.http.get<any>(`${this.apiBillUrl}/pagination`, { params, headers });
    }

    createBill(bill: BillCreateReq): Observable<any> {
        return this.http.post<any>(`${this.apiBillUrl}/create`, bill);
    }

    updateBill(bill: BillUpdateReq): Observable<any> {
        return this.http.put<any>(`${this.apiBillUrl}/update`, bill);
    }

    cancelBill(billId: number): Observable<any> {
        return this.http.put<any>(`${this.apiBillUrl}/${billId}/cancel`, {});
    }

    payByVnPay(
        amount: number,
        billInfo: string,
        billId: number,
        rebackUrl: string, //url trở về trang sau khi thanh toán xong
    ): Observable<{ redirectUrl: string }> {
        const token = this.authService.getToken();  // Lấy JWT từ AuthService
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        const formData: FormData = new FormData();
        formData.append('amount', amount.toString());
        formData.append('billInfo', billInfo);
        formData.append('detailUrl', rebackUrl);
        formData.append('billId', billId.toString());

        return this.http.post<{ redirectUrl: string }>(`${this.apiUrl}/vnpay`,
            formData, { headers });
    }

    sendPaymentResult(paymentDetails: any): Observable<any> {
        // Tạo HttpParams từ đối tượng paymentDetails
        let params = new HttpParams();
        for (const key in paymentDetails) {
            if (paymentDetails.hasOwnProperty(key)) {
                params = params.append(key, paymentDetails[key]);
            }
        }

        // Gửi GET request với các tham số
        const token = this.authService.getToken();  // Lấy JWT từ AuthService
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/afterPayed`, { params, headers });
    }
}