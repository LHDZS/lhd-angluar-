import houseEn from './house-unit.en';
import houseZh from './house-unit.zh';
import houseVi from './house-unit.vi';
import { NxTranslateI18N, LanguageType } from 'src/app/nxin/i18n';

export class IndexManagementTranslator {
    private getHouseUnitsTarget(): Array<any> {
        switch (NxTranslateI18N.lang) {
            case LanguageType.en:
                return houseEn;
            case LanguageType.vi:
                return houseVi;
            default:
                return houseZh;
        }
    }
    houseUnitsConverter(source: any): void {
        if (source && source.pigHouseUnitTypes && source.pigHouseUnitTypes.length > 0) {
            const pigHouseUnitTypes = source.pigHouseUnitTypes;
            const targets = this.getHouseUnitsTarget();
            pigHouseUnitTypes.forEach((item) => {
                const target = targets.find((t) => t.pigHouseUnitTypeID === item.pigHouseUnitTypeID);

                if (target) {
                    item.pigHouseUnitType = target.pigHouseUnitType;
                }
            });
        }
    }
}