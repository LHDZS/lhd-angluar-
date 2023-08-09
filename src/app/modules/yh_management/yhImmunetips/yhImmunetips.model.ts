import { DateTime } from 'src/app/providers/common/datetime';
import { DataDictionary } from 'src/app/providers/enums';

export class yhImmunetipsModel {
    RecycleType: string = 'number;number;011316number;9number;50004155';
    DataDate: any = new Date();
    CustomerID: string = '0';
    YHFarmerID: string = '0';
    YHBatch: string = '0';
    ChickenFarmID: string = '0';
    HenhouseID: string = '0';
    PersonID: string = '0';
    WarehouseID: string = '0';
    Remarks: string = '';
    Number: string = '0';
    NumericalOrder: string = '0';
    NumberRef: string = '0';
    NumericalOrderRef: string = '0';
    ComboPack: string = DataDictionary.ComboPackF;
}

// 数据
export class yhImmunetipsDataModel {
    RecycleType: string = 'number;number;011316number;9number;50004155';
    DataDate: any = new Date();
    CustomerID: string = '0';
    YHFarmerID: string = '0';
    YHBatch: string = '0';
    ChickenFarmID: string = '0';
    HenhouseID: string = '0';
    PersonID: string = '0';
    WarehouseID: string = '0';
    Remarks: string = '';
    Number: string = '0';
    NumericalOrder: string = '0';
    NumberRef: string = '0';
    NumericalOrderRef: string = '0';
    ComboPack: string = DataDictionary.ComboPackF;
}

export class YHFarmerConcertRelateDto {
    BO_ID: string = '0';
    Name: string = '';
    Phone: string = '';
    NumericalOrderDetail: string = '0';
    Card: string = '';
    Remarks: string = '';
    YHFarmerID: string = '0';
    Status: boolean = true;
    type: boolean = false;
}