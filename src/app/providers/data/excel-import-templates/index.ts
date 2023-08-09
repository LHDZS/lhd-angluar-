import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { TranslateService } from '../../i18n-translate';

/**
 * 导入模板配置
 */
@Injectable()
export class QlwImportTemplateService {
    constructor(private translator: TranslateService) {}

    /** 产蛋周龄指标 */
    get layEggsIndex() {
        return {
            title: this.translator.I18N.importExcelTemplats.layEggsIndex.title,
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/layEggsIndex/${this.translator.I18N.importExcelTemplats.layEggsIndex.fileName}.xlsx`,
            jsonPath: `assets/excel_template_files/${this.translator.lang}/layEggsIndex/layEggsIndex.json`,
            server: `${environment.poultryProductionServer}/layEggsIndex/import`,
        };
    }

    /** 蛋品销售导入 */
    get egggoodssalesorder() {
        return {
            /** 蛋品销售导入标题 */
            title: this.translator.I18N.importExcelTemplats.egggoodssalesorder.title,
            /** 蛋品销售Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/egggoodssalesorder/${this.translator.I18N.importExcelTemplats.egggoodssalesorder.fileName}.xlsx`,
            /** 蛋品销售数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/egggoodssalesorder/egggoodssalesorder.json`,
            /** 蛋品销售导入服务地址 */
            server: `${environment.poultryProductionServer}/EggGoodsSalesOrder/import`,
        };
    }

    /** 养殖标准导入 */
    get zqbreedstandard() {
        return {
            /** 养殖标准导入标题 */
            title: this.translator.I18N.importExcelTemplats.zqbreedstandard.title,
            /** 养殖标准Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/zqbreedstandard/${this.translator.I18N.importExcelTemplats.zqbreedstandard.fileName}.xlsx`,
            /** 养殖标准数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/zqbreedstandard/zqbreedstandard.json`,
            /** 养殖标准导入服务地址 */
            server: `${environment.poultryProductionServer}/ZqBreedStandard/import`,
        };
    }
    /** 养户领苗单 */
    get chickenreceive() {
        return {
            /** 养户领苗单导入标题 */
            title: this.translator.I18N.importExcelTemplats.chickenreceive.title,
            /** 养户领苗单Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/chickenreceive/${this.translator.I18N.importExcelTemplats.chickenreceive.fileName}.xlsx`,
            /** 养户领苗单数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/chickenreceive/chickenreceive.json`,
            /** 养户领苗单导入服务地址 */
            server: `${environment.yhProductionServer}/YHChickenReceive/import`,
        };
    }
    /** 养户领料单 */
    get materialreceive() {
        return {
            /** 养户领料单导入标题 */
            title: this.translator.I18N.importExcelTemplats.materialreceive.title,
            /** 养户领料单Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/materialreceive/${this.translator.I18N.importExcelTemplats.materialreceive.fileName}.xlsx`,
            /** 养户领料单数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/materialreceive/materialreceive.json`,
            /** v导入服务地址 */
            server: `${environment.yhProductionServer}/MaterialReceive/import`,
        };
    }
    /** 保证金收支 */
    get yhcashdeposit() {
        return {
            /** 保证金收支导入标题 */
            title: this.translator.I18N.importExcelTemplats.yhcashdeposit.title,
            /** 保证金收支Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/yhcashdeposit/${this.translator.I18N.importExcelTemplats.yhcashdeposit.fileName}.xlsx`,
            /** 保证金收支数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/yhcashdeposit/yhcashdeposit.json`,
            /** v导入服务地址 */
            server: `${environment.yhProductionServer}/YhCashDeposit/import`,
        };
    }
    /** 放养巡查填报 */
    get yhpatrolrecord() {
        return {
            /** 放养巡查填报导入标题 */
            title: this.translator.I18N.importExcelTemplats.yhpatrolrecord.title,
            /** 放养巡查填报Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/yhpatrolrecord/${this.translator.I18N.importExcelTemplats.yhpatrolrecord.fileName}.xlsx`,
            /** 放养巡查填报数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/yhpatrolrecord/yhpatrolrecord.json`,
            /** 放养巡查填报导入服务地址 */
            server: `${environment.yhProductionServer}/YhPatrolRecord/import`,
        };
    }
    /** 药杂领用单 */
    get drugotherreceive() {
        return {
            /** 药杂领用单导入标题 */
            title: this.translator.I18N.importExcelTemplats.drugotherreceive.title,
            /** 药杂领用单Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/drugotherreceive/${this.translator.I18N.importExcelTemplats.drugotherreceive.fileName}.xlsx`,
            /** 药杂领用单数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/drugotherreceive/drugotherreceive.json`,
            /** 药杂领用单导入服务地址 */
            server: `${environment.yhProductionServer}/DrugOtherReceive/import`,
        };
    }
    /** 肉禽回收出栏 */
    get yhouthouserecycle() {
        return {
            /** 肉禽回收出栏导入标题 */
            title: this.translator.I18N.importExcelTemplats.yhouthouserecycle.title,
            /** 肉禽回收出栏Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/yhouthouserecycle/${this.translator.I18N.importExcelTemplats.yhouthouserecycle.fileName}.xlsx`,
            /** 肉禽回收出栏数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/yhouthouserecycle/yhouthouserecycle.json`,
            /** 肉禽回收出栏导入服务地址 */
            server: `${environment.yhProductionServer}/OutHouseRecycle/import`,
        };
    }
    /** 养殖场 */
    get yhchickenfarm() {
        return {
            /** 养殖场导入标题 */
            title: this.translator.I18N.importExcelTemplats.yhchickenfarm.title,
            /** 养殖场Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/yhchickenfarm/${this.translator.I18N.importExcelTemplats.yhchickenfarm.fileName}.xlsx`,
            /** 养殖场数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/yhchickenfarm/yhchickenfarm.json`,
            /** 养殖场导入服务地址 */
            server: `${environment.yhBasicSettingServer}/YhChickenFarmRelate/import`,
        };
    }

