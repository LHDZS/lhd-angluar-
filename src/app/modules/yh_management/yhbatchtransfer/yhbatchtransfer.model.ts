import {DataDictionary } from 'src/app/providers/enums';
export class YhBatchTransferAdd {
    /// <summary>
    /// 日期
    /// </summary>
    DataDate: string;
    ChickenFarmID: string="0";
    YHFarmerID: string;
    YHBatch: string = '';
    OldYHFarmerID: string;
    YHFarmerContract: string;
    SerialNo: string;
    OldYHFarmerContract: string;
    TransferReason: string;
    OldSerialNo: string;
    OldDataDate: string;
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
    YhBatchTransferDetailDto: Array<YhBatchTransferDetailDto> = [];
}
export class YhBatchTransferDetailDto {
    NumericalOrder: string;
    NumericalOrderDetail: string;
    Remarks: string;
    iSortPlus: string;
    Specification: string;
    HenhouseID: string;
    ProductID: string;
    ProductName: string;
    ProductBatchID: string;
    MeasureUnitName: string;
    Packages: Number;
    Quantity: Number;
    WarehouseID: string;
    Target: Number;
}

export class YhBatchTransferdate {
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
    YhBatchTransferDto: Array<YhBatchTransferupdateDetail> = [];
}
export class YhBatchTransferupdateDetail {
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
