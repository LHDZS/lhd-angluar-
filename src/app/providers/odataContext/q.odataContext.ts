import { Injectable } from '@angular/core';
import ODataContext from 'devextreme/data/odata/context';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from '../../shared/services';
import { ODataContextBase, DataSourceParamters } from './helper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PrintInput } from '../print';
import { USER_INFO_CONTEXT } from '../context';
import { DataDictionary, DataDictionarySource } from '../enums';
@Injectable()
export class BasicSettingODataContext extends ODataContextBase {
    /**
     * 上下文对象
     */
    context: ODataContext;

    /**
     * 系统字典数据
     */
    bizDataDict: ODataStore;

    /**
     * 品系
     */
    bizStrainLine: ODataStore;

    /**
     * 品种
     */
    zqBreedingset: ODataStore;

    /**
     * 类型设置
     */
     bizRemind: ODataStore;
     /**
     * 类型设置
     */
    bizRemindGroup: ODataStore;

    /**
     * 类型设置
     */
    bizRemindEnterprise: ODataStore;

     /**
     * 类型设置
     */
      bizRemindChickenFarm: ODataStore;

    /**
     * 场区
     */
    bizZoning: ODataStore;
    yzcZoning: ODataStore;
    /**
     * 公司种鸡批次
     */
    bizZqbatch: ODataStore;

    /**
     * 集团种鸡批次
     */
    bizZqbatchGroup: ODataStore;

    bizZqbatchDetail: ODataStore;

    /**
     * 商品
     */
    bizProductannexed: ODataStore;
    /**
     * 公司栋舍
     */
    zqHenhouse: ODataStore;
    /**
     * 集团栋舍
     */
    zqHenhouseGroup: ODataStore;
    /**
     * 公司农场
     */
    bizChickenFarm: ODataStore;
    /**
     * 公司有权限农场
     */
    bizChickenFarmAuthorized: ODataStore;
    /**
     * 集团农场
    */
    bizGroupFarm: ODataStore;

    /**
     * 出雏机
     */
    bizHatcher: ODataStore;

    /**
     * 孵化机
     */
    bizIncubator: ODataStore;

    /**
    * 孵化批次
    */
    bizHatchBatch: ODataStore;

    /**
    * 照蛋类型
    */
    bizEggTesterSetting: ODataStore;

    /**
    * 免疫项目
    */
    immuneSubjectList: ODataStore;

    /**
    * 有权限仓库数据
    */
    warehouseODataStore: ODataStore;
    /**
    * 所有模板数据
    */
    rptcolumnmatrixDataStore: ODataStore;
    /**
    * 产蛋对照类型
    */
    layEggCategory: ODataStore;

    /**
    * 分拣对照类型
    */
    SortingEggsSetting: ODataStore;

    /**
    * 批号项
    */
    BatchSubject: ODataStore;

    /**
    * 批号规则
    */
    zqBatchRuleList: ODataStore;

    /**
     * 商品列表
     */
    Product: ODataStore;

    /**
     * 存货类型
     */
    StockType: ODataStore;

    /**
     * 商品品类
     */
    Classification: ODataStore;

