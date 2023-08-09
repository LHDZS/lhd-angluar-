import {DataDictionary } from 'src/app/providers/enums';
export class YhMaterialReceiveAdd {
    /// <summary>
    /// 日期
    /// </summary>
    DataDate: string;
    ChickenFarmID: string="0";
    YHFarmerID: string;
    YHBatch: string = '';
    Abstract: string;
    OutWarehouse: string;
    InWarehouse: string;
    BreedingID: string;
    CalcFeeStatus: Number = 0;
    Driver: string;
    ConfirmStatus: Number = 0;
    NumericalOrder: string;
    Number: Number;
    ComboPack: string = DataDictionary.ComboPackA;
    ReceiveType: string;
    /// <summary>
    /// 备注
    /// </summary>
    Remarks: string;
    isbegin:boolean;
    /// <summary>
    /// 详情数据
    /// </summary>
    MaterialReceiveDetailDto: Array<MaterialReceiveDetailDto> = [];
}
export class MaterialReceiveDetailDto {
    NumericalOrder: string;
    NumericalOrderDetail: string;
    StandardPack: string;
    Specification: string;
    HenhouseID: string;
    ProductID: string;
    ProductBatchID: string;
    Packages: Number;
    MeasureUnitName: string;
    UnitPrice: Number;
    AmountTotal: Number;
    Quantity: Number;
    Gift: boolean ;
    BreedingID: string;
    DetailRemarks: string;
    Target: Number;
    Remarks: string;
}
