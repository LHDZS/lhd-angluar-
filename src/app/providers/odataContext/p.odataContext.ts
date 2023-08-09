import { Injectable } from '@angular/core';
import ODataContext from 'devextreme/data/odata/context';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from '../../shared/services';
import { ODataContextBase, DataSourceParamters } from './helper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PrintInput } from '../print';
import { USER_INFO_CONTEXT } from '../context';
import { DataDictionary, DataDictionarySource } from '../enums';
@Injectable()
export class ProductODataContext extends ODataContextBase {
    /**
     * 上下文对象
     */
    context: ODataContext;

    /**
     * 养殖标准
     */
    zqBreedStandardList: ODataStore;

    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();
        this.context = new ODataContext({
            url: this.poultryProductOdataUrl,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[ProductODataContext] Get ProductODataContext throw exception.');
            },
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
            entities: {
                ZqBreedStandardList: {
                    key: 'BreedStandardID',
                    keyType: 'String',
                }
            },
        });
        
        this.zqBreedStandardList = this.context['ZqBreedStandardList'];
        
    }

   
    /**
     * 获取养殖标准数据源
     * @param dataSourceParams
     */
    getZqBreedStandardDataSource(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.zqBreedStandardList, dataSourceParams);
    }
    
    /**
     * 打印服务
     */
    print(input: PrintInput) {
        var header = {};
        var result = this.http
            .post(`${environment.zlwPrintService}/api/print/pdf`, input, { headers: header, responseType: 'blob' })
            .toPromise()
            .then(function (res: any) {
                // .log(res);
                let url = window.URL.createObjectURL(res);
                window.open(url);
                // 创建a标签
                // let a = document.createElement('a')
                // a.style.display = 'none'
                // a.href = url
                // a.setAttribute('download', '分婉计划')
                // document.body.appendChild(a)
                // a.click();
                // a.remove();
            })
            .catch((reason) => {
                console.error('[PrintService] Failed.');
                console.error(reason);
            });
        // return this.http.post('https://localhost:44371/api/Print/pdf',data).toPromise();
    }
}

