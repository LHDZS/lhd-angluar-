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
export class PatrolrecordService {
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
    //饲料结存弹出框
    getFeed(para:any) {
        var EndDate="0";
        if(para.EndDate){
            EndDate=para.EndDate;
        }
        return this.http.get(`${environment.yhProductionReadServer}/GetFeedInventoryPopup/getFeed?DataDate=${para.DataDate}&YHBatch=${para.YHBatch}&HenhouseID=${para.HenhouseID}&ProductID=${para.ProductID}&BatchID=${para.ProductBatchID}&NumericalOrder=${para.NumericalOrder}&Type=${para.Type}&EndDate=${EndDate}`).toPromise();
    }
    //弹出框日龄存栏接口
    getStock(DataDate: string,YHBatch: string, NumericalOrder: string,EndDate: string,HenhouseID:string) {
        return this.http.get(`${environment.yhProductionReadServer}/GetFeedInventoryPopup/getStock?DataDate=${DataDate}&YHBatch=${YHBatch}&NumericalOrder=${NumericalOrder}&EndDate=${EndDate}&HenhouseID=${HenhouseID}`).toPromise();
    }
    //根据养户批次查品种领苗日期领苗只数数
    YHBatchAndLmData(para: any) {
        return this.http.get(`${environment.yhProductionReadServer}/YHBatchAndLmData?YHBatch=` + para).toPromise();
    }
    // 商品代号
    PatrolRecordProduct(Para: any) {
        return this.http.get(`${environment.yhProductionReadServer}/PatrolRecordProduct?YHBatch=${Para.YHBatch}&StartDate=${Para.StartDate}&EndDate=${Para.EndDate}&HenhouseID=${Para.HenhouseID}`).toPromise();
    }
    // 栋舍
    getHenhouseByParam(Para: any) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetHenhouseByParam?` + Para).toPromise();
    }
    // 判断品种/类型等是否可编辑
    getChickenReceiveByYhBatchID(Para: any) {
        return this.http.get(`${environment.yhProductionReadServer}/GetChickenReceiveByYhBatchID?` + Para).toPromise();
    }
    //判断账期月份
    getClosedInTheCurrent() {
        return this.http.get(`${environment.yhProductionReadServer}/GetClosedInTheCurrent`).toPromise();
    }
    /** 获取养户管理员 */
    YhFarmingPerson(params) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetYhFarmingPerson${params}`).toPromise();
    }
    getConfiguration(OptionID: string = '20221221111321'){
        return this.http.get(`${environment.yhProductionReadServer}/GetConfiguration?OptionID=${OptionID}`).toPromise();
    }
    /**
     * 获取列表
     */
    getListDataSource(): DataSource {
        return this.dataSourceAccessor.getCustomDataStore({
            url: `${environment.yhProductionReadServer}/oq/YhPatrolRecordList`,
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
    // getCustomDataSourceById(id: string) {
    //     return new DataSource({
    //         store: new CustomStore({
    //             load: (loadOptions) => {
    //                 return this.http
    //                     .get(
    //                         `${environment.yhProductionReadServer}/oq/YhPatrolRecordDetail?$filter=NumericalOrder eq '${id}'&$orderby=NumericalOrderDetail`
    //                     )
    //                     .toPromise()
    //                     .then((value) => {
    //                         return {
    //                             data: value['value'],
    //                         };
    //                     });
    //             },
    //         }),
    //     });
    // }

    getCustomDataSourceById(id: string) {
       return this.http.get(`${environment.yhProductionReadServer}/YhPatrolRecordExtend?NumericalOrder=${id}`).toPromise();
    }

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
        return this.http.delete(`${environment.yhProductionServer}/YhPatrolRecord`, options).toPromise();
    }
    deleteByKey(key) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: key },
        };
        return this.http.delete(`${environment.yhProductionServer}/YhPatrolRecord`, options).toPromise();
    }
    create(data) {
        return this.http.post(`${environment.yhProductionServer}/YhPatrolRecord`, data).toPromise();
    }
    update(data) {
        return this.http.put(`${environment.yhProductionServer}/YhPatrolRecord`, data).toPromise();
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
            url: `${environment.yhProductionReadServer}/oq/YhPatrolRecordDetail`,
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
