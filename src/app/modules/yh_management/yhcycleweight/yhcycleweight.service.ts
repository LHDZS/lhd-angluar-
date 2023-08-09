import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import {YhTareWeightDto,YhRoughWeightDto } from './yhcycleweight.model';
import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DataDictionary, FormOptions } from 'src/app/providers/enums';
import CustomStore from 'devextreme/data/custom_store';
import { EditorGridUtils } from 'src/app/components/editor-grid';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';
import { DataSourceAccessor } from 'src/app/providers/common/DataSourceAccessor';

@Injectable()
export class YhCycleWeightService {
    _roughInfoUtil = new EditorGridUtils<YhRoughWeightDto>('NumericalOrderDetail', 0);

    _tareInfoUtil = new EditorGridUtils<YhTareWeightDto>('NumericalOrderDetail', 0);

    constructor(private tokenService: TokenAuthService, private http: HttpClient, private dataSourceAccessor: DataSourceAccessor) {}

    getConfiguration(OptionID: string = '20221221111321'){
        return this.http.get(`${environment.yhProductionReadServer}/GetConfiguration?OptionID=${OptionID}`).toPromise();
    }
    // 查有存栏的批次
    getGeTramsferBatch(DataDate: any,YHFarmerID: any,YHBatchID?: any) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GeTramsferBatch?DataDate=${DataDate}&YHFarmerID=${YHFarmerID}&YHBatchID=${YHBatchID}`).toPromise();
    }
    // 查栋舍
    getHenhouseByParam(Para: any) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetHenhouseByParam?YHBatch=` + Para).toPromise();
    }
    getTransferData(){
        return new DataSource({
            store: new ODataStore({
                url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHChickenTransferData`,
                key: 'RecordID',
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
    // 毛重
    getRoughDataSource() {
        return new DataSource({
            store: new CustomStore({
                key: 'NumericalOrderDetail',
                load: loadOptions => {
                    return this._roughInfoUtil.items;
                },
                insert: data => {
                    this._roughInfoUtil.push(data);
                    return Promise.resolve();
                },
                remove: (keys: any[]) => {
                    this._roughInfoUtil.delete(keys);
                    return Promise.resolve();
                },
                update: (key, data) => {
                    this._roughInfoUtil.update(key, data);
                    return Promise.resolve();
                },
            }),
        });
    }
    // 皮重
    getTareDataSource() {
        return new DataSource({
            store: new CustomStore({
                key: 'NumericalOrderDetail',
                load: loadOptions => {
                    return this._tareInfoUtil.items;
                },
                insert: data => {
                    this._tareInfoUtil.push(data);
                    return Promise.resolve();
                },
                remove: (keys: any[]) => {
                    this._tareInfoUtil.delete(keys);
                    return Promise.resolve();
                },
                update: (key, data) => {
                    this._tareInfoUtil.update(key, data);
                    return Promise.resolve();
                },
            }),
        });
    }
    /* 获取详情数据 */
    load() {
        return this.http.get(`${environment.poultryBasicSettingReadServer}/YhWeighingList?ComboPack=`+DataDictionary.ComboPackA).toPromise();
    }
    /* 修改 */
    put(data): Promise<any> {
        return this.http.put(`${environment.poultryBasicSettingServer}/YhWeighingList`, data).toPromise();
    }
    // 暂取
    acquire(id: any) {
        return this.http.get(`${environment.yhProductionReadServer}/oq/YhRecycleWeightDetail?NumericalOrder=${id}`).toPromise();
    }
    // 暂存
    store(data): Promise<any> {
        return this.http.post(`${environment.yhProductionServer}/YhRecycleWeight`, data).toPromise();
    }
    // 列表
    getList(Para: any) {
        return this.http.get(`${environment.yhProductionReadServer}/oq/YhRecycleWeightList?$orderby=CreatedDate desc&` + Para).toPromise();
    }
    // 车重储存
    // 存值
    postWeight(data): Promise<any> {
        return this.http.post(`${environment.yhProductionServer}/YhRecycleWeight/createweight`, data).toPromise();
    }
    // 取值 GetEnterWeight
    getWeight() {
        return this.http.get(`${environment.yhProductionReadServer}/GetEnterWeight`).toPromise();
    }
    //获取最近核算单元 
    GetLastTicketedPoint(RecycleType:string) {
        return this.http.get(`${environment.yhProductionReadServer}/GetLastTicketedPointID?RecycleType=${RecycleType}`).toPromise();
    }
    //获取最近仓库
    GetLastWarehouse() {
        return this.http.get(`${environment.yhProductionReadServer}/GetLastWarehouseID`).toPromise();
    }
    // 单据完成 
    postComplete(data): Promise<any> {
        return this.http.post(`${environment.yhProductionServer}/YhRecycleWeight/complete`, data).toPromise();
    }
    // 单据取消
    postCancel(data): Promise<any> {
        return this.http.post(`${environment.yhProductionServer}/YhRecycleWeight/cancel`, data).toPromise();
    }
    // 单据结算
    postSettlement(data): Promise<any> {
        return this.http.post(`${environment.yhProductionServer}/YhRecycleWeight/settlement`, data).toPromise();
    }
    // 取消结算
    postUnSettlement(data): Promise<any> {
        return this.http.post(`${environment.yhProductionServer}/YhRecycleWeight/unsettlement`, data).toPromise();
    }
    // 单据作废
    postDelete(data): Promise<any> {
        return this.http.post(`${environment.yhProductionServer}/YhRecycleWeight/delete`, data).toPromise();
    }
    //客户完成 
    postFinish(data): Promise<any> {
        return this.http.post(`${environment.yhProductionServer}/YhRecycleWeight/finish`, data).toPromise();
    }
    //完成确认
    getRecycleWeightList(Para: any) {
        return this.http.get(`${environment.yhProductionReadServer}/oq/YhRecycleWeightCompleteList?` + Para).toPromise();
    }
    //引入销售单
    getPoultrySalesOrder(Para: any) {
        return this.http.get(`${environment.yhProductionReadServer}/oq/YHPoultrySalesOrderImportList?` + Para).toPromise();
    }
}
