import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { environment } from 'src/environments/environment';
import { TokenAuthService } from 'src/app/shared/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import CustomStore from 'devextreme/data/custom_store';
import { DataSourceAccessor } from 'src/app/providers/common/DataSourceAccessor';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';

@Injectable()
export class YhChickenReceiveService {
    constructor(private tokenService: TokenAuthService, private http: HttpClient, private dataSourceAccessor: DataSourceAccessor) { }
    getProductBatch() {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetProductBatchData?`).toPromise();
    }
    getBatchByDataDateAndHenhouse(Para: any[]) {
        return  this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetBatchByDataDateAndHenhouse?` + Para).toPromise();
    }
    getProduct(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetProduct?` + Para).toPromise();
    }
    // 栋舍
    getHenhouseByParam(Para: any) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetHenhouseByParam?` + Para).toPromise();
    }
    // 判断品种/类型等是否可编辑
    getChickenReceiveByYhBatchID(Para: any) {
        return this.http.get(`${environment.yhProductionReadServer}/GetChickenReceiveByYhBatchID?` + Para).toPromise();
    }
    /**
     * 获取列表
     */
    getListDataSource(): DataSource {
        return this.dataSourceAccessor.getCustomDataStore({
            url: `${environment.yhProductionReadServer}/oq/YHChickenReceiveList`,
            key: 'NumericalOrder',
            keyType: 'String',
            beforeSend: (loadOptions, e) => {
                e.params['$count'] = false;
                e.params['$top'] = loadOptions.take;
                e.params['$skip'] = loadOptions.skip;
            },
            // filter: [['Abstract', '=', AbstractType.Beginstring]],
        });
    }

    //弹框明细
    getQLWWarehouseStock(Para: any) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetQLWWarehouseStock?` + Para).toPromise();
    }

    queryWarehouseByFarm(Para: any[]) {
        return this.http.get(`${environment.poultryProductionServer}/QueryWarehouse?` + Para).toPromise();
    }

    queryBatchDetail(Para: any[]) {
        return this.http.get(`${environment.poultryProductionServer}/QueryBatchDetail?` + Para).toPromise();
    }

    getClosedInTheCurrent() {
        return this.http.get(`${environment.yhProductionReadServer}/GetClosedInTheCurrent`).toPromise();
    }

    getCustomDataSourceById(id: string) {
        return new DataSource({
            store: new CustomStore({
                load: (loadOptions) => {
                    return this.http
                        .get(
                            `${environment.yhProductionReadServer}/oq/YHChickenReceiveDetail?$filter=NumericalOrder eq '${id}'&$orderby=NumericalOrderDetail`
                        ) //https://localhost:5021
                        .toPromise()
                        .then((value) => {
                            return {
                                data: value['value'],
                            };
                        });
                },
            }),
        });
    }

    /** 获取详情数据 */
    // byKey(Para: any[]) {
    //     return this.http.get(`${environment.yhProductionReadServer}/oq/YHChickenReceiveDetail?` + Para).toPromise();
    // }
    /**
     * 删除和批量删除
     * @param keys
     */
    delete(keys: Array<any>) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: {ZqIntochickenDetailRequest: keys },
        };
        return this.http.delete(`${environment.yhProductionServer}/YHChickenReceive`, options).toPromise();
    }
    deleteByKey(key) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: key },
        };
        return this.http.delete(`${environment.yhProductionServer}/YHChickenReceive`, options).toPromise();
    }
    create(data) {
        return this.http.post(`${environment.yhProductionServer}/YHChickenReceive`, data).toPromise();
    }
    update(data) {
        return this.http.put(`${environment.yhProductionServer}/YHChickenReceive`, data).toPromise();
    }




    //#region  引用免疫计划
    getpanelListDataSource(): DataSource {
        return new DataSource({
            store: this.panelstore,
        });
    }
    getpanedetailDataSource(numericalOrder?: string): DataSource {
        let filter = [];
        if (numericalOrder) {
            filter.push(['NumericalOrder ', '=', numericalOrder]);
        }
        return new DataSource({
            store: this.panelstore,
            filter: filter,
            expand: [],
        });
    }
    /**
     * 数据源ODataStore
     */
    private get panelstore(): ODataStore {
        return new ODataStore({
            url: `${environment.zlwhealthManageServer}/oq/ImmunityPlanHanderExpand`,
            key: 'NumericalOrder',
            keyType: 'string',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        });
    }
    //获取详情信息
    getdetailDataSource(numericalOrder?: string): DataSource {
        let filter = [];
        if (numericalOrder) {
            filter.push(['NumericalOrder ', '=', numericalOrder]);
        }
        return new DataSource({
            store: this.strpanelstore,
            filter: filter,
            expand: [],
        });
    }
    /**
     * 数据源ODataStore
     */
    private get strpanelstore(): ODataStore {
        return new ODataStore({
            url: `${environment.yhProductionReadServer}/oq/YHChickenReceiveDetail`,
            key: 'NumericalOrder',
            keyType: 'string',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        });
    }
    async getGetUnitPrice(Para: any) {
        return await this.http.get(`${ODATA_URL_INFO.yhProductionOdataUrl}/GetUnitPrice?` + Para).toPromise();
    }
    //#endregion
}
