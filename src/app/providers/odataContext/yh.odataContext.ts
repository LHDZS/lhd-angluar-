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
export class YHBasicSettingODataContext extends ODataContextBase {
    /**
     * 上下文对象
     */
    context: ODataContext;

    YHFarmer: ODataStore;

    ChickenFarm: ODataStore;

    YHBatch: ODataStore;

    BizProductPoultryManage: ODataStore;

    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();

        this.context = new ODataContext({
            url: `${environment.yhBasicSettingReadServer}` + '/oq',
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[BasicSettingODataContext] Get BasicSettingODataContext throw exception.');
            },
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
                if(e.url.indexOf("YHBatch")>0){
                    e.params['$orderby'] = 'DataDate desc';
                }
            },
            entities: {
                YHFarmerInformation: {
                    key: 'YHFarmerID',
                    keyType: 'String'
                },
                YhChickenFarmRelateList: {
                    key: ['ChickenFarmID', 'ChickenFarmName'],
                    keyType: {
                        ChickenFarmID: 'String',
                        ChickenFarmName: 'String'
                    }
                },
                YHBatch: {
                    key: 'YHBatchID',
                    keyType: 'String'
                },
                BizProductPoultryManage: {
                    key: 'RecordID',
                    keyType: 'String'
                }
            },
        });

        this.YHFarmer = this.context['YHFarmerInformation'];

        this.ChickenFarm = this.context['YhChickenFarmRelateList'];

        this.YHBatch = this.context['YHBatch'];

        this.BizProductPoultryManage = this.context['BizProductPoultryManage'];
    }

    getYHFarmerInfoDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.YHFarmer, dataSourceParams)
    }

    getYHChickenFarmRelateDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.ChickenFarm, dataSourceParams)
    }

    getYHBatchDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.YHBatch, dataSourceParams)
    }

    getProductPoultryDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.BizProductPoultryManage, dataSourceParams)
    }
}

