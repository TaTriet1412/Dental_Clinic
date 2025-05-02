export interface UpdatePatientReq {
    id: string;
    name: string;
    phone: string;
    email: string;
    address: string;
    birthday: Date;
    gender: boolean;
}