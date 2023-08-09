import { DateTime } from 'src/app/providers/common/datetime';
import { DataDictionary } from 'src/app/providers/enums';

//表头数据
export class yhmaterialsettingsModel {
    DataDate: any = new Date();
    ModifiedDate: any = new Date();
    EffectDate: any = '';
    Remarks: string = '';
    FilesDto: any = [];
    Number: string = '';
    NumericalOrder: string = '';
    MaterialSettingsDetailDto: Array<yhmaterialsettingsDataModel> = [];
}

const headerGridArr: any = [
    {
        BreedingIDs: '',
        BreedingIDArr: [],
        StartDaysOld: '',
        EndDaysOld: '',
        FemaleWeight: '',
        MaleWeight: '',
        MixedWeight: '',
        NumericalOrder: '0',
        NumericalOrderDetail: '0',
        MaterialSettingsExtendDto: []
    },
];


export { headerGridArr }

// 卡片数据
export class yhmaterialsettingsDataModel {
    RecordID: number;
    BreedingIDs: string = '0';
    BreedingIDArr: any = []
    StartDaysOld: Number;
    EndDaysOld: Number;
    FemaleWeight: Number;
    MaleWeight: Number;
    MixedWeight: Number;
    NumericalOrder: string = '0';
    NumericalOrderDetail: string = '0';
    MaterialSettingsExtendDto: Array<YHFarmerConcertRelateDto> = [];
}

// 明细数据
export class YHFarmerConcertRelateDto {
    RecordID: string = '0';
    ProductID: string;
    StartDaysOld: Number;
    EndDaysOld: Number;
    FemaleWeight: Number;
    MaleWeight: Number;
    MixedWeight: Number;
    Specification: string = '';
    Stages: string = '';
    MeasureUnitName: string = '';
    Remarks: string = '';
    NumericalOrder: string = '0';
    NumericalOrderDetail: string = '0';
}