import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { DataDictionary } from 'src/app/providers/enums';

/**
 * 免疫程序
 */
@Injectable()
export class ContractService {
    constructor(private tokenService: TokenAuthService,private http: HttpClient) {}
    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.yhProductionServer}/FarmerContract`, data).toPromise();
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
        return this.http.delete(`${environment.yhProductionServer}/FarmerContract`, options).toPromise();
    }


    get store() {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHFarmerContract`,
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

    get DetailStore() {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhProductionOdataUrl}/YHFarmerContractHenhouseDetail`,
            key: 'GUID',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        })
    }

    get ChickenFarmStore() {
        return new ODataStore({
            url: `${environment.yhBasicSettingReadServer}/oq/YhChickenFarmRelateList`,
            // url: `${environment.poultryBasicSettingReadServer}/oq/BizChickenFarm`,
            key: 'ChickenFarmName',
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
            expand: [
            ],
            map: (r) => {
                r.ConcertPerson = r.ConcertPerson == "0" ? null : r.ConcertPerson;
                return r;
            }
        });
    }

    getDetailSource(): DataSource{
        return new DataSource({
            store: this.DetailStore,
            expand: [],
        })
    }

    getChickenFarmDataSource(): DataSource {
        return new DataSource({
            store: this.ChickenFarmStore,
            filter: [
                [['ComboPack', '=', DataDictionary.ComboPackA]],
                CHICKEN_FARM_CONTEXT.YHFarmTypeCondition
            ],
        });
    }

    /**
     * 修改表体
     * @param data
     */
    put(data) {
        return this.http.put(`${environment.yhProductionServer}/FarmerContract`, data).toPromise();
    }

    /** 获取详情数据 */
    byKey(Para: any[]) {
        return this.http.get(`${ODATA_URL_INFO.yhProductionOdataUrl}/YHFarmerContractHenhouseDetail?` + Para).toPromise();
    }

    GetHenhousesByChickenFarmID(ID: string) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/YhChickenFarmRelateDetail?ChickenFarmID=` + ID).toPromise();
    }

    // 获取省市县地址下拉数据
    async address(id,typeId:number=0) {
        return await this.http
        .get(
        `${environment.ylwBasicSettingServer}/AreaQuery/GetAreaQueryById?id=${id}&Type=${typeId}`,
        )
        .toPromise()
    }

    get YHFarmerStore() {
        return new ODataStore({
            url: `${environment.yhBasicSettingReadServer}/oq/YHFarmerInformation`,
            // url: `${environment.poultryBasicSettingReadServer}/oq/BizChickenFarm`,
            key: 'YHFarmerID',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        });
    }

    getYHFarmerDataSource(): DataSource {
        return new DataSource({
            store: this.YHFarmerStore,
        });
    }

    async HenhouseCanDelete(numericalOrder, henhouseID){
        return await this.http.get(
                `${environment.yhProductionReadServer}/GetContractHenhouseDeleteAble?ContractNumericalOrder=${numericalOrder}&HenhouseID=${henhouseID}`
            )
            .toPromise();
    }

    async GetFarmerConcertPeople(YHFarmerID: String)
    {
        return await this.http.get(
            `${environment.yhProductionReadServer}/GetFarmerConcertPeople?YHFarmerID=${YHFarmerID}`
        )
        .toPromise();
    }
}
