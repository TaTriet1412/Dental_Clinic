export interface MedicineRes {
    id: number;
    name: string;
    quantity: number;
    unit: string;
    mfg_date: string;
    able: boolean;
    price: number;
    cost: number;
    func: string;
    ingreIdList: number[];
    instruction: string;
    cared_actor: string;
    img: string;
    categoryId: number;
}