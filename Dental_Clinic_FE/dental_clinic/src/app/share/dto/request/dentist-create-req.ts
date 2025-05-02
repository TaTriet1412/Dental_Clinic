import { CreateAccountReq } from "./account-create-req";

export interface CreateDentistReq {
    facId: number;
    specialty: string;
    expYear: number;
    account: CreateAccountReq
}