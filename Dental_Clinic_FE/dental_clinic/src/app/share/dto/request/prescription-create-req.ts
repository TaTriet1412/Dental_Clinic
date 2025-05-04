import { MedicinePrescriptionReq } from "./medicine-prescription-req";

export interface CreatePrescriptionReq {
    pat_id: string;
    den_id: number;
    note: string;
    medicines: MedicinePrescriptionReq[];
}
