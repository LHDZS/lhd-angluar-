import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TokenAuthService } from 'src/app/shared/services';
import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { AppIdDataRel, DataDictionary } from 'src/app/providers/enums';
import { ODataContextBase } from 'src/app/providers/odataContext/helper';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';
import CustomStore from 'devextreme/data/custom_store';
import { EditorGridUtils } from 'src/app/components/editor-grid';
import { HttpProvider } from 'src/app/common/http';


/**
 * 鸡场service
 */
@Injectable()
export class yhmaterialsettingsService {
    // 审核接口需要 private _http: HttpProvider
    constructor(private tokenService: TokenAuthService,private http: HttpClient, private _http: HttpProvider) {
        
    }
    //列表请求
    get store() {
        return new ODataStore({
            url: `${environment.yhProductionReadServer}/oq/MaterialSettingsList`,
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
    //获取商品信息
    getProduct(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetProduct?` + Para).toPromise();
    }

    /** 获取审核信息 */
    getReviewInfo(data) {
        return this._http.post(`${environment.commonOdataContext}/api/QLW_Review/GetRereiew`, data);
    }

    /** 审核操作 */
    operationReview(data) {
        return this._http.post(`${environment.commonOdataContext}/api/QLW_Review/OperateReview`, data);
    }

    /** 本集团养殖场名称 */
    AllName() {
        return this.http.get(`${environment.yhProductionServer}/oq/YhChickenFarmRelateAllName`).toPromise();
    }

    /** 获取详情表头 */
    SetDetail(params) {
        return this.http.get(`${environment.yhProductionReadServer}/MaterialSettingsDetail?NumericalOrder=${params}`).toPromise();
    }
    /** 获取养殖价格方案 */
    FarmingPrice(params) {
        return this.http.get(`${environment.yhProductionReadServer}/GetYhFarmingPrice${params}`).toPromise();
    }
    /** 获取养户管理员 */
    YhFarmingPerson(params) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetYhFarmingPerson${params}`).toPromise();
    }

    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.yhProductionServer}/MaterialSettings`, data).toPromise();
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
        return this.http.delete(`${environment.yhProductionServer}/MaterialSettings`, options).toPromise();
    }

    deleteList(keys: any[]) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { DeleteList: keys },
        };
        return this.http.delete(`${environment.yhProductionServer}/MaterialSettings`, options).toPromise();
    }
    /**
     * 修改
     * @param data
     */
    put(data) {
        return this.http.put(`${environment.yhProductionServer}/MaterialSettings`, data).toPromise();
    }
}
