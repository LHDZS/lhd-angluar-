import {DataDictionary } from 'src/app/providers/enums';
export class PatrolrecordAdd {
    /// <summary>
    /// 日期
    /// </summary>
    DataDate: string;
    YHFarmerID: string;
    YHBatch: string = '';
    ChickenFarmID: string="0";
    HenhouseID: string;
    PersonID: string;
    isbegin: string;
    FeedWarehouseID: string;
    WarehouseID: string;
    BreedingID: string;
    NumericalOrder: string;
    Number: Number;
    Files: any;
    ComboPack: string = DataDictionary.ComboPackA;
    /// <summary>
    /// 备注
    /// </summary>
    Remarks: string;
    /// <summary>
    /// 详情数据
    /// </summary>
    YhPatrolRecordDetailDto: Array<YhPatrolRecordDetailDto> = [];
}
export class YhPatrolRecordDetailDto {
    NumericalOrder: string;
    NumericalOrderDetail: string;
    DataDateDetail: string;
    DeathQuantity: Number;
    DaysOld: string;
    ProductID: string;
    ProductBatchID: string;
    ProductBatchName: string;
    Packages: Number;
    MeasureUnitName: string;
    CullQuantity: Number;
    DeathCullRemarks: Number;
    Quantity: Number;
    FeedRemarks: string;
    BreedingID: string;
    Target: Number;
    Remarks: string;
    NumericalOrderExtend: string;
    NumericalOrderExtend2: string;
}
