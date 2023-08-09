import { Injectable } from '@angular/core';
import ODataContext from 'devextreme/data/odata/context';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from '../../shared/services';
import { ODataContextBase, DataSourceParamters } from './helper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PrintInput } from '../print';
import { USER_INFO_CONTEXT } from '../context';
import { DataSourceAccessor } from '../common/DataSourceAccessor';

/**
 * 猪联网基础设置公共下拉数据源
 */
@Injectable()
export class ZlwBasicSettingODataContext extends ODataContextBase {
    /**
     * 上下文对象
     */
    context: ODataContext;
    /**
     * 栋舍信息数据
     */
    bizPigHouseUnit: ODataStore;
    /**
     * 猪批次数据
     */
    bizBatchSet: ODataStore;
    /**
     * 猪批次数据
     */
    bizBatchSetExpand: ODataStore;
    /**
     * 猪批次数据
     */
    bizBatchSetEnterprise: ODataStore;
    /**
     * 根据猪场id获取猪批次数据
     */
    bizBatchSetFarmData: ODataStore;
    /**
     * 系统字典数据
     */
    bizDataDict: ODataStore;
    /**
     * 系统类型设置
     */
    bizTypeSetting: ODataStore;
    /**
     * 猪场数据
     */
    bizPigFarm: ODataStore;
    /**
     * 猪场数据无权限区分
     */
    bizPigFarmNoIdentity: ODataStore;
    /**
     * 猪档案
     */
    bizPigExpand: ODataStore;
    /**
     * 集团下猪档案
     */
    pigInGroupExpand: ODataStore;
    /**
     * 批次耳号
     */
    batchpigexpand: ODataStore;
    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();
        this.context = new ODataContext({
            url: this.zlwBasicSettingOdataUrl,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[ZlwBasicSettingODataContext] Get ZlwBasicSettingODataContext throw exception.');
            },
            beforeSend: (e) => {
                //     e.headers = {
                //         Authorization: this.tokenService.token,
                //     };
            },
            entities: {
                BizPigHouseUnit: {
                    key: 'PigHouseUnitId',
                    keyType: 'String',
                },
                BizBatchSet: {
                    key: 'BatchId',
                    keyType: 'String',
                },
                BizBatchSetExpand: {
                    key: 'BatchId',
                    keyType: 'String',
                },
                BizBatchSetEnterprise: {
                    key: 'BatchId',
                    keyType: 'String',
                },
                BizBatchSetPigFarm: {
                    key: 'BatchId',
                    keyType: 'String',
                },
                BizDataDict: {
                    key: 'DictID',
                    keyType: 'String',
                },
                ZlwBasicTypeSettingOData: {
                    key: 'TypeID',
                    keyType: 'String',
                },
                BizPig: {
                    key: 'PigId',
                    keyType: 'String',
                },
                BizPigExpandSql: {
                    key: 'PigId',
                    keyType: 'String',
                },
                PigInGroupExpand: {
                    key: 'PigId',
                    keyType: 'String',
                },
                BizPigFarm: {
                    key: 'PigFarmId',
                    keyType: 'String',
                },
                BizPigFarmNoIdentity: {
                    key: 'PigFarmId',
                    keyType: 'String',
                },
                BatchPigExpand: {
                    key: 'PigFarmId',
                    keyType: 'String',
                },
                FatBatchCount: {
                    key: 'PigFarmId',
                    keyType: 'String',
                },
                BreedingPigBatch: {
                    key: 'PigFarmId',
                    keyType: 'String',
                },
            },
        });
        this.bizPigHouseUnit = this.context['BizPigHouseUnit'];
        this.bizBatchSet = this.context['BizBatchSet'];
        this.bizBatchSetExpand = this.context['BizBatchSetExpand'];
        this.bizBatchSetEnterprise = this.context['BizBatchSetEnterprise'];
        this.bizBatchSetFarmData = this.context['BizBatchSetPigFarm'];
        this.bizDataDict = this.context['BizDataDict'];
        this.bizTypeSetting = this.context['ZlwBasicTypeSettingOData'];
        this.bizPigFarm = this.context['BizPigFarm'];
        this.bizPigFarmNoIdentity = this.context['BizPigFarmNoIdentity'];
        this.bizPigExpand = this.context['BizPigExpandSql'];
        this.pigInGroupExpand = this.context["PigInGroupExpand"];
        this.batchpigexpand = this.context['BatchPigExpand'];
    }
    /**
     *  获取栋舍信息下拉数据源
     * @param dataSourceParams
     */
    getBizPigHouseUnitDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizPigHouseUnit, dataSourceParams);
    }
    /**
     * 获取猪批次信息下拉数据源
     * @param dataSourceParams
     */
    getBizBatchSetDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizBatchSet, dataSourceParams);
    }
    /**
     * 获取猪批次信息下拉数据源
     * @param dataSourceParams
     */
    getBizBatchSetExpandDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizBatchSetExpand, dataSourceParams);
    }
    /**
     * 获取猪批次信息下拉数据源
     * @param dataSourceParams
     */
    getBizBatchSetEnterpriseDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizBatchSetEnterprise, dataSourceParams);
    }
    /**
     * 根据猪场获取猪批次信息下拉数据源
     * @param dataSourceParams
     */
    getBizBatchSetPigFarmDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizBatchSetFarmData, dataSourceParams);
    }
    /**
     * 获取系统字典数据下拉数据源
     * @param dataSourceParams
     */
    getBizDataDictDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizDataDict, dataSourceParams);
    }
    /**
     * 获取系统基础类型设置下拉数据源
     * @param dataSourceParams
     */
    getBasicTypeSettingDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizTypeSetting, dataSourceParams);
    }
    /**
     * 获死亡原因信息下拉数据源
     * @param filter
     * @param select
     * @param expand
     * @param pageSize
     */
    getDeathCauseDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizDataDict, dataSourceParams);
    }
    /**
     * 获淘汰原因信息下拉数据源
     * @param dataSourceParams
     */
    getKnockOutCauseDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizDataDict, dataSourceParams);
    }
    /**
     * 根据猪只类型获免疫类型信息下拉数据源
     * @param dataSourceParams
     */
    getImmuneType(id: string, dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        const store: ODataStore = new ODataStore({
            url: `${environment.zlwBasicSettingServer}/oq/ImmuneType('${id}')`,
            key: '',
            keyType: 'String',
            version: this.version,
            beforeSend: (e) => {
                //     e.headers = {
                //         Authorization: this.tokenService.token,
                //     };
            },
        });
        return this.helper.getDataSource(store, dataSourceParams);
    }
    /**
     * 获取猪档案数据源（新）
     * @param dataSourceParams
     */
    getBizPigExpandDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizPigExpand, dataSourceParams);
    }
    /**
     * 获取猪档案数据源（新）
     * @param dataSourceParams
     */
    getPigInGroupExpandDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.pigInGroupExpand, dataSourceParams);
    }
    /**
     * 获取品种数据源
     */
    getVarietiesDataSource(): Promise<any> {
        return this.http
            .get(`${environment.zlwBasicSettingServer}/api/ZlwBasicTypeSetting/get?typeid=202003161028311001`)
            .toPromise();
    }
    /**
     * 获取品系数据源
     */
    getStrainDataSource(): Promise<any> {
        return this.http
            .get(`${environment.zlwBasicSettingServer}/api/ZlwBasicTypeSetting/get?typeid=202003161028311006`)
            .toPromise();
    }


    /**
     * 获取品种数据源包含自定义
     */
    getVarietiesSource(): Promise<any> {
        return this.http
            .get(`${environment.zlwBasicSettingServer}/oq/ZlwBasicTypeSettingOData/get?key=202003161028311001`)
            .toPromise();
    }
    /**
     * 获取品系数据源包含自定义
     */
    getStrainSource(): Promise<any> {
        return this.http
            .get(`${environment.zlwBasicSettingServer}/oq/ZlwBasicTypeSettingOData/get?key=202003161028311006`)
            .toPromise();
    }


    /**
     * 获取猪场数据源
     * @param dataSourceParams
     */
    getBizPigFarmDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizPigFarm, dataSourceParams);
    }
    /**
     * 获取猪场数据源 无权限区分
     * @param dataSourceParams
     */
    getBizPigFarmNoIdentityDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizPigFarmNoIdentity, dataSourceParams);
    }
    /**
     * 获取建账日期
     */
    getPigFarmBeginDate() {
        return this.bizPigFarm.byKey(USER_INFO_CONTEXT.childId, { select: ['Begindate'] });
    }
    /**
     * 获取猪批次耳号
     * @param dataSourceParams
     */
    getbatchpigexpandDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.batchpigexpand, dataSourceParams);
    }
    /**
     * 获取猪场设置仓库
     * @param dataSourceParams
     * @param group
     */
    getpigfarmsettingWarehouse(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        const store = new ODataStore({
            url: `${environment.zlwBasicSettingServer}/oq/BizPigFarmquery`,
            key: 'PigFarmId',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => { },
        });
        return this.helper.getDataSource(store, dataSourceParams);
    }
    /**
     * 获取仓库（经过后台过滤仓库权限后的仓库数据）
     * @param dataSourceParams
     */
    getWareHouseExpand(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        const store = new ODataStore({
            url: `${environment.zlwBasicSettingServer}/oq/WarehouseExpand`,
            version: 4,
            beforeSend: (e) => { },
        });
        return this.helper.getDataSource(store, dataSourceParams);
    }

    /**
     * 打印服务
     */
    print(input: PrintInput) {
        var header = {};
        input.appType = 1;
        var result = this.http
            .post(`${environment.zlwPrintService}/api/print/pdf`, input, { headers: header, responseType: 'blob' })
            .toPromise()
            .then(function (res: any) {
                // .log(res);
                let url = window.URL.createObjectURL(res);
                window.open(url);
                // 创建a标签
                // let a = document.createElement('a')
                // a.style.display = 'none'
                // a.href = url
                // a.setAttribute('download', '分婉计划')
                // document.body.appendChild(a)
                // a.click();
                // a.remove();
            })
            .catch((reason) => {
                console.error('[PrintService] Failed.');
                console.error(reason);
            });
        // return this.http.post('https://localhost:44371/api/Print/pdf',data).toPromise();
    }

    /**
     * 没有头部信息以及附加信息的打印
     */
    getPrint(input: PrintInput) {
        var header = {};
        var result = this.http
            .post(`${environment.zlwPrintService}/api/print/GetPrint`, input, { headers: header, responseType: 'blob' })
            .toPromise()
            .then(function (res: any) {
                // .log(res);
                let url = window.URL.createObjectURL(res);
                window.open(url);
                // 创建a标签
                // let a = document.createElement('a')
                // a.style.display = 'none'
                // a.href = url
                // a.setAttribute('download', '分婉计划')
                // document.body.appendChild(a)
                // a.click();
                // a.remove();
            })
            .catch((reason) => {
                console.error('[PrintService] Failed.');
                console.error(reason);
            });
        // return this.http.post('https://localhost:44371/api/Print/pdf',data).toPromise();
    }
}

