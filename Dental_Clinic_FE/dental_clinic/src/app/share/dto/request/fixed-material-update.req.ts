export interface FixedMaterialUpdateReq {
    id: number;
    categoryId: number;
    name: string;
    func: string;
    unit: string;
    mfg_date: Date;
    quantity: number;
}