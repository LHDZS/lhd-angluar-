import { DataDictionary } from 'src/app/providers/enums';
import { DateTime } from 'src/app/providers/common/datetime';
import { DataStatus } from 'src/app/components/editor-grid';
import Guid from 'devextreme/core/guid';

export class ContractModel {
    /** 行主键 */
    NumericalOrder: String;
    DataDate: String;
    YHFarmerID: String;
    BeginDate: String;
    EndDate: String;
    ContractNo: String;
    ChickAbstract: String;
    FeedAbstract: String;
    DrugAbstract: String;

    ChickPriceType: String = DataDictionary.PriceTypeDefault;
    FeedPriceType: String = DataDictionary.PriceTypeDefault;
    DrugPriceType: String = DataDictionary.PriceTypeDefault;
    ConcertPerson: String;
    ChickenFarmID: String;
    ComboPack: String;
    GroupID: String;
    EnterpriseID: String;
    OwnerID: String;
    CreatedOwnerID: String;
    CreatedDate: String;
    ModifiedDate: String;
    Remarks: String;
    HenhouseDetailDtos: Array<ContractDetailModel> = [];
    FilesDto: any;
}
export class ContractDetailModel {
    /** 行主键 */
    RecordID?: string;
    NumericalOrder: String;
    NumericalOrderDetail: String;
    HenhouseID: String;
    ChickenFarmID: String;
    ZoningID: String;
    EnterpriseID: String;
    Remarks: String;
    Target: number;
    StartDate: String;
    EndDate: String;
    CreatedDate: String;
    ModifiedDate: String;
    CreatedOwnerID: String;
    OwnerID: String;
}
