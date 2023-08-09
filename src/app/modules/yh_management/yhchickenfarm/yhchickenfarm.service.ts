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
import { FormOptions } from 'src/app/providers/enums';
import {BasicSettingODataContext} from 'src/app/providers/odataContext';

/**
 * 鸡场service
 */
@Injectable()
export class yhchickenfarmService {
    warehouseSource: any = [];
    ChickenFarmNameAll: any = [];
    //禽场类型
    PoultryFarmType: string;
    //禽场名称
    PoultryFarmDisplayText: string;
    //套餐类型
    comboPack: string = DataDictionary.ComboPackA;

    qiniu_token: string;

    constructor(private tokenService: TokenAuthService,private http: HttpClient,private basicSettingODataContext: BasicSettingODataContext) {
        this.PoultryFarmType = this.getMenuChickenFarmType();
        this.PoultryFarmDisplayText = this.getMenuChickenFarmDisplayText();
        this.warehouseSource = this.basicSettingODataContext.getWareHouseDataSource({
            select: ['WarehouseID', 'WarehouseName'],
        });
    }

    get store() {
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

    /**
     * 根据菜单得到鸡场类型
     * @returns 鸡场类型
     */
    private getMenuChickenFarmType() {
        if (AppIdDataRel.ChickenFarmPoultryAppId == USER_INFO_CONTEXT.menuId) {
            return DataDictionary.FarmTypeA;
        }else if (AppIdDataRel.ChickenFarmHatcheryAppId == USER_INFO_CONTEXT.menuId) {
            return DataDictionary.FarmTypeB;
        }else {
            return '';
        }
    }

    private getMenuChickenFarmDisplayText() {
        if (AppIdDataRel.ChickenFarmPoultryAppId == USER_INFO_CONTEXT.menuId) {
            return AppIdDataRel.ChickenFarmPoultryAppIdText;
        }else if (AppIdDataRel.ChickenFarmHatcheryAppId == USER_INFO_CONTEXT.menuId) {
            return AppIdDataRel.ChickenFarmHatcheryAppIdText;
        }else {
            return '';
        }

    }

    // getDataSource(): DataSource {
    //     return new DataSource({
    //         store: this.store,
    //         expand: [

    //         ],
    //     });
    // }

    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.yhBasicSettingServer}/YhChickenFarmRelate`, data).toPromise();
    }
    /**
     * 栋舍新增
     * @param data
     */
    HenHousePost(data) {
        return this.http.post(`${environment.yhBasicSettingServer}/YhHenHouseRelate`, data).toPromise();
    }
    /**
     * 栋舍修改
     * @param data
     */
    HenHousePut(data) {
        return this.http.put(`${environment.yhBasicSettingServer}/YhHenHouseRelate`, data).toPromise();
    }
    getLastPoultryCategory() {
        // ?$filter=((Phone eq '${id}'))
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetLastPoultryCategory`).toPromise();
    }
    /**
     * 栋舍删除
     * @param data
     */
    HenHouseDel(key: string) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { HenHouseID: key },
        };
        return this.http.delete(`${environment.yhBasicSettingServer}/YhHenHouseRelate`, options).toPromise();
        // return this.http.delete(`${environment.yhBasicSettingServer}/YhHenHouseRelate`, data).toPromise();
    }
    /** 获取详情数据 */
    byKey(Para: any[]) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/YhChickenFarmRelateDetail?` + Para).toPromise();
    }
    /** 获取最近养殖场类型 */
    YHFarmType() {
        return this.http.get(`${environment.yhBasicSettingReadServer}/YhChickenFarmRelateYHFarmType`).toPromise();
    }
    /** 本集团养殖场名称 */
    AllName() {
        return this.http.get(`${environment.yhBasicSettingReadServer}/oq/YhChickenFarmRelateAllName`).toPromise();
    }
    //场区新增/修改
    saveZoning(data): Promise<any> {
        // if (option == FormOptions.$create) {
            return this.http.post(`${environment.poultryBasicSettingServer}/Zoning`, data).toPromise(); //https://localhost:5003
        // } else {
        //     return this.http.put(`${environment.poultryBasicSettingServer}/Zoning`, data).toPromise();
        // }
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
        return this.http.delete(`${environment.yhBasicSettingReadServer}/YhChickenFarmRelate/updateStatus`, options).toPromise();
    }
    //停用 启用。
    operation(data: { Status: boolean; ChickenFarmID: string }) {
        return this.http.put(`${environment.yhBasicSettingServer}/YhChickenFarmRelate/updateStatus`, data).toPromise();;
    }

    deleteList(keys: any[]) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { DeleteList: keys },
        };
        return this.http.delete(`${environment.yhBasicSettingReadServer}/YhChickenFarmRelate/updateStatus`, options).toPromise();
    }
    // 获取省市县地址下拉数据
    async address(id,typeId:number=0) {
        return await this.http
        .get(
        `${environment.ylwBasicSettingServer}/AreaQuery/GetAreaQueryById?id=${id}&Type=${typeId}`,
        )
        .toPromise()
    }
    /**
     * 修改
     * @param data
     */
    put(data) {
        return this.http.put(`${environment.yhBasicSettingServer}/YhChickenFarmRelate`, data).toPromise();
    }

    // public get(key: any): Promise<any> {

    //     // return this.http.get(`${environment.poultryBasicSettingServer}/oq/BizZqbatch/GetDetail?BatchID=${key}`).toPromise();
    //     // return this.http.get(`${environment.poultryBasicSettingServer}/api/LambFile/GetProductionRecords?PigId=${id}`).toPromise();
    // }

    async uploadAttach(fileList: FileList, key: string) {
        if (!fileList || fileList.length == 0) {
          return;
        }
        if (!this.qiniu_token) {
          const tokenResult = await this.getToken_qiniu();
          this.qiniu_token = tokenResult["data"];
        }

        const file = fileList[0];
        let formData: FormData = new FormData();
        formData.append('value', file, file.name);
        formData.append('file', file, file.name);
        formData.append('token', this.qiniu_token);
        formData.append('key', key);

        return this.http.post(`${environment.qianniuYunUploadUrl}`, formData, {
          headers: {
            "Accept": "application/json"
          }
        }).toPromise();
    }

      //获取七牛上传token
    async getToken_qiniu() {
    return await this.http
      .get(`${environment.qianniuYunTokenUrl}`, {
        withCredentials: false,
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      })
      .toPromise();
  }

}
