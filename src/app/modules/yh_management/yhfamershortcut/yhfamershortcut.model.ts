import { DateTime } from 'src/app/providers/common/datetime';
import { DataDictionary } from 'src/app/providers/enums';
import * as internal from 'assert';

export class yhfamershortcutModel {
    YHFarmerID: string = '';
    /// <summary>
    /// 养户ID
    /// </summary>
    YHFarmerName: string = '';
    /// <summary>
    /// 养户名称
    /// </summary>
    YHPersonName: string = '';
    /// <summary>
    /// </summary>
    IdCardNumber: string = '';
    /// <summary>
    /// </summary>
    MnemonicCode: string = '';
    /// <summary>
    /// 日期
    /// </summary>
    StartDate: string = null;
    /// <summary>
    /// 所在区域
    /// </summary>
    AreaId: string = '';
    /// <summary>
    /// 养户详细地址
    /// </summary>
    Address: string = '';
    /// <summary>
    /// 启用日期
    /// </summary>
    StartUsing: string = new DateTime(new Date().toString()).toString('yyyy-MM-dd');
    /// <summary>
    /// 性别
    /// </summary>
    Sex: boolean = true;
    Status: boolean = true;
    ICount: number = 0;
    Phone: string = '';
    ComboPack: string = DataDictionary.ComboPackA;;
    MarketID:string = '0';
    Remarks: string = '';
    //养殖场信息
    ChickenFarmName: string = '';
    YHFarmType: string = '201704130105242112';
    CoordinateAddr: string = '';
    FullAddress: string = '';
    ChickenFarmRemarks: string = '';
    LON: Number = 0;
    LAT: Number = 0;
    WarehouseID: string = '0';
    DrugWarehouseID: string = '0';
    FeedWarehouseID: string = '0';
    // 手机客户查询
    CustomerID: string = '0';
    CustomerName: string = '';
    EnterpriseId: string = '0';
    EnterpriseName: string = '';
    IsInner: Number = 0;
    IsPm: Number = 0;
    IsPmImp: Number = 0;
    IsSa: Number = 0;
    IsSaImp: Number = 0;
    LinkMan: string = '';
    YHFarmerHenhouseRelateDto: any;
    YHFarmerMgmtRelateDto: any;
    FileDto: any;
    PoultryCategory: number ;
}

export class YHFarmerConcertRelateDto {
    BO_ID: string = '0';
    Name: string = '';
    Phone: string = '';
    NumericalOrderDetail: string = '0';
    Card: string = '';
    Remarks: string = '';
    YHFarmerID: string = '0';
    Status: boolean = true;
    type: boolean = false;
}

//栋信息
export class yhfamershortcutbuildingModel {
    /// <summary>
    /// 养户ID
    /// </summary>
    ChickenFarmID: string = '';
    /// <summary>
    /// 养户名称
    /// </summary>
    ChickenFarmName: string = '';
    /// <summary>
    /// 养户简称
    /// </summary>
    ChickenFarmShortName: string = '';
    /// <summary>
    /// 养户编码
    /// </summary>
    ChickenFarmNumer: string = '';
    /// <summary>
    /// 养户类型
    /// </summary>
    ChickenFarmType: string = '';
    /// <summary>
    /// 所在区域
    /// </summary>
    AreaId: string = '';
    /// <summary>
    /// 养户详细地址
    /// </summary>
    FullAddress: string = '';
    /// <summary>
    /// 启用日期
    /// </summary>
    StartUsing: string = new DateTime(new Date().toString()).toString('yyyy-MM-dd');
    /// <summary>
    /// 负责人ID
    /// </summary>
    PersonId: string;
    /// <summary>
    /// 公司ID
    /// </summary>
    EnterpriseId: string = '';

    Status: boolean = true;
    ICount: number = 0;
    Phone: string = '';
    ComboPack: string = '';
    /// <summary>
    /// 核算单元
    /// </summary>
    NTicketedPointID:string;
    MarketID:string;
    NWarehouseID: string;
    DrugWarehouseID: string;
    ByProdWarehouseID: string;
    ProductWarehouseID: string;
}

export class yhfamershortcutModelPe {
    /// <summary>
    /// 养户ID
    /// </summary>
    ChickenFarmID: string = '';
    /// <summary>
    /// 养户名称
    /// </summary>
    ChickenFarmName: string = '';
    /// <summary>
    /// 养户简称
    /// </summary>
    ChickenFarmShortName: string = '';
    /// <summary>
    /// 养户编码
    /// </summary>
    ChickenFarmNumer: string = '';
    /// <summary>
    /// 养户类型
    /// </summary>
    ChickenFarmType: string = '';
    /// <summary>
    /// 所在区域
    /// </summary>
    AreaId: string = '';
    /// <summary>
    /// 养户详细地址
    /// </summary>
    FullAddress: string = '';
    /// <summary>
    /// 启用日期
    /// </summary>
    StartUsing: string = new DateTime(new Date().toString()).toString('yyyy-MM-dd');
    /// <summary>
    /// 负责人ID
    /// </summary>
    PersonId: string;
    /// <summary>
    /// 公司ID
    /// </summary>
    EnterpriseId: string = '';
    RoleID: string = '0';
    Status: boolean = true;
    ICount: number = 0;
    Phone: string = '';
    ComboPack: string = '';
    /// <summary>
    /// 核算单元
    /// </summary>
    NTicketedPointID:string;
    MarketID:string;
    NWarehouseID: string;
    DrugWarehouseID: string;
    ByProdWarehouseID: string;
    ProductWarehouseID: string;
}