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
export class FarmingBatchSubsidyService {
    _detailInfoUtil = new EditorGridUtils<FarmingBatchSubsidyInfoEntity>('RecordID', 0);
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
                url: `${environment.yhProductionReadServer}/oq/FarmingBatchSubsidyList`,
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
        return this.http.get(`${environment.yhProductionReadServer}/FarmingBatchSubsidyDetail?` + Para).toPromise();
    }

    /** 删除 */
    delete(numericalOrders: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: numericalOrders },
        };
        return this.http.delete(`${environment.yhProductionServer}/FarmingBatchSubsidy`, options).toPromise();
    }

    getClearHouseAndRecycleWeight(Para: string) {
        return this.http.get(`${environment.yhProductionReadServer}/QueryClearHouseAndRecycleWeight?` + Para).toPromise();
    }

    getSubsidyProgrammeData(Para: any) {
        return this.http.post(`${environment.yhProductionReadServer}/QuerySubsidyProgrammeData`, Para).toPromise();
    }

    /** 新增 */
    post(data: FarmingBatchSubsidyEntity) {
        return this.http.post(`${environment.yhProductionServer}/FarmingBatchSubsidy`, data).toPromise();
    }
    /** 修改 */
    put(data: FarmingBatchSubsidyEntity) {
        return this.http.put(`${environment.yhProductionServer}/FarmingBatchSubsidy`, data).toPromise();
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

export class FarmingBatchSubsidyEntity {
    /** 流水号 */
    NumericalOrder: string;
    /** 单据号 */
    Number: string;
    /** 单据日期 */
    DataDate: string;
    /** 备注 */
    Remarks: string="";
    /** 养户 */
    YHFarmerID: string;
    YHFarmerName: string;
    /** 批次 */
    YHBatch: string;
    YHBatchName: string;
    ChickenFarmID: string;
    ChickenFarmName: string;
    ComboPack: string;
    /**修改日期 */
    ModifiedDate: string;
    /** 明细 */
    FarmingBatchSubsidyDetailDto: FarmingBatchSubsidyInfoEntity[];
    FilesDto: FileDto[];
}

export class FarmingBatchSubsidyInfoEntity {
    /** 操作标识 */
    target?: DataStatus;
    /** 行主键 */
    RecordID?: string;
    AdjustAmount: number;
    AdjustFactor: number;
    SunsidyAmount: number;
    AdjustExpression: string;
    AdjustIndicator: string;
    YHSubsidyID: string;
    YHSubsidyName: string;
    NumericalOrderDetail: string="0";
    NumericalOrder: string;
    Remarks: string;
}
export class FileDto {

}
