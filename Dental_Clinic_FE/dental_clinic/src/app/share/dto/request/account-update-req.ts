export interface UpdateAccountReq {
    userId: number;
    email: string;
    phone: string;
    name: string;
    address: string;
    gender: boolean;
    birthday: Date;
    salary: number;
}