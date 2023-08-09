import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import {ZqPickupChickSettingDto } from './yhproductpoultrymanage.model';
import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { DataDictionary, FormOptions } from 'src/app/providers/enums';
import CustomStore from 'devextreme/data/custom_store';
import { EditorGridUtils } from 'src/app/components/editor-grid';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';

@Injectable()
export class PickupChickSettingService {

    _feedingInfoUtil = new EditorGridUtils<ZqPickupChickSettingDto>('RecordID', 0);

    constructor(private tokenService: TokenAuthService, private http: HttpClient) {}

    getDataSource() {
        return new DataSource({
            store: new CustomStore({
                key: 'RecordID',
                load: loadOptions => {
                    return this._feedingInfoUtil.items;
                },
                insert: data => {
                    this._feedingInfoUtil.push(data);
                    return Promise.resolve();
                },
                remove: (keys: any[]) => {
                    this._feedingInfoUtil.delete(keys);
                    return Promise.resolve();
                },
                update: (key, data) => {
                    this._feedingInfoUtil.update(key, data);
                    return Promise.resolve();
                },
            }),
        });
    }
    getProductInfo(productid: string) {
        return this.http.get(`${environment.gatway.getProductInfo}?scope=1&enterpriseid=`+USER_INFO_CONTEXT.enterpriseId+`&productid=`+productid).toPromise();
    }
     /** 获取详情数据 */
    load() {
        return this.http.get(`${environment.yhBasicSettingReadServer}/oq/BizProductPoultryManage?$filter=PoultryStatus eq true`).toPromise();
    }
    getProduct(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetProduct?` + Para).toPromise();
    }
    /** 修改 */
    put(data): Promise<any> {
        return this.http.put(`${environment.yhBasicSettingServer}/ProductPoultryManage`, data).toPromise(); //h
    }
}
