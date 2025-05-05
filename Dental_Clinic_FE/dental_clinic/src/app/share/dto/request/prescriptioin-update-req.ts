import { MedicinePrescriptionReq } from "./medicine-prescription-req";

export interface UpdatePrescriptionReq {
    id: string;
    pat_id: string;
    den_id: number;
    den_name: string;
    note: string;
    medicines: MedicinePrescriptionReq[];
}
