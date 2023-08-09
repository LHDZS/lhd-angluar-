import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { environment } from 'src/environments/environment';
import { TokenAuthService } from 'src/app/shared/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import CustomStore from 'devextreme/data/custom_store';
import { DataSourceAccessor } from 'src/app/providers/common/DataSourceAccessor';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';
import { DataDictionary } from 'src/app/providers/enums';

@Injectable()
export class DrugOtherReceiveService {
    constructor(private tokenService: TokenAuthService, private http: HttpClient, private dataSourceAccessor: DataSourceAccessor) { }

    /**
     * 获取列表
     */
    getListDataSource(): DataSource {
        return this.dataSourceAccessor.getCustomDataStore({
            url: `${environment.yhProductionReadServer}/oq/DrugOtherReceiveList`,
            key: 'NumericalOrder',
            keyType: 'String',
            beforeSend: (loadOptions, e) => {
                e.params['$count'] = false;
                e.params['$top'] = loadOptions.take;
                e.params['$skip'] = loadOptions.skip;
            },
            // filter: [['Abstract', '=', AbstractType.Beginstring]],
        });
    }

    getCustomDataSourceById(id: string) {
        return new DataSource({
            store: new CustomStore({
                load: (loadOptions) => {
                    return this.http
                        .get(
                            `${ODATA_URL_INFO.yhProductionOdataUrl}/DrugOtherReceiveDetail?$filter=NumericalOrder eq '${id}'&$orderby=RecordID`
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
    
    // 通过养户查管理员接口
    getFarmerMgmtByYHFarmerID(id:any) {
        return this.http.get(`${environment.yhProductionReadServer}/GetFarmerMgmtByYHFarmerID?YHFarmerID=${id}`).toPromise();
    }

    // 通过养户批次查批次附带信息
    getYHBatchDetailByYHBatch(id:any) {
        return this.http.get(`${environment.yhProductionReadServer}/GetYHBatchDetailByYHBatch?YHBatch=${id}`).toPromise();
    }

    // 用药申请明细请求
    getDrugApplicationList(YHFarmerID: string,BatchID: string) {
        return this.http.get(`${environment.yhProductionReadServer}/GetDrugApplicationList?YHFarmerID=${YHFarmerID}&YHBatch=${BatchID}`).toPromise();
    }

    deleteByKey(key) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: key },
        };
        return this.http.delete(`${environment.yhProductionServer}/DrugOtherReceive`, options).toPromise();
    }
    create(data) {
        return this.http.post(`${environment.yhProductionServer}/DrugOtherReceive`, data).toPromise();
    }
    update(data) {
        return this.http.put(`${environment.yhProductionServer}/DrugOtherReceive`, data).toPromise();
    }
    getClosedInTheCurrent() {
        return this.http.get(`${environment.yhProductionReadServer}/GetClosedInTheCurrent`).toPromise();
    }
    getproductiondata(ProductID = '') {
        let initQuery = {
            EnterpriseID: USER_INFO_CONTEXT.enterpriseId,
            BatchMange: 1,//是否启用批次
            ProductID: ProductID,
        }
        return new DataSource({
            store: new CustomStore({
                load: (loadOptions) => {
                    return new Promise((resolve, reject) => {
                        this.http.post(`${environment.gatway.getproductiondata}`, initQuery).toPromise()
                            .then((res: any) => {
                                console.log('入库批号', res);

                                resolve(res.data)
                            })
                    })
                },
                byKey: (key) => {
                    return new Promise((resolve, reject) => {
                        this.http.post(`${environment.gatway.getproductiondata}`, initQuery).toPromise()
                            .then((result) => {
                                let arr = []
                                arr = result['data'].filter((item) => {
                                    return item.BatchID == key
                                })
                                resolve(arr)
                            })
                    });
                }
            }),
        })
    }

    // 栋舍
    getHenhouseByParam(Para: any) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetHenhouseByParam?` + Para).toPromise();
    }

    //弹框明细
    getQLWWarehouseStock(Para: any,ReceiveType:string) {
        if(ReceiveType==DataDictionary.ReceiveTypeA){
            return this.http.get(`${ODATA_URL_INFO.poultryProductOdataUrl}/GetQLWWarehouseStock?` + Para).toPromise();
        }
        else{
            return this.http.get(`${ODATA_URL_INFO.yhProductionOdataUrl}/GetTransferDatas?` + Para).toPromise();
        }
    }
    DrugotherReceiveTotal(params) {
        return this.http.get(`${environment.yhProductionServer}/DrugotherReceiveTotal${params}`).toPromise();
    }
    async getGetUnitPrice(Para: any) {
        return await this.http.get(`${ODATA_URL_INFO.yhProductionOdataUrl}/GetUnitPrice?` + Para).toPromise();
    }
}
