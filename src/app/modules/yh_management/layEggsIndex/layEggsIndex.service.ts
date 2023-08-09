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
export class layEggsIndexService {
    //套餐类型
    comboPack: string = DataDictionary.ComboPackA;

    qiniu_token: string;

    constructor(private tokenService: TokenAuthService, private http: HttpClient, private _http: HttpProvider) {}

    getProductBatch() {
        return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetProductBatchData?`).toPromise();
    }

    create(data) {
        return this.http.post(`${environment.yhProductionServer}/YhBatchTransfer`, data).toPromise();
    }
    update(data) {
        return this.http.put(`${environment.yhProductionServer}/YhBatchTransfer`, data).toPromise();
    }

    deleteByKey(key) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: key },
        };
        return this.http.delete(`${environment.yhProductionServer}/YhBatchTransfer`, options).toPromise();
    }

    getCustomDataSourceById(id: string) {
        return new DataSource({
            store: new CustomStore({
                load: (loadOptions) => {
                    return this.http
                        .get(
                            `${environment.yhProductionReadServer}/oq/YhBatchTransferDetail?$filter=NumericalOrder eq '${id}'&$orderby=NumericalOrderDetail`
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

    /**
     * 获取引入标准弹框表格数据
     */
    getPopupData(filter: any = ''): DataSource {
        console.log('getPopupData filter: ', filter);
        return new DataSource({
            store: new ODataStore({
                url: `${environment.yhProductionReadServer}/sale/oq/StandardPigBringSaleShipping`,
                key: 'NumericalOrder',
                keyType: 'String',
                version: 4,
            }),
            paginate: true,
            filter: filter,
        });
    }

    //通过批次获取数据
    getBatchTransferDetailDatas(Para: any) {
        return this.http.get(`${environment.yhProductionReadServer}/GetBatchTransferDetailDatas?` + Para).toPromise();
    }

    queryWarehouseByFarm(Para: any[]) {
        return this.http.get(`${environment.poultryProductionServer}/QueryWarehouse?` + Para).toPromise();
    }

    //列表请求
    get store() {
        return new ODataStore({
            url: `${environment.yhProductionReadServer}/oq/BatchEnterProfitList`,
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
    BatchEnterProfitDetail(params) {
        return this.http
            .get(`${environment.yhProductionReadServer}/BatchEnterProfitDetail?NumericalOrder=${params}`)
            .toPromise();
    }
    // /** 获取详情表体 */
    // BatchEnterProfitBillDetail(params) {
    //     return this.http.get(`${environment.yhProductionServer}/layEggsIndexBillDetail${params}`).toPromise();
    // }

    /** 获取详情表体 */
    BatchEnterProfitBillDetail(params) {
        return this.http.get(`${environment.yhProductionServer}/oq/BatchEnterProfitBatch`).toPromise();
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
        return this.http.post(`${environment.yhProductionServer}/BatchEnterProfit`, data).toPromise();
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
        return this.http.delete(`${environment.yhProductionServer}/BatchEnterProfit`, options).toPromise();
    }

    deleteList(keys: any[]) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { DeleteList: keys },
        };
        return this.http.delete(`${environment.yhProductionServer}/BatchEnterProfit`, options).toPromise();
    }
    /**
     * 修改
     * @param data
     */
    put(data) {
        return this.http.put(`${environment.yhProductionServer}/BatchEnterProfit`, data).toPromise();
    }
}
