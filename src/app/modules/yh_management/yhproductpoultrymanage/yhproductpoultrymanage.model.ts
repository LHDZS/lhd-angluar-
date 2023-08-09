import { DateTime } from 'src/app/providers/common/datetime';
import { DataStatus } from 'src/app/providers/enums';

export class PickupChickSettingModel {
    /** 操作标识 */
    Details: Array<ZqPickupChickSettingDto> = [];
}
export class ZqPickupChickSettingDto {
    /// 商品代号
    /// </summary>
    ProductID: string;
    /// <summary>
    /// 公母
    /// </summary>
    SexType: string;
    /// <summary>
    /// 等级
    /// </summary>
    PoultrySalesRank: string;
      /// <summary>
    /// 品种
    /// </summary>
    BreedingID: string;
      /// <summary>
    /// 计量单位
    /// </summary>
    UnitName: string;
      /// <summary>
    /// 状态
    /// </summary>
    Status: number;
    /// <summary>
    /// 套餐类型
    /// </summary>
    ComboPack:string;
    /// <summary>
    /// 单位
    /// </summary>
    EnterpriseID:string;
    /// <summary>
    /// 集团
    /// </summary>
    GroupID:string;
    Target: number;
    RecordID: string;
}

export class ZqPickupChickSettingQueryDto {

    // /// <summary>
    // /// 拣后类别
    // /// </summary>
    // SortingEggType: string;
    /// <summary>
    /// 蛋品名称
    // /// </summary>
    // SortingEggID: string;
    // //  /// <summary>
    // // /// 蛋品名称
    // // /// </summary>
    // SortingEggName: string;
    // /// <summary>
    // ///  显示名称
    // /// </summary>
    DisplayName: string;
    /// <summary>
    ///  商品
    /// </summary>
    ProductID: string;
      /// <summary>
    ///  商品
    /// </summary>
    cProductName: string;
    /// <summary>
    ///  计量单位
    /// </summary>
    MeasureUnitName: string;
    /// <summary>
    ///  批号规则
    /// </summary>
    // BatchRule: string;
    /// <summary>
    /// 管理批号
    /// </summary>
    // ManageBatch: boolean = true;
    /// <summary>
    /// 套餐类型
    /// </summary>
    ComboPack:string;
    /// <summary>
    /// 单位
    /// </summary>
    EnterpriseID:string;
    /// <summary>
    /// 集团
    /// </summary>
    GroupID:string;

    target: number;
    RecordID: string;

}