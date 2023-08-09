import { environment } from 'src/environments/environment';
import ODataContext from 'devextreme/data/odata/context';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import { Injectable } from '@angular/core';
import { ODataContextBase, DataSourceParamters } from './helper';
import { HttpClient } from '@angular/common/http';
import DataSource from 'devextreme/data/data_source';
import { OptionTypeEnum } from '../enums';
import { Result } from '../result';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';

/**
 * 企联网公共下拉数据源
 */
@Injectable()
export class QlwODataContext extends ODataContextBase {
    private context: ODataContext;
    /** 人员数据 */
    personODataStore: ODataStore;
    /** 仓库数据 */
    warehouseODataStore: ODataStore;
    /** 核算单元/单据字 */
    bizAccountagencyODataStore: ODataStore;
    /** 字典数据 */
    dictODataStore: ODataStore;
    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();
        this.context = new ODataContext({
            url: `${environment.qlwCommonService}/oq/`,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[QlwODataContext] Get QlwOdataContext throw exception.');
            },
            beforeSend: (e) => {
                //     e.headers = {
                //         Authorization: this.tokenService.token,
                //     };
            },
            entities: {
                Qlw_ProductOData: {
                    key: 'ProductID',
                    keyType: 'String',
                },
                Qlw_PersonOData: {
                    key: 'UserID',
                    keyType: 'String',
                },
                QlW_WarehouseOData: {
                    key: 'WarehouseID',
                    keyType: 'String',
                },
                QlW_BizAccountagencyOData: {
                    key: 'TicketedPointId',
                    keyType: 'String',
                },
                QlW_DictOData: {
                    key: 'DictID',
                    keyType: 'String',
                },
            },
        });
        this.personODataStore = this.context['Qlw_PersonOData'];
        this.warehouseODataStore = this.context['QlW_WarehouseOData'];
        this.bizAccountagencyODataStore = this.context['QlW_BizAccountagencyOData'];
        this.dictODataStore = this.context['QlW_DictOData'];
    }
    /**
     * 获取企联网人员数据源
     * @param dataSourceParams
     */
    getQlWPersonOData(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.personODataStore, dataSourceParams);
    }
    /**
     * 获取省市县级联数据
     * @param parentId 省/市/区 id
     */
    getAreas(parentId) {
        return this.http
            .get(`${environment.qlwCommonService}/api/usercenter/GetAreas?parentId=${parentId}`)
            .toPromise();
    }
    /**
     * 根据区域id获取省市县id
     */
    backsteppingByAreaId(areaId: number): Promise<{ provinceId: number; cityId: number; areaId: number }> {
        return new Promise((resolve, reject) => {
            const dataSource = new DataSource(
                this.helper.getDataSource(
                    new ODataStore({
                        url: `${environment.qlwCommonService}/oq/QLW_AreaOData`,
                        key: 'AreaID',
                        keyType: 'Int64',
                        version: 4,
                    }),
                    { select: ['cAxis'], filter: [['AreaID', '=', areaId]] }
                )
            );
            dataSource
                .load()
                .then((result) => {
                    if (result && result.length > 0) {
                        const data = result[0];
                        const axis = data.cAxis.split('$');
                        resolve({
                            provinceId: parseInt(axis[1]),
                            cityId: parseInt(axis[2]),
                            areaId: parseInt(axis[3]),
                        });
                    }
                })
                .catch((reson) => {
                    console.error(reson);
                    throw new Error('[QlW_AreaOData] Request faild.');
                });
        });
    }
    /**
     * 获取系统选项接口
     */
    getSystemOptions(optionId: string, scopecode = 16) {
        return new Promise<SystemOption>((resolve, reject) => {
            this.http
                .get(`${environment.qlwCommonService}/api/systemoption/get?optionid=${optionId}&scopecode=${scopecode}`)
                .subscribe((res: any) => {
                    if (res.data) {
                        let systemOption = new SystemOption();
                        systemOption.optionValue = res.data.OptionValue;
                        systemOption.optionType = res.data.OptionType;
                        systemOption.optionText = res.data.OptionText;
                        systemOption.isForce = res.data.IsForce;
                        systemOption.pForce = res.data.PForce;
                        systemOption.OptionSwitch = res.data.OptionSwitch;
                        resolve(systemOption);
                    } else {
                        resolve(null);
                    }
                });
        });
    }
    /**
      * 获取是否开通套餐
      *
      */
    getIsOpen(params) {
        if (params instanceof Array) {
            return this.http.get(`${environment.gatway.getopenapp}?enter_id=${USER_INFO_CONTEXT.enterpriseId}&type=201710240104402022&ids=${params.join(',')}`, {
                withCredentials: true

            }).toPromise();
        } else {
            return this.http.get(`${environment.gatway.getopenapp}?enter_id=${USER_INFO_CONTEXT.enterpriseId}&type=201710240104402022&id=${params}`, {
                withCredentials: true

            }).toPromise();
        }
    }
    /**
     * 获取仓库下拉数据源
     */
    getWareHouseDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters(), isUse: boolean = true) {
        if (isUse) {
            if (dataSourceParams.filter) {
                dataSourceParams.filter.push(['IsUse', '=', 1]);
            } else {
                dataSourceParams.filter = ['IsUse', '=', 1];
            }
        }
        return this.helper.getDataSource(this.warehouseODataStore, dataSourceParams);
    }
    //获取单位下所有仓库下拉
    gealltWareHouseDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters(), isUse: boolean = true) {
        return this.helper.getDataSource(this.warehouseODataStore, dataSourceParams);
    }
    /**
     * 获取核算单元/单据字下拉数据源
     */
    getAccountagencyODataDataSource(
        dataSourceParams: DataSourceParamters = new DataSourceParamters(),
        isUse: boolean = true
    ) {
        if (isUse) {
            if (dataSourceParams.filter) {
                dataSourceParams.filter.push(['BUse', '=', 1]);
            } else {
                dataSourceParams.filter = ['BUse', '=', 1];
            }
        }
        return this.helper.getDataSource(this.bizAccountagencyODataStore, dataSourceParams);
    }
    /**
     * 获取类别/摘要下拉数据源
     */
    getDataDictODataDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.dictODataStore, dataSourceParams);
    }
    /**
     * 获取会计科目
     */
    getAccountingSubjectDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.getAccountingSubjectStore(), dataSourceParams);
    }
    /**
     * 获取会计科目ODataStore
     */
    getAccountingSubjectStore() {
        return new ODataStore({
            url: `${environment.qlwCommonService}/oq/QLW_BizAccosubjectOData`,
            key: 'AccoSubjectId',
            keyType: 'String',
            version: this.version,
            beforeSend: (e) => {
                if (e.method === 'get') {
                    e.params['date'] = USER_INFO_CONTEXT.enteDate;
                }
                // e.headers = {
                //     Authorization: this.tokenService.token,
                // };;
            },
        });
    }
    /**
     * 获取结算摘要数据源
     * @param dataSourceParams
     */
    getSettleSummaryDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.getSettleSummaryStore(), dataSourceParams);
    }
    /** 获取结算摘要ODataStore */
    getSettleSummaryStore() {
        return new ODataStore({
            url: `${environment.qlwCommonService}/oq/QLW_BizAccosubjectOData`,
            key: 'SettleSummaryId',
            keyType: 'String',
            version: this.version,
            beforeSend: (e) => {
                e.params['dates'] = USER_INFO_CONTEXT.enteDate;
                // e.headers = {
                //     Authorization: this.tokenService.token,
                // };;
            },
        });
    }
}

