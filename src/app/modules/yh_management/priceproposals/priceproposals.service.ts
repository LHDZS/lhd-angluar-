import { Injectable } from '@angular/core';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { HttpProvider } from 'src/app/common/http';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataStatus, EditorGridUtils } from 'src/app/components/editor-grid';
import { environment } from 'src/environments/environment';
import {
    QlwODataContext,
    BasicSettingODataContext
} from 'src/app/providers/odataContext';
import { DataSourceAccessor } from 'src/app/providers/common/DataSourceAccessor';
import { DataSourceFactory, StoreFactory } from 'src/app/common/odata';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';

@Injectable()
export class PriceProposalsService {
    _detailInfoUtil = new EditorGridUtils<PriceProposalsInfoEntity>('RecordID', 0);
    constructor(
        private _http: HttpProvider,
        private qlwOdataContext: QlwODataContext,
        private basicSettingODataContext: BasicSettingODataContext,
        private http: HttpClient,
        private dataSourceAccessor: DataSourceAccessor
    ) {}

    /** 获取列表数据源 */
    getListDataSource() {
        return DataSourceFactory.odata(
            StoreFactory.odata({
                url: `${environment.yhProductionReadServer}/oq/PriceProposalsList`,
                key: 'NumericalOrder',
                keyType: 'String',
            })
        );
    }
    getDetailSource() {
        return new DataSource({
            store: new CustomStore({
                key: 'RecordID',
                load: loadOptions => {
                    return this._detailInfoUtil.items;
                },
                insert: data => {
                    this._detailInfoUtil.push(data);
                    return Promise.resolve();
                },
                remove: (keys: any[]) => {
                    this._detailInfoUtil.delete(keys);
                    return Promise.resolve();
                },
                update: (key, data) => {
                    this._detailInfoUtil.update(key, data);
                    return Promise.resolve();
                },
            }),
        });
    }

    /** 获取详情数据 */
    byKey(Para: any[]) {
        return this.http.get(`${environment.yhProductionReadServer}/PriceProposalsDetail?` + Para).toPromise();
    }

    /** 删除 */
    delete(numericalOrders: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: numericalOrders },
        };
        return this.http.delete(`${environment.yhProductionServer}/PriceProposals`, options).toPromise();
    }

    /** 新增 */
    post(data: PriceProposalsEntity) {
        return this.http.post(`${environment.yhProductionServer}/PriceProposals`, data).toPromise();
    }
    /** 修改 */
    put(data: PriceProposalsEntity) {
        return this.http.put(`${environment.yhProductionServer}/PriceProposals`, data).toPromise();
    }
    /** 获取审核信息 */
    getReviewInfo(data) {
        return this._http.post(`${environment.commonOdataContext}/api/QLW_Review/GetRereiew`, data);
    }
    /** 审核操作 */
    operationReview(data) {
        return this._http.post(`${environment.commonOdataContext}/api/QLW_Review/OperateReview`, data);
    }
}

export class PriceProposalsEntity {
    /** 流水号 */
    NumericalOrder: string;
    /** 单据号 */
    Number: string;
    /** 单据日期 */
    DataDate: string;
    /** 备注 */
    Remarks: string="";
    /** 商品类型 */
    ProductCollectType: string;
    /** 生效日期 */
    EffectDate: string;
    PriceType: string;
    /**修改日期 */
    ModifiedDate: string;
    /** 明细 */
    PriceProposalsDetailDto: PriceProposalsInfoEntity[];
    FilesDto: FileDto[];
}

export class PriceProposalsInfoEntity {
    /** 操作标识 */
    target?: DataStatus;
    /** 行主键 */
    RecordID?: string;
    MeasureUnitName: string;
    UnitPrice: number;
    OldUnitPrice: number;
    ProductID: string;
    cProductName: string;
    NumericalOrderDetail: string="0";
}
export class FileDto {

}
