import { DentalBillReq } from "./dental-bill-req";

export interface BillUpdateReq {
    id: number;
    prescriptionId: string;
    note: string;
    services: DentalBillReq[];
}