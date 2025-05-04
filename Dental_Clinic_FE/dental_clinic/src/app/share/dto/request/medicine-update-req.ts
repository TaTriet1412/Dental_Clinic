export interface MedicineUpdateReq {
    id: number;
    categoryId: number;
    name: string;
    func: string;
    unit: string;
    mfg_date: Date;
    quantity: number;
    ingreIdList: number[];
    cared_actor: string;
    price: number;
    cost: number;
    instruction: string;
}