export class SystemOption {
    /**
     * 选项值
     */
    optionValue: string;
    /**
     * 选项类型 1文本2单选3复选
     */
    optionType: OptionTypeEnum;
    /**
     * 复选框文本
     */
    optionText: string;
    /**
     * 是否强制
     */
    isForce: number;
    /**
     * 是否被上级强制
     */
    pForce: number;
    /**
     * 是否开启  开启1，关闭0
     */
    OptionSwitch: number;

}
/**
 * 企联网商品下拉
 */
@Injectable()
export class QlwProductContext extends ODataContextBase {
    private context: ODataContext;
    bizProduct: ODataStore;
    systemclassification: ODataStore;
    constructor(private tokenService: TokenAuthService) {
        super();
        this.context = new ODataContext({
            url: `${environment.qlwProductService}/oq`,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[QlwProductContext] Get QlwProductContext throw exception.');
            },
            beforeSend: (e) => {
                //     e.headers = {
                //         Authorization: this.tokenService.token,
                //     };
            },
            entities: {
                BizProduct: {
                    key: 'ProductId',
                    keyType: 'String',
                },
            },
        });
        this.bizProduct = this.context['BizProduct'];
        this.systemclassification = this.context['Systemclassification'];
    }
    /**
     * 获取企联网商品下拉数据眼
     * @param dataSourceParams
     */
    getQlwProductDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters(), isUse: boolean = true) {
        if (isUse) {
            if (dataSourceParams.filter) {
                dataSourceParams.filter.push(['BizProductdetail.IsUse', '=', isUse ? 1 : 0]);
            } else {
                dataSourceParams.filter = [['BizProductdetail.IsUse', '=', isUse ? 1 : 0]];
            }
        }
        return this.helper.getDataSource(this.bizProduct, dataSourceParams);
    }
    /**
     * 获取企联网系统分类数据源
     * @param dataSourceParams
     */
    getQlwSystemclassificationDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.systemclassification, dataSourceParams);
    }
}

/**
 * 审核服务
 */
@Injectable()
export class AuditReviewService {
    constructor(private http: HttpClient) { }
    isReviewed(numericalOrder: string[]) {
        return new Promise((resolve, reject) => {
            this.http
                .post(environment.review.zlwIsReviewed, numericalOrder)
                .toPromise()
                .then((result: Result) => {
                    resolve(result);
                });
        });
    }
}
/**
 * 客户/供应商下拉
 */
