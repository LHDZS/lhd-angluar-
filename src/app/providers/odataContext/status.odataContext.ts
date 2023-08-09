import { Injectable } from '@angular/core';
import { DataDictionary, ProjectTypeInfo } from '../enums';
import { TranslateI18N } from '../i18n-translate';

@Injectable()
export class StatusODataContext {
    getSalesTypeDataSource() {
        return [
            { DictName: '销售单', DictId: DataDictionary.SalesTypeA },
            { DictName: '销售退货单', DictId: DataDictionary.SalesTypeB },
        ];
    }
    // 订药类型
    getOrderingType() {
        return [
            { name: '治疗', value: 1 },
            { name: '免疫保健', value: 2 },
            { name: '程序引用', value: 3 },
        ];
    }
    // 过磅状态
    getWeighType() {
        return [
            { name: '全部', value: '' },
            { name: '进行中', value: '1' },
            { name: '已完成', value: '2' },
            { name: '已结算', value: '3' },
            { name: '作废', value: '0' }
        ];
    }
    //养殖场类型
    getFarmType() {
        return [
            { name: '养殖户自建场', value: '201704130105242112' },
            { name: '养殖户租赁场', value: '201704130105242113' },
            { name: '公司养殖基地', value: '201704130105242114' },
            { name: '小区养殖模式', value: '201704130105242115' }
        ];
    }
    //养户设置角色
    getRoleSourceType() {
        return [
            { name: '技术员', value: '2212141714430000150' },
            { name: '经理', value: '2212141714430000250' },
            { name: '其他', value: '2212141714430000350' }
        ];
    }
    //蛋品加工单摘要
    getWarehouseStockType() {
        return [
            { name: '蛋加工', value: '1912061740540000102' },
            { name: '雏加工', value: '2210270959320000150' },
            { name: '换装生产', value: '1910231121390000102' },
            { name: '其他加工', value: '2210291110480000150' }
        ];
    }
    /**
     * 获取摘要类型
     */
    getCollectTypeAbstractSource() {
            return [
                { AbstractText: '蛋加工', Abstract: '1912061740540000102' },
                { AbstractText: '雏加工', Abstract: '2210270959320000150' },
                { AbstractText: '其他加工', Abstract: '2210291110480000150' },
            ];
    }
    /**
     * 获取归集类型- 禽生产费用
     */
     getCollectTypeSourceTypeA() {
        return [
            { name: ProjectTypeInfo.ChickenFarmText, value: ProjectTypeInfo.ChickenFarm },
            { name: ProjectTypeInfo.HenHouseText, value: ProjectTypeInfo.HenHouse },
            { name: ProjectTypeInfo.BatchNumberText, value: ProjectTypeInfo.BatchNumber },
        ];
    }
    /**
     * 获取归集类型- 孵化生产费用
     */
     getCollectTypeSourceTypeB() {
        return [
            { name: ProjectTypeInfo.HatcherFarmText, value: ProjectTypeInfo.HatcherFarm },
        ];
    }
    /**
     * 获取归集类型- 蛋加工费用
     */
      getCollectTypeSourceTypeC() {
            return [
                { name: ProjectTypeInfo.AbstractText, value: ProjectTypeInfo.Abstract },
            ];
    }
    /**
     * 总归集类型
     * @returns
     */
    getCollectTypeSourceTypeTotal() {
        return [
            { name: ProjectTypeInfo.ChickenFarmText, value: ProjectTypeInfo.ChickenFarm },
            { name: ProjectTypeInfo.HenHouseText, value: ProjectTypeInfo.HenHouse },
            { name: ProjectTypeInfo.BatchNumberText, value: ProjectTypeInfo.BatchNumber },
            { name: ProjectTypeInfo.HatcherFarmText, value: ProjectTypeInfo.HatcherFarm },
            { name: ProjectTypeInfo.AbstractText, value: ProjectTypeInfo.Abstract },
        ];
    }
    /**
     * 获取费用类型
     */
     getCostTypeSource() {
        return [
            { name: ProjectTypeInfo.ProjectTypeAText, value: ProjectTypeInfo.ProjectTypeA },
            { name: ProjectTypeInfo.ProjectTypeBText, value: ProjectTypeInfo.ProjectTypeB },
            { name: ProjectTypeInfo.ProjectTypeCText, value: ProjectTypeInfo.ProjectTypeC },
        ];
    }