    /**
     * 疾病
     */
    bizDisease: ODataStore;

    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();
        this.context = new ODataContext({
            url: this.poultryBasicSettingOdataUrl,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[BasicSettingODataContext] Get BasicSettingODataContext throw exception.');
            },
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
            entities: {
                GetStockType: {
                    key: 'StockType',
                    keyType: 'String'
                },
                GetClassification: {
                    key: 'ClassificationID',
                    keyType: 'String'
                },
                GetProduct: {
                    key: 'ProductID',
                    keyType: 'String'
                },
                BizDataDict: {
                    key: 'DictId',
                    keyType: 'String',
                },
                BizStrainLine: {
                    key: 'StrainLineID',
                    keyType: 'String',
                },
                ZqBreedingset: {
                    key: 'BreedingID',
                },
                BizRemind: {
                    key: 'RemindID',
                },
                BizRemindGroup: {
                    key: 'RemindID',
                },
                BizRemindEnterprise: {
                    key: 'RemindID',
                },
                BizRemindChickenFarm: {
                    key: 'RemindID',
                },
                BizZoning: {
                    key: 'ZoningID',
                    keyType: 'String',
                },
                YzcZoning: {
                    key: 'ZoningID',
                    keyType: 'String',
                },
                BizZqbatch: {
                    key: 'BatchID',
                    keyType: 'String',
                },
                BizZqbatchDetail: {
                    key: 'BatchID',
                    keyType: 'String',
                },
                BizProductannexed: {
                    key: 'ProductID',
                },
                ZqHenhouse: {
                    key: 'HenHouseID',
                    keyType: 'String',
                },
                BizChickenFarm: {
                    key: 'ChickenFarmID',
                    keyType: 'String',
                },
                BizChickenFarmAuthorized: {
                    key: 'ChickenFarmID',
                    keyType: 'String',
                },
                ZqHatcher: {
                    key: 'HatcherID',
                    keyType: 'String',
                },
                ZqIncubator: {
                    key: 'IncubatorID',
                    keyType: 'String',
                },
                ZqHatchBatch: {
                    key: 'BatchID',
                    keyType: 'String',
                },
                OptEggTesterSetting: {
                    key: 'EggTesterType',
                    keyType: 'String',
                },
                ImmuneSubjectList: {
                    key: 'ImmuneSubjectID',
                    keyType: 'String',
                },
                GetPowerWarehouse: {
                    key: 'WarehouseID',
                    keyType: 'String',
                },
                ZqRptColumnMatrix: {
                    key: 'RptID',
                    keyType: 'String',
                },
                ZqLayEggsSettingCategory: {
                    key: 'NumericalOrder',
                    keyType: 'String',
                },
                ZqSortingEggsSettingCategoryList: {
                    key: 'SrcProductID',
                    keyType: 'String',
                    beforeSend:(e) => {
                        e.params['ComboPack'] =  "2201052035160000155"
                    },
                },
                ZqBatchSubject: {
                    key: 'BatchSubjectID',
                    keyType: 'String',
                },
                ZqBatchRuleList: {
                    key: 'BatchRuleID',
                    keyType: 'String',
                },
                BizChickenFarmGroup: {
                    key: 'ChickenFarmID',
                    keyType: 'String',
                },
                ZqHenhouseGroup: {
                    key: 'HenHouseID',
                    keyType: 'String',
                },
                BizZqbatchGroup: {
                    key: 'BatchID',
                    keyType: 'String',
                },
                BizDisease: {
                    key: 'DiseaseID',
                    keyType: 'String',
                },
            },
        });
        this.StockType = this.context['GetStockType'];
        this.Classification = this.context['GetClassification'];
        this.Product = this.context['GetProduct'];
        this.bizDataDict = this.context['BizDataDict'];
        this.bizStrainLine = this.context['BizStrainLine'];
        this.zqBreedingset = this.context['ZqBreedingset'];
        this.bizZoning = this.context['BizZoning'];
        this.yzcZoning = this.context['YzcZoning'];
        this.bizZqbatch = this.context['BizZqbatch'];
        this.bizProductannexed = this.context['BizProductannexed'];
        this.zqHenhouse = this.context['ZqHenhouse'];
        this.bizChickenFarm = this.context['BizChickenFarm'];
        this.bizZqbatchDetail = this.context['BizZqbatchDetail'];
        this.bizHatcher = this.context['ZqHatcher'];
        this.bizIncubator = this.context['ZqIncubator'];
        this.bizHatchBatch = this.context['ZqHatchBatch'];
        this.bizEggTesterSetting = this.context['OptEggTesterSetting'];
        this.immuneSubjectList = this.context['ImmuneSubjectList'];
        this.warehouseODataStore = this.context['GetPowerWarehouse'];
        this.rptcolumnmatrixDataStore = this.context['ZqRptColumnMatrix'];
        this.layEggCategory = this.context['ZqLayEggsSettingCategory'];
        this.SortingEggsSetting = this.context['ZqSortingEggsSettingCategoryList'];
        this.BatchSubject = this.context['ZqBatchSubject'];
        this.zqBatchRuleList = this.context['ZqBatchRuleList'];
        this.bizGroupFarm = this.context['BizChickenFarmGroup'];
        this.zqHenhouseGroup = this.context['ZqHenhouseGroup'];
        this.bizZqbatchGroup = this.context['BizZqbatchGroup'];
        this.bizChickenFarmAuthorized = this.context['BizChickenFarmAuthorized'];
        this.bizRemind = this.context['BizRemind'];
        this.bizRemindGroup = this.context['BizRemindGroup'];
        this.bizRemindEnterprise = this.context['BizRemindEnterprise'];
        this.bizRemindChickenFarm = this.context['BizRemindChickenFarm'];
        this.bizDisease = this.context['BizDisease'];
    }
    /**
     * 获取存货类型下拉数据源
     * @param dataSourceParams
     */
    getStockTypeDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.StockType, dataSourceParams)
    }

    /**
     * 获取商品品类下拉数据源
     * @param dataSourceParams
     */
    getClassificationDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.Classification, dataSourceParams)
    }

    /**
     * 获取商品下拉数据源
     * @param dataSourceParams
     */
    getProductDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.Product, dataSourceParams)
    }

    /**
     * 获取系统字典数据下拉数据源
     * @param dataSourceParams
     */
    getBizDataDictDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizDataDict, dataSourceParams);
    }

    /**
     * 获取配套系数据源
     * @param dataSourceParams
     */
     getBizStrainLineDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizStrainLine, dataSourceParams);
    }
    /**
     * 获取品种数据源
     * @param dataSourceParams
     */
    getZqBreedingsetDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.zqBreedingset, dataSourceParams);
    }
     /**
     * 获取类型设置数据源
     * @param dataSourceParams
     */
      getBizRemindDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizRemind, dataSourceParams);
    }
    /**
     * 获取集团类型设置数据源
     * @param dataSourceParams
     */
     getBizRemindGroupDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizRemindGroup, dataSourceParams);
    }
     /**
     * 获取单位类型设置数据源
     * @param dataSourceParams
     */
    getBizRemindEnterpriseDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizRemindEnterprise, dataSourceParams);
    }

      /**
     * 获取疾病数据源
     * @param dataSourceParams
     */
       getBizDiseaseDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizDisease, dataSourceParams);
    }

    /**
     * 获取场级类型设置数据源
     * @param dataSourceParams
     */
    getBizRemindChickenFarmDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizRemindChickenFarm, dataSourceParams);
    }
    /**
     * 获取场区数据源
     * @param dataSourceParams
     */
    getBizZoningDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizZoning, dataSourceParams);
    }
    /**
     * 获取养殖场场区数据源
     * @param dataSourceParams
     */
    getYzcZoningDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.yzcZoning, dataSourceParams);
    }
    /**
     * 获取栋舍数据源
     * @param dataSourceParams
     */
    getZqHenhouseDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.zqHenhouse, dataSourceParams);
    }
    /**
     * 获取种鸡批次数据源
     * @param dataSourceParams
     */
     getZqbatchDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizZqbatch, dataSourceParams);
    }
    /**
     * 获取种鸡批次明细数据源
     * @param dataSourceParams
     */
    getZqbatchDetailDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizZqbatchDetail, dataSourceParams);
    }
    /**
     * 获取单位商品数据源
     * @param dataSourceParams
     */
    getBizProductannexedDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizProductannexed, dataSourceParams);
    }

    /**
     * 免疫项目
     * @param dataSourceParams
     */
    getImmuneSubjectDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.immuneSubjectList, dataSourceParams);
    }

    /**
     * 获取种鸡场数据源
     * @param dataSourceParams
     */
    getBizChickenFarmDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizChickenFarm, dataSourceParams);
    }

    /**
     * 获取出雏机数据源
     * @param dataSourceParams
     */
    getBizHatcherDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizHatcher, dataSourceParams);
    }
    /**
     * 获取孵化机数据源
     * @param dataSourceParams
     */
    getBizIncubatorDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizIncubator, dataSourceParams);
    }
    /**
     * 获取孵化批次数据源
     * @param dataSourceParams
     */
    getBizHatchBatchDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizHatchBatch, dataSourceParams);
    }
    /**
     * 获取照蛋类型数据源
     * @param dataSourceParams
     */
    getBizEggTesterSettingDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizEggTesterSetting, dataSourceParams);
    }
    /**
     * 获取辅助单位
     */
    getMeasureUnitExt(Para: any[]) {
        return this.http.get(`${environment.poultryProductionServer}/GetMeasureUnitExt?` + Para).toPromise();
    }

    /**
     * 获取有权限仓库下拉数据源
     */
    getWareHouseDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.warehouseODataStore, dataSourceParams);
    }

    /**
     * 获取所有模板下拉数据源
     */
     getRptColumnMatrixDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.rptcolumnmatrixDataStore, dataSourceParams);
    }

    /**
     * 获取产蛋对照类型
     */
    getLayEggCategoryDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.layEggCategory, dataSourceParams);
    }
    /**
     * 获取分拣对照类型
     */
     getSortingEggsSettingDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.SortingEggsSetting, dataSourceParams);
    }
    /**
     * 获取批号项
     */
    getBatchSubjectDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.BatchSubject, dataSourceParams);
    }
     /**
     * 获取批号规则
     */
    getBatchRuleDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.zqBatchRuleList, dataSourceParams);
    }
    /**
     * 获取集团下鸡场
     */
    getBizChickenFarmGroupDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizGroupFarm, dataSourceParams);
    }

    /**
     * 获取公司下有权限的农场
     */
     getBizChickenFarmAuthorizedDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizChickenFarmAuthorized, dataSourceParams);
    }
    /**
     * 获取集团下栋舍
     */
    getZqHenhouseGroupDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.zqHenhouseGroup, dataSourceParams);
    }
    /**
     * 获取集团下批次
     */
    getZqbatchGroupDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.bizZqbatchGroup, dataSourceParams);
    }
    /**
     * 打印服务
     */
    print(input: PrintInput) {
        var header = {};
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
}

