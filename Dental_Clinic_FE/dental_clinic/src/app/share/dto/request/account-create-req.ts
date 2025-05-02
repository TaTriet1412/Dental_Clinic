export interface CreateAccountReq {
    roleId: number;
    email: string;
    phone: string;
    name: string;
    address: string;
    gender: boolean;
    birthday: Date;
    salary: number;
}