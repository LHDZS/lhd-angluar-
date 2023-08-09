import { DataDictionary } from 'src/app/providers/enums';
import { DateTime } from 'src/app/providers/common/datetime';
import { DataStatus } from 'src/app/components/editor-grid';
import Guid from 'devextreme/core/guid';

export class YHClearHouseModel {
    /** 行主键 */
    RecordID?: string;
    NumericalOrder: string;
    NumericalOrderExpend: string;
    Number: string;
    DataDate: string;
    YHFarmerID: string;
    YHBatch: string;
    ChickenFarmID: string;
    WarehouseID: string;
    ComboPack: string;
    GroupID: string;
    EnterpriseID: string;
    Remarks: string;
    Details: YHClearHouseDetailModel[] = [];
}
export class YHClearHouseDetailModel {
    /** 行主键 */
    RecordID?: string;
    NumericalOrder: string;
    NumericalOrderDetail: string
    GUID: Guid;
    HenhouseID: string;
    CounterQuantity: number;
    UnknownQuantity: number;
    DeathCullOuter: number;
    WeedOuter: number;
    ReceiveQuantity: number;
    RegDeathCullQuantity: number;
    RegWeedOutQuantity: number;
    RollOutQuantity: number;
    RollInQuantity: number;
    TransferSurplus: number;
    TransferLoss: number;
    DeadQuantity: number;
    Quantity: number;
    Remarks: string;
    Target: number;
}
