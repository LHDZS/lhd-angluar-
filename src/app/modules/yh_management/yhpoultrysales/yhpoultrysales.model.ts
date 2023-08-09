export class YHPoultrySales {
    NumericalOrder: String;
    Number: String;
    DataDate: String;
    CustomerID: String;
    ReqDeliveryDate: String;
    SalesManID: String;
    MarketID: String;
    Status: String;
    ChickenFarmID: String;
    GroupID: String;
    EnterpriseID: String;
    OwnerID: String;
    CreatedOwnerID: String;
    CreatedDate: String;
    ModifiedDate: String;
    Remarks: String;
    SalesPeriod: number;
    WeightStatus: boolean;
    /// <summary>
    /// 详情数据
    /// </summary>
    YHPoultrySalesDetailDtos: Array<YHPoultrySalesDetail> = [
        
    ];
}
export class YHPoultrySalesDetail {
    SerialNo: number;
    NumericalOrder: string = '';
    NumericalOrderDetail: string = '';
    GUID: String;
    ProductID: String;
    SexType: String;
    PoultrySalesRank: String;
    BreedingID: String;
    Quantity: number;
    MeasureUnitName: String;
    UnitPrice: String;
    Remarks: String;
    Target: number;
}
