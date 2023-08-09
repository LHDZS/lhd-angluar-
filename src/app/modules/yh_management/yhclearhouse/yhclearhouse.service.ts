import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';

/**
 * 免疫程序
 */
@Injectable()
export class YHClearHouseService {
    constructor(private tokenService: TokenAuthService,private http: HttpClient) {}

    getProduct(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetProduct?` + Para).toPromise();
    }
    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.yhProductionServer}/YHClearHouse`, data).toPromise();
    }
    /**
     * 删除
     * @param keys
     */
    delete(keys) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: keys },
        };
        return this.http.delete(`${environment.yhProductionServer}/YHClearHouse`, options).toPromise();
    }

    
    get store() {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHClearHouse`,
            key: 'NumericalOrder',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        });
    }

    get DetailStore() {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHClearHouseDetail`,
            key: 'GUID',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        })
    }

    get ExtendedStore() {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHClearHouseExtended`,
            key: 'NumericalOrder',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        })
    }

    get Products(){
        return new ODataStore({
            url: `${ODATA_URL_INFO.poultryBasicSettingOdataUrl}/GetProduct`,
            key: 'ProductID',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.params['$top'] = '999';
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        })
    }
    get StockType(){
        return new ODataStore({
            url: `${ODATA_URL_INFO.poultryBasicSettingOdataUrl}/GetStockType`,
            key: 'ProductID',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.params['$top'] = '99';
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        })
    }

    get Classification(){
        return new ODataStore({
            url: `${ODATA_URL_INFO.poultryBasicSettingOdataUrl}/GetClassification`,
            key: 'ProductID',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        })
    }

    getDataSource(): DataSource {
        return new DataSource({
            store: this.store,
            expand: [
            ],
        });
    }

    getDetailSource(): DataSource{
        return new DataSource({
            store: this.DetailStore,
            expand: [],
        })
    }

    getExtendedSource(): DataSource{
        return new DataSource({
            store: this.ExtendedStore,
            expand: [],
        })
    }

    getZqImmuneProcessExtended(): DataSource{
        return new DataSource({
            store: `${ODATA_URL_INFO.poultryBasicSettingOdataUrl}/YHClearHouseExtended`
        })
    }

    deleteList(keys: any[]) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: keys },
        };
        return this.http.delete(`${environment.poultryProductionServer}/YHClearHouse/deletelist`, options).toPromise();
    }

    /**
     * 修改表体
     * @param data
     */
    put(data) {
        return this.http.put(`${environment.yhProductionServer}/YHClearHouse`, data).toPromise();
    }

    getProductSource(): DataSource{
        return new DataSource({
            store: this.Products
        })
    }
  
    /** 获取详情数据 */
    byKey(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.yhProductionOdataUrl}/YHClearHouseDetail?` + Para).toPromise();
    }

    getBatchByDataDateAndHenhouse(Para: any[]) {
        return this.http
            .get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetBatchByDataDateAndHenhouse?` + Para)
            .toPromise();
    }
    // public get(key: any): Promise<any> {
        
    //     // return this.http.get(`${environment.poultryBasicSettingServer}/oq/BizZqImmuneProcess/GetDetail?BatchID=${key}`).toPromise();
    //     // return this.http.get(`${environment.poultryBasicSettingServer}/api/LambFile/GetProductionRecords?PigId=${id}`).toPromise();
    // }
    getProductCommonName(Para: any[]){
        return this.http.get(`${environment.qlwProductService}/api/ProductQuery/GetProductCommonName?` + Para).toPromise();
    }

    getConfiguration(OptionID: string = '20221221111321'){
        return this.http.get(`${environment.yhProductionReadServer}/GetConfiguration?OptionID=${OptionID}`).toPromise();
    }

    getChickenTransferData(YHBatch:string,YHFarmerID:string){
        return new DataSource({
            store: new ODataStore({
                url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHChickenTransferData?$filter=(YHFarmerID eq '${YHFarmerID}') AND (YHBatchID eq '${YHBatch}')`,
                key: 'GUID',
                keyType: 'String',
                version: 4,
                beforeSend: (e) => {
                    e.headers = {
                        Authorization: this.tokenService.token,
                    };
                },
            }),
            paginate: false,
        })
    }
}
