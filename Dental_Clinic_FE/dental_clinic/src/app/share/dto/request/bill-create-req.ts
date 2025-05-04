import { DentalBillReq } from "./dental-bill-req";

export interface BillCreateReq {
    patientId: string;
    prescriptionId: string;
    note: string;
    services: DentalBillReq[];
}