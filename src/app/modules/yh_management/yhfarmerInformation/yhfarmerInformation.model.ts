import { DateTime } from 'src/app/providers/common/datetime';
import * as internal from 'assert';
import { DataDictionary } from 'src/app/providers/enums';
import { DataStatus, EditorGridUtils } from 'src/app/components/editor-grid';

export class yhfarmerInformationModel {
    /// <summary>
    /// 养户ID
    /// </summary>
    YHFarmerID: string = '';
    /// <summary>
    /// 养户名称
    /// </summary>
    YHFarmerName: string = '';
    /// <summary>
    /// 养户姓名
    /// </summary>
    YHPersonName: string = '';
    /// <summary>
    /// 养户身份证
    /// </summary>
    IdCardNumber: string = '';
    /// <summary>
    /// 养户性别
    /// </summary>
    Sex: boolean = true;
    /// <summary>
    /// 养户详细地址
    /// </summary>
    Address: string = '';
    /// <summary>
    /// 启用日期
    /// </summary>
    StartUsing: string = new DateTime(new Date().toString()).toString('yyyy-MM-dd');
    /// <summary>
    /// 手机号
    /// </summary>
    Phone: string;
    /// <summary>
    /// 助记码
    /// </summary>
    MnemonicCode: string = '';

    Status: boolean = true;
    ICount: number = 0;
    StartDate: string = null;
    Remarks: string = '';
    ComboPack: string = DataDictionary.ComboPackA;
    MarketID:string = '0';
    FileDto: any;
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
    YHFarmerHenhouseRelateDto: any[];
    YHFarmerMgmtRelateDto: any[];
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

export class YHFarmerMgmtRelateDto {
    YHFarmerID: string;
    NumericalOrderDetail: string = '0';
    StartDate: any = null;
    EndDate: any = null;
    PersonID: string;
    PersonName: string;
    Phone: string;
    RoleID: string;
    RoleName: string;
}

export class FileDto {

}

export class AddressInfoEntity {
    /** 经度 */
    longitude: number = -1;
    /** 纬度 */
    latitude: number = -1;
    /** 坐标地址 */
    coordinateAddr: string = '';
}