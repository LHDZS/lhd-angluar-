import {DataDictionary } from 'src/app/providers/enums';
export class YhDrugApplicationAdd {
    /// <summary>
    /// 日期
    /// </summary>
    DataDate: string;
    ChickenFarmID: string="0";
    YHFarmerID: string;
    YHBatch: string = '';
    OrderingType: string;
    SymptomID: any;
    DiseaseID: any;
    TransferReason: string;
    DaysOld: number;
    CurrentInventory: number;
    PersonID: string;
    NumericalOrder: string;
    NumericalOrderExtend: string;
    Number: string;
    ComboPack: string = DataDictionary.ComboPackA;
    InputSource: string;
    /// <summary>
    /// 备注
    /// </summary>
    Remarks: string;
    NumericalOrderRefNO: string;
    /// <summary>
    /// 详情数据
    /// </summary>
    YhDrugApplicationDetailDto: Array<YhDrugApplicationDetailDto> = [];
}
export class YhDrugApplicationDetailDto {
    NumericalOrder: string;
    NumericalOrderDetail: string;
    SerialNo: number;
    Remarks: string;
    CommonName: string;
    DrugsWay: string;
    DrugMethod: string;
    ProductID: string;
    ProductName: string;
    MeasureUnitName: string;
    Quantity: Number;
    NumericalOrderSource: string;
    NumericalOrderDetailSource: string;
    SourceType: string;
    ProcessNo: string;
    ImmuneSubjectID: string;
    Vendor: string;
    Target: Number;
}