/**
 * 猪联网生产公共下拉数据源
 */
@Injectable()
export class ZlwProductionODataContext extends ODataContextBase {
    private context: ODataContext;
    /**
     * 栏位数据
     */
    bizPigField: ODataStore;
    /**
     * 公母猪有猪的批次
     */
    breedingPigBatch: ODataStore;
    /**
     * 母猪生产历史
     */
    pigProductionCycleExpand: ODataStore;
    /**
     * 肥猪有猪的批次
     */
    fatBatchCount: ODataStore;
    /** 母猪期初数据 */
    sowInitial: ODataStore;
    /** 公猪期初数据 */
    boarInitial: ODataStore;
    /** 肥猪期初数据 */
    fatInitial: ODataStore;
    /** 期初存栏成本 耳号/批次 */
    pigUnitEar: ODataStore;
    /** 公猪淘汰耳号下拉 */
    boarPigExpand: ODataStore;
    constructor(private tokenService: TokenAuthService) {
        super();
        this.context = new ODataContext({
            url: this.zlwProductReadODataUrl,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[ZlwProductionODataContext] Get ZlwProductionODataContext throw exception.');
            },
            beforeSend: (e) => {
                //     e.headers = {
                //         Authorization: this.tokenService.token,
                //     };
            },
            entities: {
                BizPigField: {
                    key: 'PigHouseUnitId',
                    keyType: 'String',
                },
                BreedingPigBatch: {
                    key: 'BatchId',
                    keyType: 'String',
                },
                PigProductionCycleExpand: {
                    key: 'ProductionId',
                    keyType: 'String',
                },
                FatBatchCount: {
                    key: 'BatchId',
                    keyType: 'String',
                },
                SowInitial: {
                    key: '',
                    keyType: 'Int64',
                },
                BoarInitial: {
                    key: '',
                    keyType: 'Int64',
                },
                FatInitial: {
                    key: '',
                    keyType: 'Int64',
                },
                PigUnitEarQuery: {
                    key: 'PigId',
                    keyType: 'String',
                },
                BoarPigExpand: {
                    key: 'PigId',
                    keyType: 'String',
                },
            },
        });
        this.bizPigField = this.context['BizPigField'];
        this.breedingPigBatch = this.context['BreedingPigBatch'];
        this.pigProductionCycleExpand = this.context['PigProductionCycleExpand'];
        this.sowInitial = this.context['SowInitial'];
        this.boarInitial = this.context['BoarInitial'];
        this.fatInitial = this.context['FatInitial'];
        this.pigUnitEar = this.context['PigUnitEarQuery'];
        this.boarPigExpand = this.context['BoarPigExpand'];
    }

    /**
     * 获取栏位下拉数据源
     * @param dataSourceParams
     */
    getBizPigFieldDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizPigField, dataSourceParams);
    }
    /**
     * 获取公母猪批次中包含猪的下拉数据源
     * @param dataSourceParams
     */
    getBizBatchSetHasPigDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.breedingPigBatch, dataSourceParams);
    }
    /**
     * 获取母猪生产历史数据源
     * @param dataSourceParams
     */
    getProductionCycleExpandDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.pigProductionCycleExpand, dataSourceParams);
    }
    /**
     * 获取肥猪有猪的批次下拉数据源
     * @param dataDate 单据日期
     * @param dataSourceParams
     */
    getFatBatchCountDataSource(dataDate: string, dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.getFatBatchCountStore(dataDate), dataSourceParams);
    }
    getFatBatchCountStore(dataDate) {
        return new ODataStore({
            url: `${this.zlwProductReadODataUrl}/FatBatchCount`,

            key: 'BatchId',
            keyType: 'String',
            version: this.version,
            beforeSend: (e) => {
                // e.headers = {
                //     Authorization: this.tokenService.token,
                // };;
                const urlTemp = e.url.indexOf('?') > -1 ? e.url.substring(0, e.url.indexOf('?')) : e.url;
                const hasKey = urlTemp.indexOf('(') > -1;
                if (e.url.indexOf('?') > -1) {
                    e.url += `&DataDate=${dataDate}`;
                } else {
                    e.url += `?DataDate=${dataDate}`;
                }
                if (hasKey) {
                    const key = urlTemp.substring(urlTemp.indexOf('(') + 2, urlTemp.indexOf(')') - 1);
                    e.url += `&key=${key}`;
                    e.url = e.url.replace(`('${key}')`, '');
                }
            },
        });
    }

    /**
     * 获取公母猪批次中包含猪的下拉数据源bykey查询
     * @param dataSourceParams
    */
    getBizBatchSetHasPigbyDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.getkeyDataSource(), dataSourceParams);
    }
    getkeyDataSource() {
        return new ODataStore({
            url: `${this.zlwProductReadODataUrl}/BreedingPigBatch`,
            key: 'BatchId',
            keyType: 'String',
            version: this.version,
            beforeSend: (e) => { },
        });
    }

    /**
     * 获取母猪期初数据
     * @param dataSourceParams
     */
    getSowNitialDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.sowInitial, dataSourceParams);
    }
    /**
     * 获取公猪期初数据
     * @param dataSourceParams
     */
    getBoarNitialDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.boarInitial, dataSourceParams);
    }
    /**
     * 获取肥猪期初数据
     * @param dataSourceParams
     */
    getFatInitialDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.fatInitial, dataSourceParams);
    }
    /**
     * 获取公母猪耳号和批次下拉数据
     * @param dataSourceParams
     */
    getPigUnitEarDataSource(dataDate: string, dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        const store: ODataStore = new ODataStore({
            url: `${this.zlwProductReadODataUrl}/PigUnitEarQuery`,
            key: 'PigId',
            keyType: 'String',
            version: this.version,
            beforeSend: (e) => {
                // e.headers = {
                //     Authorization: this.tokenService.token,
                // };;
                const urlTemp = e.url.indexOf('?') > -1 ? e.url.substring(0, e.url.indexOf('?')) : e.url;
                const hasKey = urlTemp.indexOf('(') > -1;
                if (e.url.indexOf('?') > -1) {
                    e.url += `&DataDate=${dataDate}`;
                } else {
                    e.url += `?DataDate=${dataDate}`;
                }
                if (hasKey) {
                    const key = urlTemp.substring(urlTemp.indexOf('(') + 2, urlTemp.indexOf(')') - 1);
                    e.url += `&key=${key}`;
                    e.url = e.url.replace(`('${key}')`, '');
                }
            },
        });
        return this.helper.getDataSource(store, dataSourceParams);

        //return this.helper.getDataSource(this.pigUnitEar, dataSourceParams);
    }
}
/** 猪联网母猪生产下拉数据源 */
@Injectable()
export class ZlwProductionSowODataContext extends ODataContextBase {
    private context: ODataContext;
    /**
     * 母猪生产历史数据
     */
    pigHistoryExpand: ODataStore;
    /**
     * 猪计划耳号下拉数据
     */
    pigExcludePlanExpand: ODataStore;
    constructor(private tokenService: TokenAuthService) {
        super();
        this.context = new ODataContext({
            url: this.zlwProductSowReadODataUrl,
            version: 4,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[ZlwProductionSowODataContext] Get ZlwProductionSowODataContext throw exception.');
            },
            beforeSend: (e) => {
                //     e.headers = {
                //         Authorization: this.tokenService.token,
                //     };
            },
            entities: {
                PigHistoryExpand: {
                    key: ' PigId',
                    keyType: 'String',
                },
                PigExcludePlanExpand: {
                    key: 'PigId',
                    keyType: 'String',
                },
            },
        });
        this.pigHistoryExpand = this.context['PigHistoryExpand'];
        this.pigExcludePlanExpand = this.context['PigExcludePlanExpand'];
    }
    /**
     * 获取母猪生产历史耳号下拉数据源
     * @param dataSourceParams
     */
    getPigHistoryExpandDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.pigHistoryExpand, dataSourceParams);
    }
    /**
     * 获取猪计划耳号下拉公用接口
     */
    getPigExcludePlanExpandDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.pigExcludePlanExpand, dataSourceParams);
    }
    /**
     * 获取栋舍下耳号下拉公共接口
     * @param dataDate 日期
     * @param dataSourceParams
     */
    getPigHouseUnitExpandDataSource(
        dataDate: string,
        dataSourceParams: DataSourceParamters = new DataSourceParamters(),
        hasPig: boolean = false,
        groupBy?: string
    ) {
        return groupBy == ''
            ? this.helper.getDataSource(this.getBizPigHouseUnitExpandStore(dataDate, hasPig), dataSourceParams)
            : this.helper.getDataSource(
                this.getBizPigHouseUnitExpandStore(dataDate, hasPig, groupBy),
                dataSourceParams
            );
    }
    /**
     * 获取栋舍ODataStore
     * @param dataDate
     * @param hasPig
     */
    getBizPigHouseUnitExpandStore(dataDate: string, hasPig: boolean = false, groupBy?: string) {
        return new ODataStore({
            url: `${this.zlwProductSowReadODataUrl}/BizPigHouseUnitExpandWithPig`,
            key: 'PigHouseUnitId',
            keyType: 'String',
            version: this.version,
            beforeSend: (e) => {
                if (e.method === 'get') {
                    e.params['DataDate'] = dataDate;
                    e.params['UseOtherPigFarmId'] = hasPig;
                }
                if (groupBy) {
                    e.url += `?${groupBy}`;
                    const _filter = e.params['$filter'];
                    let _$apply = '';
                    if (_filter) {
                        _$apply = `filter(${_filter})/${groupBy}`;
                    } else {
                        _$apply = groupBy;
                    }
                    delete e.params['$filter'];
                    e.params['$apply'] = _$apply;
                }
                // e.headers = {
                //     Authorization: this.tokenService.token,
                // };;
            },
        });
    }

    /**
     * 根据栋舍类型获取栋舍下拉
     * @param dataDate 日期
     * @param dataSourceParams
     */
    getBizPigHouseUnitExpandWithPigType(
        dataDate: string,
        dataSourceParams: DataSourceParamters = new DataSourceParamters(),
        hasPig: boolean = false
    ) {
        return this.helper.getDataSource(this.BizPigHouseUnitExpandWithPigType(dataDate, hasPig), dataSourceParams);
    }
    /**
     * 获取栋舍ODataStore
     * @param dataDate
     * @param hasPig
     */
    BizPigHouseUnitExpandWithPigType(dataDate: string, hasPig: boolean = false) {
        return new ODataStore({
            url: `${this.zlwProductSowReadODataUrl}/BizPigHouseUnitExpandWithPigType`,
            key: 'PigHouseUnitId',
            keyType: 'String',
            version: this.version,
            beforeSend: (e) => {
                if (e.method === 'get') {
                    e.params['DataDate'] = dataDate;
                    e.params['UseOtherPigFarmId'] = false;
                }
                // e.headers = {
                //     Authorization: this.tokenService.token,
                // };;
            },
        });
    }
    /**
     * 获取全部栋舍下拉公共接口
     * @param dataDate
     * @param dataSourceParams
     */
    getBizPigHouseUnitExpand(
        dataDate: string,
        dataSourceParams: DataSourceParamters = new DataSourceParamters(),
        hasPig: boolean = false
    ) {
        return this.helper.getDataSource(this.BizPigHouseUnitExpand(dataDate, hasPig), dataSourceParams);
    }
    /**
     * 获取栋舍ODataStore
     * @param dataDate
     * @param hasPig
     */
    BizPigHouseUnitExpand(dataDate: string, hasPig: boolean = false) {
        return new ODataStore({
            url: `${this.zlwProductSowReadODataUrl}/BizPigHouseUnitExpand`,
            key: 'PigHouseUnitId',
            keyType: 'String',
            version: this.version,
            beforeSend: (e) => {
                if (e.method === 'get') {
                    e.params['DataDate'] = dataDate;
                    e.params['UseOtherPigFarmId'] = false;
                }
                // e.headers = {
                //     Authorization: this.tokenService.token,
                // };;
            },
        });
    }
}