@Injectable()
export class QlwCustomerContext extends ODataContextBase {
    private context: ODataContext;
    /** 供应商数据 */
    SupplierBaseInfoOData: ODataStore;
    /** 客户数据 */
    CustomerBaseInfoOData: ODataStore;
    constructor(private tokenService: TokenAuthService) {
        super();
        this.context = new ODataContext({
            url: `${environment.qlwCustomer}/odata`,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[QlwCustomerContext] Get QlwCustomerContext throw exception.');
            },
            beforeSend: (e) => {
            },
            entities: {
                SupplierBaseInfoOData: {
                    key: 'RecordId',
                    keyType: 'Int64',
                },
                CustomerBaseInfoOData: {
                    key: 'CustomerId',
                    keyType: 'String',
                },
            },
        });
        this.SupplierBaseInfoOData = this.context['SupplierBaseInfoOData'];
        this.CustomerBaseInfoOData = this.context['CustomerBaseInfoOData'];
    }
    /**
     * 获取供应商下拉数据源
     * @param dataSourceParams
     * @param group
     */
    getSupplierDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters(), group: boolean = true) {
        const store = new ODataStore({
            url: `${environment.qlwCustomer}/odata/SupplierBaseInfoOData`,
            version: this.version,
            beforeSend: (e) => {
                // if (group) {
                //     e.params['$apply'] = 'groupby((SupplierId,SupplierName))';
                // }
            },
        });
        return this.helper.getDataSource(store, dataSourceParams);
    }
    /**
     * 获取客户下拉数据源
     * @param dataSourceParams
     * @param group
     */
    getCustomerDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters(), group: boolean = true) {
        /**
         * 该条件是查询状态=使用的客户
         */
        if (dataSourceParams.filter) {
            dataSourceParams.filter.push(['IsUse', '=', true]);
        } else {
            dataSourceParams.filter = ['IsUse', '=', true];
        }
        const store = new ODataStore({
            url: `${environment.qlwCustomer}/odata/CustomerBaseInfoOData`,
            version: this.version,
            beforeSend: (e) => {
            },
        });
        return this.helper.getDataSource(store, dataSourceParams);
    }
    /**
    * 根据客户获取业务员和区域等信息
    * @param dataSourceParams
    * @param group
    */
    getPersonMarketDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters(), group: boolean = true) {
        const store = new ODataStore({
            url: `${environment.qlwCustomer}/odata/BizManagementrolebusinessOData`,
            version: this.version,
            beforeSend: (e) => {
            },
        });
        return this.helper.getDataSource(store, dataSourceParams);
    }
    /**
    * 根据客户获取联系人等信息
    * @param dataSourceParams
    * @param group
    */
    getLinkDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters(), group: boolean = true) {
        const store = new ODataStore({
            url: `${environment.qlwCustomer}/odata/CustomerConcatInfomationOData`,
            version: this.version,
            beforeSend: (e) => {
            },
        });
        return this.helper.getDataSource(store, dataSourceParams);
    }
    /**
     * 获取区域下拉数据源
     * @param dataSourceParams
     */
    //部门
    getBizMarketDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        const store = new ODataStore({
            url: `${environment.qlwBizMarket}/oq/BizMarket`,
            version: this.version,
            beforeSend: (e) => {
                e.params['dates'] = USER_INFO_CONTEXT.enteDate;
            },
        });
        return this.helper.getDataSource(store, dataSourceParams);
    }
}
/**
 * 企联网系统服务
 */
@Injectable()
export class QlwSystemContext extends ODataContextBase {
    private context: ODataContext;
    bsAreaODataStore: ODataStore;
    constructor(private tokenService: TokenAuthService) {
        super();
        this.context = new ODataContext({
            url: `${environment.qlwSystemServer}/oq`,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[QlwCustomerContext] Get QlwCustomerContext throw exception.');
            },
            beforeSend: (e) => {
                //     e.headers = {
                //         Authorization: this.tokenService.token,
                //     };
            },
            entities: {
                Bsarea: {
                    key: 'AreaId',
                    keyType: 'String',
                },
            },
        });
        this.bsAreaODataStore = this.context['Bsarea'];
    }
    /**
     * 获取区域数据源
     * @param dataSourceParams
     */
    getArea(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bsAreaODataStore, dataSourceParams);
    }
}

/**
 * 提供权限快捷操作的上下文对象
 */
@Injectable()
export class PermissionContext {
    constructor(private _http: HttpClient, private tokenService: TokenAuthService) { }

    /**
     * 获取实时权限
     * @returns Promise<Result>
     */
    getPermission(): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.tokenService.requestToken().then(d => {
                resolve(this.tokenService.getTokenData.permissions);
            });
        });
    }
}