    /**
     * 获取单据类型
     */
     getBillTypeSource() {
        return [
            { name: '免疫', value: '2201131629250001655' },
            { name: '用药', value: '2201131629250001755' },
            { name: '栋舍消毒', value: '2201131629250001855' },
            // { name: '空舍消毒', value: '2201131629250001955' },
            { name: '鸡场消毒', value: '2201131629250002055' },
        ];
    }
    /**
     * 获取所有方式
     */
     getOperationSource() {
        return [
            { name: '饮水', value: '201804101052151101' },
            { name: '拌料', value: '201804101052151102' },
            { name: '注射', value: '201804101052151103' },
            { name: '喷雾', value: '201804101052151104' },
            { name: '浸泡', value: '201804101052151105' },
            { name: '注射', value: '201711231051151101' },
            { name: '饮水', value: '201711231051151102' },
            { name: '滴鼻点眼', value: '201711231051151103' },
            { name: '刺种', value: '201711231051151104' },
            { name: '气雾', value: '201711231051151105' },
            { name: '滴口', value: '201711231051151106' },
            { name: '其他', value: '201711231051151107' },
            { name: '喷雾', value: '201711231003151101' },
            { name: '浸泡', value: '201711231003151102' },
            { name: '熏蒸', value: '201711231003151103' },
            { name: '冲洗', value: '201711231003151104' },
        ];
    }
    /**
     * 获取用药方式
     */
     getDrugsWaySource() {
        return [
            { name: '饮水', value: '201804101052151101' },
            { name: '拌料', value: '201804101052151102' },
            { name: '注射', value: '201804101052151103' },
            { name: '喷雾', value: '201804101052151104' },
            { name: '浸泡', value: '201804101052151105' },
        ];
    }
    /**
     * 获取免疫方式
     */
     getImmuneTypeSource() {
        return [
            { name: '注射', value: '201711231051151101' },
            { name: '饮水', value: '201711231051151102' },
            { name: '滴鼻点眼', value: '201711231051151103' },
            { name: '刺种', value: '201711231051151104' },
            { name: '气雾', value: '201711231051151105' },
            { name: '滴口', value: '201711231051151106' },
            { name: '其他', value: '201711231051151107' },
        ];
    }
    /**
     * 获取消毒方式
     */
     getSterilizeMethodSource() {
        return [
            { name: '喷雾', value: '201711231003151101' },
            { name: '浸泡', value: '201711231003151102' },
            { name: '熏蒸', value: '201711231003151103' },
            { name: '冲洗', value: '201711231003151104' },
        ];
    }
    /**
     * 获取公母数据源
     */
     getSexTypeDataSource() {
        return [
            { DictName: '公', DictId: '201711171453531101' },
            { DictName: '母', DictId: '201711171453531102' },
            { DictName: ' ', DictId: '' },
        ];
    }
    /**
     * 获取批次类型下拉数据源
     */
     getBatchTypeValueDataSource() {
        return [
            { name: '引种', value: '2201052034580000155' },
            { name: '换羽', value: '2201052034580000255' },
        ];
    }
    /**
     * 阶段设置下拉数据源
     */
     getLifePeriodTypeDataSource() {
        return [
            { name: '育雏期', value: '2210261354270000150' },
            { name: '育成期', value: '2210261354270000250' },
            { name: '产蛋期', value: '2210261354270000350' },
        ];
    }
    /**
     * 获取预计残值方式下拉数据源
     */
     getSalvageValueDataSource() {
        return [
            { name: '预计净残值率%', value: '2110271346420000212' },
            { name: '只预计净残值', value: '2110271346300000112' },
        ];
    }
    /**
     * 获取创建方式下拉数据源
     */
     getCreateWayDataSource() {
        return [
            { name: '手工录入', value: '2111021455230000117' },
            { name: '系统生成', value: '2111021455450000117' }
        ];
    }
    /**
     * 获取销售状态下拉数据源
     */
    getSalesStatusDataSource() {
        return [
            { name: '未提交', value: false },
            { name: '已提交', value: true },
        ];
    }
    /**
     * 获取照蛋落盘状态下拉数据源
     */
    getEggTesterTrayStatusDataSource() {
        return [
            { name: '未提交', value: 1 },
            { name: '已提交', value: 2 },
        ];
    }

    /**
     * 获取照蛋种类
     */
    getEggSpeciesSource(){
        return [
            { label: '日常照蛋', value: '2207041335590000355' },
            { label: '期初照蛋', value: '2207041335590000455' },
        ];
    }

    /**
     * 获取照蛋来源
     */
     getEggSource(){
        return [
            { label: '种蛋入孵', value: '2207041335590000155' },
            { label: '入孵期初', value: '2207041335590000255' },
        ];
    }
    /**
     * 获取蛋品调拨状态下拉数据源
     */
     getEggsTransferStatusDataSource() {
        return [
            { name: '待调入确认', value: false },
            { name: '已调入确认', value: true },
        ];
    }
    /**
     * 获取蛋品调拨状态下拉数据源
     */
    getEggsIsShiftTrayDataSource() {
        return [
            { name: '是', value: true },
            { name: '否', value: false },
        ];
    }

