import {DataDictionary } from 'src/app/providers/enums';
export class YhChickenReceiveAdd {
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
    ProductID: string;
    BreedingID: string;
    ChickenType: string;
    SourceType: string;
    DaysOld: Number = 1;
    Driver: string;
    SupplierID: string;
    isbegin:boolean;
    ConfirmStatus: Number = 0;
    NumericalOrder: string;
    Number: string;
    ComboPack: string = DataDictionary.ComboPackA;
    /// <summary>
    /// 备注
    /// </summary>
    Remarks: string;
    /// <summary>
    /// 详情数据
    /// </summary>
    YHChickenReceiveDetailDto: Array<YHChickenReceiveDetailDto> = [];
}
export class YHChickenReceiveDetailDto {
    NumericalOrder: string;
    NumericalOrderDetail: string;
    Remarks: string;
    HenhouseID: string;
    ProductID: string;
    ProductName: string;
    ProductBatchID: string;
    ValueQuantity: Number;
    MeasureUnitName: string;
    UnitPrice: Number;
    AmountTotal: Number;
    DonateQuantity: Number;
    TotalQuantity: Number;
    Gift: boolean = false;
    BreedingID: string;
    Target: Number;
}

export class YhChickenReceivedate {
    NumericalOrder: string;
    Number: string;
    DataDate: string;
    ChickenSource: string;
    ChickenFarmID: string;
    FreightFor: string;
    BatchID: string;
    SupplierID: string;
    WarehouseID: string;
    ComboPack: string;
    EnterpriseID: string;
    /// <summary>
    /// 备注
    /// </summary>
    Remarks: string;
    /// <summary>
    /// 详情数据
    /// </summary>
    YhChickenReceiveDto: Array<YhChickenReceiveupdateDetail> = [];
}
export class YhChickenReceiveupdateDetail {
    NumericalOrder: string;
    NumericalOrderDetail: string;
    HenhouseID: string;
    SexType: string;
    Packages: Number;
    ProductID: string;
    cProductName: string;
    ValueQuantity: Number;
    GiftQuantity: Number;
    DeliveryTotal: Number;
    ValueTotal: Number;
    UnitPrice: Number;
    AmountTotal: Number;
    LossTotal: Number;
    IntoHouseTotal: Number;
    Weight: Number;
    TaxPrice: Number;
    target: Number;
    Remarks: string;
}
