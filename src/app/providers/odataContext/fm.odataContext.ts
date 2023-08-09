import { Injectable } from '@angular/core';
import ODataContext from 'devextreme/data/odata/context';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from '../../shared/services';
import { ODataContextBase, DataSourceParamters } from './helper';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable()
export class FmODataContext extends ODataContextBase {
    /**
     * 上下文对象
     */
    context: ODataContext;

    /**
     * 费用项目
     */
    FM_CostProjectOData: ODataStore;

    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();
        this.context = new ODataContext({
            url: `${environment.costManagementServer}/oq`,
            version: this.version,
            errorHandler: (error) => {
                console.error(error);
                throw new Error('[FmODataContext] Get FmODataContext throw exception.');
            },
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
            entities: {
                FM_CostProjectOData: {
                    key: 'CostProjectId',
                    keyType: 'String',
                }
            },
        });

        this.FM_CostProjectOData = this.context['FM_CostProjectOData'];
    }


    /**
     * 获取费用项目数据源
     * @param dataSourceParams
     */
    getFM_CostProjectOData(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.FM_CostProjectOData, dataSourceParams);
    }
}

