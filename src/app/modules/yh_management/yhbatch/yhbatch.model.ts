import { DataDictionary } from 'src/app/providers/enums';
import { DateTime } from 'src/app/providers/common/datetime';
import { DataStatus } from 'src/app/components/editor-grid';
import Guid from 'devextreme/core/guid';

export class yhBatchModel {
    /** 行主键 */
    YHBatchID: String;
    YHBatchName: String;
    DataDate: String;
    BreedingID: String;
    ProductID: String;
    ChickenType: String;
    // ChickSourceType: String;
    // ChickSource: String;
    DaysOldDate: String;
    DaysOld: Number;
    OneMedicineFee: Number;
    YHFarmerID: String;
    YHFarmerContract: String;
    ChickenFarmID: String;
    EnterpriseID: String;
    GroupID: String;
    ComboPack: String;
    OwnerID: String;
    CreatedOwnerID: String;
    CreatedDate: String;
    ModifiedDate: String;
    Remarks: String;
    Status: boolean;
    SerialNo:number;
}
export class yhBatchDetailModel {
    /** 行主键 */
    RecordID?: string;
    NumericalOrder: String;
    NumericalOrderDetail: String;
    HenhouseID: String;
    ChickenFarmID: String;
    ZoningID: String;
    EnterpriseID: String;
    Remarks: String;
    SerialNo:number;
    Target: number;
}
