export interface AppointmentUpdateReq {
    id: string;
    denId: number | null;
    assiId: number | null;
    patId: string | null;
    timeStart: string | null;
    timeEnd: string | null;
    note: string | null;
    symptom: string | null;
}