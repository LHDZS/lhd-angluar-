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
import { YHFarmerMgmtRelateDto,YHFarmerConcertRelateDto } from './yhfarmerInformation.model';
import { EditorGridUtils } from 'src/app/components/editor-grid';

/**
 * 鸡场service
 */
@Injectable()
export class yhfarmerInformationService {
    //禽场类型
    PoultryFarmType: string;
    //禽场名称
    PoultryFarmDisplayText: string;
    //套餐类型
    comboPack: string = DataDictionary.ComboPackA;

    _settingUtil = new EditorGridUtils<YHFarmerMgmtRelateDto>('NumericalOrderDetail', 0);

    _actionUtil = new EditorGridUtils<YHFarmerConcertRelateDto>('NumericalOrderDetail', 0);

    qiniu_token: string;

    constructor(private tokenService: TokenAuthService,private http: HttpClient) {
        this.PoultryFarmType = this.getMenuChickenFarmType();
        this.PoultryFarmDisplayText = this.getMenuChickenFarmDisplayText();
    }

    get store() {
        return new ODataStore({
            url: `${environment.yhBasicSettingReadServer}/oq/YHFarmerInformationList`,
            // url: `${environment.poultryBasicSettingReadServer}/oq/BizChickenFarm`,
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
    /**
     * 修改一致人员状态
     * @param data
     */
    UpdateStatus(data) {
        return this.http.put(`${environment.yhBasicSettingServer}/YHFarmerInformation/UpdateStatus`, data).toPromise();
    }

    //根据手机号获取用户信息
    getUserInfoByPhone(id: any) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetUserInfoByPhone?Phone=${id}`).toPromise();
    }

    //根据手机号获取客户信息
    CustomerRefCommonOData(id: any) {
        // ?$filter=((Phone eq '${id}'))
        return this.http.get(`${environment.BaseCustomer}/customer/odata/CustomerRefCommonOData?$filter=((Phone eq '${id}'))`).toPromise();
    }

    //根据手机号查询养户信息
    GetYhFarmerInfomationByPhone(id: any) {
        // ?$filter=((Phone eq '${id}'))
        return this.http.get(`${environment.yhBasicSettingReadServer}/GetYhFarmerInfomationByPhone?Phone=${id}`).toPromise();
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
    /** 获取详情数据 */
    byKey(Para: any[]) {
        return this.http.get(`${environment.yhBasicSettingReadServer}/oq/YHFarmerInformationDetail?` + Para).toPromise();
    }
    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.yhBasicSettingServer}/YHFarmerInformation`, data).toPromise();
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
        return this.http.delete(`${environment.yhBasicSettingServer}/YHFarmerInformation`, options).toPromise();
    }

    deleteList(keys) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { NumericalOrder: keys },
        };
        return this.http.delete(`${environment.yhBasicSettingServer}/YHFarmerInformation`, options).toPromise();
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
        return this.http.put(`${environment.yhBasicSettingServer}/YHFarmerInformation`, data).toPromise();
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

    getActionSource() {
        return new DataSource({
            store: new CustomStore({
                key: 'NumericalOrderDetail',
                load: loadOptions => {
                    return this._actionUtil.items;
                },
                insert: data => {
                    this._actionUtil.push(data);
                    return Promise.resolve();
                },
                remove: (keys: any[]) => {
                    this._actionUtil.delete(keys);
                    return Promise.resolve();
                },
                update: (key, data) => {
                    this._actionUtil.update(key, data);
                    return Promise.resolve();
                },
            }),
        });
    }

    getSettingSource() {
        return new DataSource({
            store: new CustomStore({
                key: 'NumericalOrderDetail',
                load: loadOptions => {
                    return this._settingUtil.items;
                },
                insert: data => {
                    this._settingUtil.push(data);
                    return Promise.resolve();
                },
                remove: (keys: any[]) => {
                    this._settingUtil.delete(keys);
                    return Promise.resolve();
                },
                update: (key, data) => {
                    this._settingUtil.update(key, data);
                    return Promise.resolve();
                },
            }),
        });
    }

}
