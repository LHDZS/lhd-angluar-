import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USER_INFO_CONTEXT } from '../../context';

export class BatchSettingCommandService {
    constructor(private http: HttpClient) {}
    /**
     * 新增
     * @param data
     */
    post(data) {
        return this.http.post(`${environment.zlwBasicSettingServer}/BatchSet`, data).toPromise();
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
            body: { BatchIds: keys },
        };
        return this.http.delete(`${environment.zlwBasicSettingServer}/BatchSet`, options).toPromise();
    }
    /**
     * 修改
     * @param data
     */
    put(data) {
        return this.http.put(`${environment.zlwBasicSettingServer}/BatchSet`, data).toPromise();
    }
    /**
     * 关联批次
     * @param batchId
     * @param keys
     */
    relation(batchId, keys) {
        const data = {
            BatchId: batchId,
            PigIdList: keys,
        };
        return this.http.put(`${environment.zlwBasicSettingServer}/BatchSet/setsow`, data).toPromise();
    }
    /**
     * 结束批次状态
     */
    finish(BatchId, finishState) {
        return this.http
            .put(`${environment.zlwBasicSettingServer}/BatchSet/finish`, {
                BatchId,
                IsFinish: finishState,
            })
            .toPromise();
    }
    addProduct(params) {
        return this.http.post(`${environment.qlwProductService}/api/Product/add`, params).toPromise();
      }
    
}
