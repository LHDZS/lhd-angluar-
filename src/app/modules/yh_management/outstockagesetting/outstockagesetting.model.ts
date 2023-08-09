import { DateTime } from 'src/app/providers/common/datetime';
import { DataStatus } from 'src/app/providers/enums';

export class OutStockAgeSettingModel {
    /** 操作标识 */
    OutStockAgeSettingDto: Array<OutStockAgeSettingDto> = [];
}
export class OutStockAgeSettingDto {
      /// <summary>
    /// 品种
    /// </summary>
    BreedingID: string;
    BreedingName: string;
    SexType: string;
    SexTypeName: string;
      /// <summary>
    /// 最小出栏日龄
    /// </summary>
    MinDaysOld: number;
    /// <summary>
    /// 最大出栏日龄
    /// </summary>
    MaxDaysOld: number;
    Target: number;
}