import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Injectable()
export class UploadViewService {
    qiniu_token: string;
    constructor(private tokenService: TokenAuthService, private http: HttpClient) {}

    getFiles(numericalOrder:string){
        return new DataSource({
            store: new ODataStore({
                url: `${environment.zlwProductionReadServer}/oq/BsFileQuery`,
                key: 'RecordId',
                keyType: 'Number',
                version: 4,
                beforeSend: (e) => {
                },
            }),
            filter: [['NumericalOrder ', '=',numericalOrder]]
        });
    }

    // async uploadAttach(fileList: FileList, key: string) {
    //     if (!fileList || fileList.length == 0) {
    //         return;
    //     }
    //     if (!this.qiniu_token) {
    //         const tokenResult = await this.getToken_qiniu();
    //         this.qiniu_token = tokenResult['data'];
    //     }

    //     const file = fileList[0];
    //     let formData: FormData = new FormData();
    //     formData.append('value', file, file.name);
    //     formData.append('file', file, file.name);
    //     formData.append('token', this.qiniu_token);
    //     formData.append('key', key);

    //     return this.http
    //         .post(`${environment.qianniuYunUploadUrl}`, formData, {
    //             headers: {
    //                 Accept: 'application/json',
    //             },
    //         })
    //         .toPromise();
    // }

    // //获取七牛上传token
    // async getToken_qiniu() {
    //     return await this.http
    //         .get(`${environment.qianniuYunTokenUrl}`, {
    //             withCredentials: false,
    //             headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    //         })
    //         .toPromise();
    // }
}
