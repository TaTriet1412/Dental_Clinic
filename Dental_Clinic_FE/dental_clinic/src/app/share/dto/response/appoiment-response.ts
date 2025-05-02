export interface AppointmentResponse {
    id: string,
    denId: number,
    patId: string,
    assiId: number,
    timeStart: string,
    timeEnd: string,
    symptom: string,
    note: string,
    createdAt: string,
    status: string
}