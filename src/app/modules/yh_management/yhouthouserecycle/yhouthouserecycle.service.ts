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
export class YHOutHouseRecycleService {
    constructor(private tokenService: TokenAuthService,private http: HttpClient) {}

    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.yhProductionServer}/OutHouseRecycle`, data).toPromise();
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
        return this.http.delete(`${environment.yhProductionServer}/OutHouseRecycle`, options).toPromise();
    }

    /**
     * 修改表体
     * @param data
     */
    put(data) {
        return this.http.put(`${environment.yhProductionServer}/OutHouseRecycle`, data).toPromise();
    }

    getClosedInTheCurrent() {
        return this.http.get(`${environment.yhProductionReadServer}/GetClosedInTheCurrent`).toPromise();
    }

    get store() {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHOutHouseRecycleList`,
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

    getDataSource(): DataSource {
        return new DataSource({
            store: this.store,
            expand: [
            ],
            map: (m) => {
                if(m.DaysOld < 0) m.DaysOld = null;
                return m;
            },
        });
    }

    getDetailSource(): DataSource{
        return new DataSource({
            store: this.DetailStore,
            expand: [],
        })
    }

    /** 获取详情数据 */
    byKey(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.yhProductionOdataUrl}/YHOutHouseRecycleDetail?` + Para).toPromise();
    }

    getConfiguration(OptionID: string = '20221221111321'){
        return this.http.get(`${environment.yhProductionReadServer}/GetConfiguration?OptionID=${OptionID}`).toPromise();
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
    async getGetRqUnitPrice(Para: any) {
        return await this.http.get(`${environment.yhProductionReadServer}/GetRqUnitPrice?` + Para).toPromise();
    }
}
