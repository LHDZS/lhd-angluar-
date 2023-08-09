import { DataDictionary } from 'src/app/providers/enums';
import { DateTime } from 'src/app/providers/common/datetime';
import { DataStatus } from 'src/app/components/editor-grid';
import Guid from 'devextreme/core/guid';

export class YHOutHouseRecycleModel {
    /** 行主键 */
    RecordID?: string;
    NumericalOrder: string;
    NumericalOrderExpand: string;
    Remarks: string;
    Number: string;
    DataDate: string;
    InWarehouse: string;
    OutWarehouse: string;
    YHFarmerID: string;
    YHBatch: string;
    Abstract: string;
    QuoteBillType: string;
    QuoteNumber: string;
    QuoteNumericalOrderDetail: string;
    ChickenFarmID: string;
    ComboPack: string;
    GroupID: string;
    EnterpriseID: string;
    isbegin:boolean;
    Details: Array<YHOutHouseRecycleDetailModel> = [];
}
export class YHOutHouseRecycleDetailModel {
    /** 行主键 */
    RecordID?: string;
    NumericalOrder : string;
    Remarks : string;
    NumericalOrderDetail : string;
    ProductID : string;
    CageQuantity : number;
    ElementQuantity : number;
    GrossWeight : number;
    BareWeight : number;
    VehicleWeight : number;
    NetWeight : number;
    Quantity : number;
    MeasureUnit : number;
    ProposalUnit : number;
    UnitPrice : number;
    Amount : number;
    HenhouseID : string;
    TaxRate : number;
    Target: number;
}
