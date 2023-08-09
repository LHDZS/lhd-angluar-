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

/**
 * 鸡场service
 */
@Injectable()
export class yhsettlementsettingService {
    //套餐类型
    comboPack: string = DataDictionary.ComboPackA;


    qiniu_token: string;

    constructor(private tokenService: TokenAuthService,private http: HttpClient) {
        
    }

    save(data) {
        return this.http.post(`${environment.yhProductionServer}/YHSettlementSetting`, data).toPromise();
    }

    //查询详情
    getYHSettlementsetting() {
        return this.http.get(`${environment.yhProductionReadServer}/GetYHSettlementsetting`).toPromise();
    }

    /** 获取审核信息 */
    getReviewInfo(data) {
        return this.http.post(`${environment.commonOdataContext}/api/QLW_Review/GetRereiew`, data);
    }
    /** 审核操作 */
    operationReview(data) {
        return this.http.post(`${environment.commonOdataContext}/api/QLW_Review/OperateReview`, data);
    }
}