/**
 * 猪病通网关接口服务
 */
@Injectable()
export class ZbtGatewayContext {
    constructor(private http: HttpClient) { }
    /**
     * 获取症状
     * @param id 疾病ID
     */
    getsymptomataList(id) {
        return this.http.get(`${environment.gatway.symptomata}?open_req_src=nxin_shuju&disease_id=${id}`).toPromise();
    }
}
@Injectable()
export class ZlwBasicSemaningODataContext extends ODataContextBase {
    /**
     * 上下文对象
     */
    context: ODataContext;
    bizBoarPigSemencolletion: ODataStore;
    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();
        this.context = new ODataContext({
            url: this.zlwProductReadODataUrl,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[ZlwBasicSemaningODataContext] Get ZlwBasicSemaningODataContext throw exception.');
            },
            beforeSend: (e) => {
                //     e.headers = {
                //         Authorization: this.tokenService.token,
                //     };
            },
            entities: {
                BoarPigSemencolletion: {
                    key: 'BoarPigId',
                    keyType: 'String',
                },
            },
        });
        this.bizBoarPigSemencolletion = this.context['BoarPigSemencolletion'];
    }
    /**
     * 获取猪档案数据源（新）
     * @param dataSourceParams
     */
    getboarpigsemen(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizBoarPigSemencolletion, dataSourceParams);
    }
}

