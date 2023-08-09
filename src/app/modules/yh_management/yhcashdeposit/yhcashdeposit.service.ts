import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { environment } from 'src/environments/environment';
import { TokenAuthService } from 'src/app/shared/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataSourceAccessor } from 'src/app/providers/common/DataSourceAccessor';
import CustomStore from 'devextreme/data/custom_store';
@Injectable()
export class YhCashDepositService {
    constructor(private tokenService: TokenAuthService,
        private http: HttpClient,
        private dataSourceAccessor: DataSourceAccessor) {}

    getListCustomDataSource(): DataSource {
        return this.dataSourceAccessor.getCustomDataStore({
            url: `${environment.yhProductionReadServer}/oq/YhCashDepositOData`,
            key: 'NumericalOrder',
            keyType: 'string',
        });
    }

    getCustomDataSourceById(id: string) {
        return new DataSource({
            store: new CustomStore({
                load: (loadOptions) => {
                    return this.http
                        .get(
                            `${environment.yhProductionReadServer}/oq/YhCashDepositOData?$filter=NumericalOrder eq '${id}'`
                        )
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
     * 获取列表/详情数据源
     * @param numericalOrder 流水号
     */
    getListDataSource(numericalOrder?: string): DataSource {
        let filter = [];
        if (numericalOrder) {
            filter.push(['NumericalOrder', '=', numericalOrder]);
        }else{
            filter= null
        }
        console.log(filter);
        return new DataSource({
            store: this.store,
            filter:filter,
            expand: [],
            sort:[{selector:'NumericalOrder',asc:true}],
            paginate: false,
        });


    }
    /**
     * 数据源ODataStore
     */
    private get store(): ODataStore {
        return new ODataStore({
            url: `${environment.yhProductionReadServer}/oq/YhCashDepositOData`,
            key: 'NumericalOrder',
            keyType: 'string',
            version: 4,
        });
    }
    /**
     * 批量删除
     * @param keys  [{      "numericalOrder": "string",      "numericalOrderDetail": "string"    }]
     */
    deleteBatch(details: Array<object>) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { Details: details },
        };
        return this.http.delete(`${environment.yhProductionServer}/YhCashDeposit/Batch`, options).toPromise();
    }
    deleteByKey(numericalOrder) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: numericalOrder },
        };
        return this.http.delete(`${environment.yhProductionServer}/YhCashDeposit`, options).toPromise();
    }
    create(data) {
        return this.http.post(`${environment.yhProductionServer}/YhCashDeposit`, data).toPromise();
    }
    update(data) {
        return this.http.put(`${environment.yhProductionServer}/YhCashDeposit`, data).toPromise();
    }
    //获取收付款单列表
    // GetPaymentReceivablesList(Para: any[]) {
    //     return this.http.get(`${environment.yhProductionReadServer}/GetPaymentReceivables?`+Para).toPromise();
    // }
    GetReceivablesList(): DataSource {
        return new DataSource({
            store: new ODataStore({
                url: `${environment.yhProductionReadServer}/oq/ReceivablesListOData`,
                key: 'NumericalOrder',
                keyType: 'String',
                version: 4,
            }),
            paginate: true,
        })
    }
    GetPaymentList(): DataSource {
        return new DataSource({
            store: new ODataStore({
                url: `${environment.yhProductionReadServer}/oq/PaymentListOData`,
                key: 'NumericalOrder',
                keyType: 'String',
                version: 4,
            }),
            paginate: true,
        })
    }
}
