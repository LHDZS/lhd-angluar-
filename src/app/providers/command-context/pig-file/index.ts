import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { DataSourceAccessor } from '../../common/DataSourceAccessor';
import { FormOptions, PigType } from '../../enums';
import { USER_INFO_CONTEXT } from '../../context';

/**
 * 公/母/肥档案通用Command
 */
@Injectable()
export class PigFileCommandService {
    constructor(private http: HttpClient, private dataSourceAccessor: DataSourceAccessor) {}
    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.zlwBasicSettingServer}/PigFile`, data).toPromise();
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
            body: { PigId: keys },
        };
        return this.http.delete(`${environment.zlwBasicSettingServer}/PigFile`, options).toPromise();
    }
    /**
     * 修改
     * @param data
     */
    put(data) {
        return this.http.put(`${environment.zlwBasicSettingServer}/PigFile`, data).toPromise();
    }
    save(data, $option: FormOptions,$pigtype: PigType) {
        if($pigtype==PigType.Boar)
        {
            data['Gender'] = 1;
        }else
        {
            data['Gender'] = 0;
        }
        data['PigType'] =$pigtype;//公猪
        if ($option == FormOptions.$create) {
            return this.http.post(`${environment.zlwBasicSettingServer}/PigFile`, data).toPromise();
        } else {
            return this.http.put(`${environment.zlwBasicSettingServer}/PigFile`, data).toPromise();
        }
    }
    getPedigree(pigid) {
        return this.http
            .post(`${environment.zlwBasicSettingServer}/PigFile/GetPedigree`, {
                pigid: pigid,
            })
            .toPromise();
    }
    getCustomDataSource() {
        return this.dataSourceAccessor.getCustomDataStore({
            url: `${environment.zlwBasicSettingServer}/oq/BizPigExpandSql`,
            key: 'PigId',
            keyType: 'String',
        });
    }
    addProduct(params) {
        return this.http.post(`${environment.qlwProductService}/api/Product/add`, params).toPromise();
      }
   
}