//获取育种模块
@Injectable()
export class ZlwBreedingODataContext extends ODataContextBase {
    /**
     * 上下文对象
     */
    context: ODataContext;
    bizBoarPigSemencolletion: ODataStore;
    bizBizBackupPigOData: ODataStore;
    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();
        this.context = new ODataContext({
            url: this.zlwBreedingServerODataUrl,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[ZlwBreedingODataContext] Get ZlwBreedingODataContext throw exception.');
            },
            beforeSend: (e) => { },
            entities: {
                BizBackupPigExpandSql: {
                    key: 'PigId',
                    keyType: 'String',
                },
                BizBackupPigOData: {
                    key: 'PigId',
                    keyType: 'String',
                },
            },
        });
        this.bizBoarPigSemencolletion = this.context['BizBackupPigExpandSql'];
        this.bizBizBackupPigOData = this.context['BizBackupPigOData'];
    }
    /**
     * 获取后备档案
     * @param dataSourceParams
     */
    getreservepigsemen(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizBoarPigSemencolletion, dataSourceParams);
    }

    /**
     * 获取后备耳号详情
     * @param dataSourceParams
     */
    getBizBackupPigOData(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizBizBackupPigOData, dataSourceParams);
    }
}

@Injectable()
export class ZlwMaterialsODataContext extends ODataContextBase {
    private context: ODataContext;
    /**
     * 精液批次
     */
    breedingPigBatch: ODataStore;
    constructor(private tokenService: TokenAuthService) {
        super();
        this.context = new ODataContext({
            url: this.zlwMaterialsServerODataUrl,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[ZlwMaterialsODataContext] Get ZlwMaterialsODataContext throw exception.');
            },
            beforeSend: (e) => { },
            entities: {
                SemenBatchSetExpand: {
                    key: 'BatchId',
                    keyType: 'String',
                },
            },
        });
        this.breedingPigBatch = this.context['SemenBatchSetExpand'];
    }
    /**
     * 获取精液批次下拉数据源
     * @param dataSourceParams
     */
    getSemenBatchPigDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.breedingPigBatch, dataSourceParams);
    }
}

//获取精液管理模块
@Injectable()
export class ZlwSemenODataContext extends ODataContextBase {
    /**
     * 上下文对象
     */
    context: ODataContext;
    bizSemenBatchSetOData: ODataStore;
    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();
        this.context = new ODataContext({
            url: this.zlwMaterialsServerODataUrl,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[ZlwMaterialODataContext] Get ZlwMaterialODataContext throw exception.');
            },
            beforeSend: (e) => { },
            entities: {
                SemenBatchSetExpand: {
                    key: 'BatchId',
                    keyType: 'String',
                },
            },
        });
        this.bizSemenBatchSetOData = this.context['SemenBatchSetExpand'];
    }
    /**
     * 获取精液批次
     * @param dataSourceParams
     */
    getSemenBatchSet(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizSemenBatchSetOData, dataSourceParams);
    }
}