    /** 养户 */
    get yhfarmerinfomation() {
        return {
            /** 养户导入标题 */
            title: this.translator.I18N.importExcelTemplats.yhfarmerinfomation.title,
            /** 养户Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/yhfarmerinfomation/${this.translator.I18N.importExcelTemplats.yhfarmerinfomation.fileName}.xlsx`,
            /** 养户数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/yhfarmerinfomation/yhfarmerinfomation.json`,
            /** 养户导入服务地址 */
            server: `${environment.yhBasicSettingServer}/YHFarmerInformation/import`,
        };
    }
    /** 养殖合同 */
    get yhfarmercontract() {
        return {
            /** 养殖合同导入标题 */
            title: this.translator.I18N.importExcelTemplats.yhfarmercontract.title,
            /** 养殖合同Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/yhfarmercontract/${this.translator.I18N.importExcelTemplats.yhfarmercontract.fileName}.xlsx`,
            /** 养殖合同数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/yhfarmercontract/yhfarmercontract.json`,
            /** 养殖合同导入服务地址 */
            server: `${environment.yhProductionServer}/FarmerContract/import`,
        };
    }
    /** 养户批次 */
    get yhbatch() {
        return {
            /** 养户批次导入标题 */
            title: this.translator.I18N.importExcelTemplats.yhbatch.title,
            /** 养户批次Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/yhbatch/${this.translator.I18N.importExcelTemplats.yhbatch.fileName}.xlsx`,
            /** 养户批次数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/yhbatch/yhbatch.json`,
            /** 养户批次导入服务地址 */
            server: `${environment.yhBasicSettingServer}/YHBatch/import`,
        };
    }
    /** 领用价格方案 */
    get yhpriceproposals() {
        return {
            /** 领用价格方案导入标题 */
            title: this.translator.I18N.importExcelTemplats.yhpriceproposals.title,
            /** 领用价格方案Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/yhpriceproposals/${this.translator.I18N.importExcelTemplats.yhpriceproposals.fileName}.xlsx`,
            /** 领用价格方案数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/yhpriceproposals/yhpriceproposals.json`,
            /** 领用价格方案导入服务地址 */
            server: `${environment.yhProductionServer}/PriceProposals/import`,
        };
    }

    /** 肉禽销售订单 */
    get yhpoultrysales() {
        return {
            /** 肉禽销售订单导入标题 */
            title: this.translator.I18N.importExcelTemplats.yhpoultrysales.title,
            /** 肉禽销售订单Excel模板 */
            xlsxPath: `assets/excel_template_files/${this.translator.lang}/yhpoultrysales/${this.translator.I18N.importExcelTemplats.yhpoultrysales.fileName}.xlsx`,
            /** 肉禽销售订单数据模板 */
            jsonPath: `assets/excel_template_files/${this.translator.lang}/yhpoultrysales/yhpoultrysales.json`,
            /** 肉禽销售订单导入服务地址 */
            server: `${environment.yhProductionServer}/YHPoultrySalesOrder/import`,
        };
    }
}
