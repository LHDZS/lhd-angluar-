import { DateTime } from 'src/app/providers/common/datetime';
import * as internal from 'assert';
import { DataDictionary } from 'src/app/providers/enums';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';

export class yhchickenfarmModel {
    /// <summary>
    /// 鸡场ID
    /// </summary>
    ChickenFarmID: string = '0';
    /// <summary>
    /// 鸡场名称
    /// </summary>
    ChickenFarmName: string = '';
    YHFarmType: string;
    CreateEnterpriseID: string = USER_INFO_CONTEXT.enterpriseId;
    StartDate: string = null;
    AreaID: string;
    CoordinateAddr: string;
    /// <summary>
    /// 鸡场详细地址
    /// </summary>
    FullAddress: string = '';
    Status: boolean = true;
    MarketID:string = '0';
    Remarks: string;
    LON: Number = 0;
    LAT: Number = 0;
    ComboPack: string = DataDictionary.ComboPackA;
    WarehouseID: string = '0';
    DrugWarehouseID: string = '0';
    FeedWarehouseID: string = '0';
    PoultryCategory:Number=2;
}

export class yhchickenHenHouseModel {
    HenHouseID: string;
    HenHouseName: string;
    ChickenFarmID: string;
    ZoningID: string = '';
    iCount: Number = 0;
    AreaSize: Number = 0;
    CreateEnterpriseID: string;
    Status:boolean = true;
    Remarks: string = '';
    ComboPack: string = DataDictionary.ComboPackA;
    type: boolean = true;
}

export class AddressInfoEntity {
    /** 经度 */
    longitude: number = -1;
    /** 纬度 */
    latitude: number = -1;
    /** 坐标地址 */
    coordinateAddr: string = '';
}

export class ZoningModel {

    /// <summary>
    /// 场区id
    /// 主键
    /// </summary>
    ZoningID: string = '';

    /// <summary>
    /// 名称
    /// </summary>
    ZoningName: string = '';

    /// <summary>
    /// 编码
    /// </summary>
    ZoningCode: string = '';

    /// <summary>
    /// 助记码
    /// </summary>
    MnemonicCode: string='';

    /// <summary>
    /// 单位id
    /// </summary>
    EnterpriseID: string = '';

    /// <summary>
    /// 农场id
    /// </summary>
    FarmID: string = '';

    RecordId: number;
    NumericalOrder: string = '';
    CreatedDate: Date;
    CreatedOwnerId: string;
    ModifiedDate: Date;
    OwnerId: string;
    Remarks: string;
}