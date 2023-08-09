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
export class YHProductionODataContext extends ODataContextBase {
    /**
     * 上下文对象
     */
    context: ODataContext;

    YHFarmerContract: ODataStore;

    YHFarmerContractHenhouseDetail: ODataStore;

    PriceProposalsList: ODataStore;

    FarmingPriceProposalsList: ODataStore;

    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();

        this.context = new ODataContext({
            url: `${environment.yhProductionReadServer}` + '/oq',
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
                YHFarmerContract: {
                    key: 'ContractNo',
                    keyType: 'String'
                },
                YHFarmerContractHenhouseDetail: {
                    key: 'NumericalOrderDetail',
                    keyType: 'String'
                },
                PriceProposalsList: {
                    key: 'NumericalOrder',
                    keyType: 'String'
                },
                FarmingPriceProposalsList: {
                    key: 'NumericalOrder',
                    keyType: 'String'
                }
            },
        });

        this.YHFarmerContract = this.context['YHFarmerContract'];

        this.YHFarmerContractHenhouseDetail = this.context['YHFarmerContractHenhouseDetail'];
        this.PriceProposalsList = this.context['PriceProposalsList']
        this.FarmingPriceProposalsList = this.context['FarmingPriceProposalsList']
    }

    getYHFarmerContractInfoDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.YHFarmerContract, dataSourceParams)
    }
    
    getYHFarmerContractHenhouseDetailDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.YHFarmerContractHenhouseDetail, dataSourceParams)
    }

    getPriceProposalsListDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.PriceProposalsList, dataSourceParams)
    }
    getFarmingPriceProposalsListDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()){
        return this.helper.getDataSource(this.FarmingPriceProposalsList, dataSourceParams)
    }
}

