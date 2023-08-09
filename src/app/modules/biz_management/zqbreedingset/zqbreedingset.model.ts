import { DateTime } from 'src/app/providers/common/datetime';

export class BreedingSettingModel {

    /// <summary>
    /// 品种id
    /// 主键
    /// <!--表示唯一标识实体的一个或多个属性。-->
    /// </summary>
    BreedingID: string = '';
    /// <summary>
    /// 名称
    /// </summary>
    BreedingName: string = '';
    /// <summary>
    /// 编码
    /// </summary>
    BreedingNo: string = '';
    /// <summary>
    /// 禽别;系统字典 pid=2201051734480000580
    /// </summary>
    PoultryType: string;
    /// <summary>
    /// 集团id
    /// </summary>
    GroupID: string = '';
    /// <summary>
    /// 是否在用;1-在用；0-停用,
    /// </summary>
    Status: boolean = true;
    CreatedDate: Date;
    CreatedOwnerId: string;
    ModifiedDate: Date;
    OwnerId: string;
    Remarks: string;
}
