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
export class yhBatchService {
    constructor(private tokenService: TokenAuthService,private http: HttpClient) {}
    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.yhBasicSettingServer}/YHBatch`, data).toPromise();
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
            body: { YHBatchID: keys },
        };
        return this.http.delete(`${environment.yhBasicSettingServer}/YHBatch`, options).toPromise();
    }


    get store() {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhBasicSettingOdataUrl}/YHBatch`,
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

    getDataSource(key?:string): DataSource {
        var filter = key ? [['YHBatchID', '=', key]] : [];
        return new DataSource({
            store: this.store,
            expand: [
            ],
            filter: filter,
            map: (dataItem) => {
                if(dataItem.DaysOld != null && dataItem.DaysOld < 0) {
                    dataItem.DaysOld = null;
                }
                return dataItem;
            }
        });
    }

    /**
     * 修改表体
     * @param data
     */
    put(data) {
        return this.http.put(`${environment.yhBasicSettingServer}/YHBatch`, data).toPromise();
    }
    getMaxSerialNoByYHFarmerID(Para: any) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetMaxSerialNoByYHFarmerID?` + Para).toPromise();
    }

    getBatchTransferData(Para: string) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetBatchTransferData?YHBatchID=` + Para).toPromise();
    }

    getFarmerContractByYHFarmerID(Para: any) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetFarmerContractByYHFarmerID?` + Para).toPromise();
    }
}