    getChickenFarmTypeDataSource() {
        return [
            { name: '育雏育成种鸡场', value: DataDictionary.FarmTypeA1 },
            { name: '产蛋种鸡场', value: DataDictionary.FarmTypeA2 },
            { name: '综合种禽孵化场', value: DataDictionary.FarmTypeA3 },
            { name: '祖代种禽孵化厂', value: DataDictionary.FarmTypeB1 },
            { name: '父母代种禽孵化厂', value: DataDictionary.FarmTypeB2 },
            { name: '综合种禽孵化厂', value: DataDictionary.FarmTypeB3 },
        ];
    }
     /**
     * 获取照蛋类型下拉数据有
     */
      getEggTesterTypeDataSource() {
        return [
            { EggTesterTypeName: TranslateI18N.I18N.ZqEggTesterSetting.EggTesterType.EggTesterTypeA, EggTesterType: DataDictionary.EggTesterTypeA },
            { EggTesterTypeName: TranslateI18N.I18N.ZqEggTesterSetting.EggTesterType.EggTesterTypeB, EggTesterType: DataDictionary.EggTesterTypeB },
            { EggTesterTypeName: TranslateI18N.I18N.ZqEggTesterSetting.EggTesterType.EggTesterTypeC, EggTesterType: DataDictionary.EggTesterTypeC },
        ];
    }
     /**
     * 获取拣后类别下拉数据源
     */
    getSortingEggTypeDataSource() {
        return [
            { SortingEggTypeName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggType.SortingEggTypeA, SortingEggType: DataDictionary.SortingEggTypeA },
            { SortingEggTypeName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggType.SortingEggTypeB, SortingEggType: DataDictionary.SortingEggTypeB },
            { SortingEggTypeName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggType.SortingEggTypeC, SortingEggType: DataDictionary.SortingEggTypeC },
            { SortingEggTypeName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggType.SortingEggTypeD, SortingEggType: DataDictionary.SortingEggTypeD },
            { SortingEggTypeName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggType.SortingEggTypeE, SortingEggType: DataDictionary.SortingEggTypeE },
        ];
    }
    /**
     * 获取蛋名称下拉数据源
     */
    getSortingEggIDDataSource() {
        return [
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDA, SortingEggID: DataDictionary.SortingEggIDA },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDB, SortingEggID: DataDictionary.SortingEggIDB },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDC, SortingEggID: DataDictionary.SortingEggIDC },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDD, SortingEggID: DataDictionary.SortingEggIDD },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDE, SortingEggID: DataDictionary.SortingEggIDE },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDF, SortingEggID: DataDictionary.SortingEggIDF },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDG, SortingEggID: DataDictionary.SortingEggIDG },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDH, SortingEggID: DataDictionary.SortingEggIDH },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDI, SortingEggID: DataDictionary.SortingEggIDI },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDJ, SortingEggID: DataDictionary.SortingEggIDJ },
            { SortingEggName: TranslateI18N.I18N.ZqSortingEggsSetting.SortingEggID.SortingEggIDK, SortingEggID: DataDictionary.SortingEggIDK },
        ];
    }
    /**
     *
     * 获取销售摘要下拉数据源
     */
    getSalesAbstractDataSource() {
        return [
            { DictName: '销售转出', DictId: DataDictionary.SalesAbstractA },
            { DictName: '内销转出', DictId: DataDictionary.SalesAbstractB },
        ];
    }
    /**
     *
     * 收支类型下拉数据源
     */
     getAccountTypeDataSource() {
        return [
            { DictName: '收取', DictId: '2201131702170001555' },
            { DictName: '转入', DictId: '2201131702170000655' },
            { DictName: '退还', DictId: '2201131702170001655' },
            { DictName: '期初余额', DictId: '2201131702170001755' },
        ];
    }
    /**
     *
     * 收支类型下拉数据源
     */
     getAccountTypeUnDataSource() {
        return [
            { DictName: '收取', DictId: '2201131702170001555' },
            { DictName: '退还', DictId: '2201131702170001655' },
            { DictName: '期初余额', DictId: '2201131702170001755' },
        ];
    }
    /**
     *
     * 关联单据下拉数据源
     */
     getQuoteBillTypeDataSource() {
        return [
            { DictName: '收款单', DictId: '2201131629250003655' },
            { DictName: '付款单', DictId: '2201131629250003755' },
            { DictName: '批次结算单', DictId: '2201131629250003855' },
        ];
    }
    /**
     *
     * 关联单据下拉数据源
     */
     getQuoteBillTypeUnDataSource() {
        return [
            { DictName: '收款单', DictId: '2201131629250003655' },
            { DictName: '付款单', DictId: '2201131629250003755' },
        ];
    }
    /**
     *
     * 获取栋舍类型下拉数据源
     */
    getHenhouseTypeDataSource() {
        return [
            { DictName: '育雏舍', DictId: DataDictionary.PhaseTypeA },
            { DictName: '育成舍', DictId: DataDictionary.PhaseTypeB },
            { DictName: '育雏育成舍', DictId: DataDictionary.PhaseTypeC },
            { DictName: '产蛋舍', DictId: DataDictionary.PhaseTypeD },
            { DictName: '一体舍', DictId: DataDictionary.PhaseTypeE },
            { DictName: '淘汰舍', DictId: DataDictionary.PhaseTypeF },
        ];
    }
    /**
     * 获取胚蛋类别下拉数据源
     */
    getEmbryoEggTypeDataSource() {
        return [
            { EmbryoEggTypeName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggType.EmbryoEggTypeA, EmbryoEggType: DataDictionary.EmbryoEggTypeA },
            { EmbryoEggTypeName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggType.EmbryoEggTypeB, EmbryoEggType: DataDictionary.EmbryoEggTypeB },
            { EmbryoEggTypeName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggType.EmbryoEggTypeC, EmbryoEggType: DataDictionary.EmbryoEggTypeC },
        ];
    }
    /**
     * 获取胚蛋名称下拉数据源
     */
     getEmbryoEggIDDataSource() {
        return [
            { EmbryoEggName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggID.EmbryoEggIDA, EmbryoEggID: DataDictionary.EmbryoEggIDA },
            { EmbryoEggName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggID.EmbryoEggIDB, EmbryoEggID: DataDictionary.EmbryoEggIDB },
            { EmbryoEggName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggID.EmbryoEggIDC, EmbryoEggID: DataDictionary.EmbryoEggIDC },
            { EmbryoEggName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggID.EmbryoEggIDD, EmbryoEggID: DataDictionary.EmbryoEggIDD },
            { EmbryoEggName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggID.EmbryoEggIDE, EmbryoEggID: DataDictionary.EmbryoEggIDE },
            { EmbryoEggName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggID.EmbryoEggIDF, EmbryoEggID: DataDictionary.EmbryoEggIDF },
            { EmbryoEggName: TranslateI18N.I18N.ZqEggTesterTraySetting.EmbryoEggID.EmbryoEggIDG, EmbryoEggID: DataDictionary.EmbryoEggIDG },
        ];
    }

    /**
     * 获取种蛋产蛋类别下拉数据源
     */
     getLayEggTypeDataSource() {
        return [
            { LayEggTypeName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggType.LayEggTypeA, LayEggType: DataDictionary.LayEggTypeA },
            { LayEggTypeName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggType.LayEggTypeB, LayEggType: DataDictionary.LayEggTypeB },
            { LayEggTypeName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggType.LayEggTypeC, LayEggType: DataDictionary.LayEggTypeC },
        ];
    }
    /**
     * 获取蛋名称下拉数据源
     */
    getLayEggIDDataSource() {
        return [
            { LayEggName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggID.LayEggIDA, LayEggID: DataDictionary.LayEggIDA },
            { LayEggName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggID.LayEggIDB, LayEggID: DataDictionary.LayEggIDB },
            { LayEggName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggID.LayEggIDC, LayEggID: DataDictionary.LayEggIDC },
            { LayEggName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggID.LayEggIDD, LayEggID: DataDictionary.LayEggIDD },
            { LayEggName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggID.LayEggIDE, LayEggID: DataDictionary.LayEggIDE },
            { LayEggName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggID.LayEggIDF, LayEggID: DataDictionary.LayEggIDF },
            { LayEggName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggID.LayEggIDG, LayEggID: DataDictionary.LayEggIDG },
            { LayEggName: TranslateI18N.I18N.ZqLayEggsSetting.LayEggID.LayEggIDH, LayEggID: DataDictionary.LayEggIDH },
        ];
    }
      /**
     * 获取是否下拉数据源
     */
    getStatusDataSource() {
        return [
            { name: '是', value: 2 },
            { name: '否', value: 1 },
        ];
    }
    /**
     * 获取完成状态下拉数据源
     */
    getFinishStatusDataSource() {
        return [
            //未完成
            { name: TranslateI18N.I18N.status.finishStatus.incomplete, taskStatus: 0 },
            //已完成
            { name: TranslateI18N.I18N.status.finishStatus.completed, taskStatus: 1 },
        ];
    }
}
