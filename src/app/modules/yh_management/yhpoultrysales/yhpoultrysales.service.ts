import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { environment } from 'src/environments/environment';
import { TokenAuthService } from 'src/app/shared/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import CustomStore from 'devextreme/data/custom_store';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';

@Injectable()
export class YHPoultrySalesService {
    constructor(private tokenService: TokenAuthService, private http: HttpClient) {}
    /**
     * 获取列表
     */
    getListDataSource(): DataSource {
        return new DataSource({
            store: this.store,
            expand: [],
        });
    }
    /**
     * 详情数据源
     * @param numericalOrder 流水号
     */
    getDetailDataSource(numericalOrder?: string): DataSource {
        let filter = [];
        if (numericalOrder) {
            filter.push(['NumericalOrder', '=', numericalOrder]);
        }
        return new DataSource({
            store: this.store,
            filter: filter,
            expand: [],
        });
    }

    /**
     * 数据源ODataStore
     */
    private get store(): ODataStore {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHPoultrySalesOrder`,
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

    /**
     * 获取列表
     */
     getListDetailDataSource(): DataSource {
        return new DataSource({
            store: this.detailstore,
            expand: [],
        });
    }

    /**
     * 数据源ODataStore
     */
     private get detailstore(): ODataStore {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHPoultrySalesOrderDetail`,
            key: 'NumericalOrderDetail',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        });
    }

    getCustomDataSourceById(id: string) {
        return new DataSource({
            store: new CustomStore({
                load: (loadOptions) => {
                    return this.http
                        .get(
                            `${ODATA_URL_INFO.yhProductionOdataUrl}/YHPoultrySalesOrderDetail?$filter=NumericalOrder eq '${id}'&$orderby=SerialNo ASC`
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
    getProduct(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetProduct?` + Para).toPromise();
    }

    getProductMeasureunit(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetProductMeasureunit?`+ Para).toPromise();
    }
    getBatchNumber(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetBatchNumber?` + Para).toPromise();
    }
    getProductMeasure(Para: any[]) {
        return  this.http.get(`${environment.poultryBasicSettingReadServer}/BizProductMeasure?` + Para).toPromise();
    }

    getProductBatch() {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetProductBatchData?`).toPromise();
    }

    GetQueryProductMeasureUnitExt(Para: any[]){
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/QueryProductMeasureUnitExt?`+ Para).toPromise();
    }
    /**
    * 获取商品信息
    *
    */
    getProductInfo(productid: string) {
        return this.http
            .get(
                `${environment.gatway.getProductInfo}?scope=1&enterpriseid=` +
                    USER_INFO_CONTEXT.enterpriseId +
                    `&productid=` +
                    productid
            )
            .toPromise();
    }
    getBatchByDataDateAndHenhouse(Para: any[]) {
        return this.http
            .get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetBatchByDataDateAndHenhouse?` + Para)
            .toPromise();
    }

    getUnitmeasurementDataSource() {
        return {
            store: new ODataStore({
                url: `${environment.qlwProductService}/oq/Unitmeasurement`,
                key: 'UnitId',
                keyType: 'String',
                version: 4,
                beforeSend: (e) => {},
            }),
            paginate: true,
            pageSize: 15,
        };
    }

    getAllUnitmeasurementDataSource(Para: any[]) {
        return this.http.get(`${environment.qlwProductService}/oq/Unitmeasurement`).toPromise();
    }

    getEggGoodsSalesOrder(Para: any[]){
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetEggGoodsSalesOrder`).toPromise();
    }

    //查询该日期前,该出库仓库,该公司的的库存明细账
    getWarehouseStock(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetWarehouseStock?` + Para).toPromise();
    }
    getQLWWarehouseStock(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetQLWWarehouseStock?` + Para).toPromise();
    }
    //获取辅助单位
    getMeasureUnitExt(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetMeasureUnitExt?` + Para).toPromise();
    }
    delete(key) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: key },
        };
        return this.http.delete(`${environment.yhProductionServer}/YHPoultrySalesOrder`, options).toPromise();
    }
    create(data) {
        return this.http.post(`${environment.yhProductionServer}/YHPoultrySalesOrder`, data).toPromise();
    }
    update(data) {
        return this.http.put(`${environment.yhProductionServer}/YHPoultrySalesOrder`, data).toPromise();
    }

    getBuyBackPlanStore(Para: string){
        return this.http.get(`${environment.yhProductionReadServer}/BuyBackPlanDetail?` + Para).toPromise();
    }
}
