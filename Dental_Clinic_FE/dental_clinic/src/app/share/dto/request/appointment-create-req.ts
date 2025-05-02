export interface AppointmentCreateReq {
    denId: number;
    assiId: number;
    patId: string;
    timeStart: string;
    timeEnd: string;
    note: string;
    symptom: string;
}