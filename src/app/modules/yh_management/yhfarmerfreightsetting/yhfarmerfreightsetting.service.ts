import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';
import { async } from 'rxjs/internal/scheduler/async';

/**
 * 免疫程序
 */
@Injectable()
export class YHFreightSettingService {
    constructor(private tokenService: TokenAuthService,private http: HttpClient) {}

    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.yhBasicSettingServer}/YHFarmerFreightSetting`, data).toPromise();
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
            body: { ChickenFarmID: keys },
        };
        return this.http.delete(`${environment.yhBasicSettingServer}/YHFarmerFreightSetting`, options).toPromise();
    }

    
    get store() {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhBasicSettingOdataUrl}/YHFarmerfreightsetting`,
            key: 'ChickenFarmID',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        });
    }

    getDataSource(): DataSource {
        return new DataSource({
            store: this.store,
        });
    }
    

    getConfiguration(OptionID: string = '20221221111321'){
        return this.http.get(`${environment.yhProductionReadServer}/GetConfiguration?OptionID=${OptionID}`).toPromise();
    }
    
    // 获取省市县地址下拉数据
    async address(id,typeId:number=0) {
        return await this.http
        .get(
        `${environment.ylwBasicSettingServer}/AreaQuery/GetAreaQueryById?id=${id}&Type=${typeId}`,
        )
        .toPromise()
    }
}
