import { environment } from 'src/environments/environment';
import ODataContext from 'devextreme/data/odata/context';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import { Injectable } from '@angular/core';
import { ODataContextBase, DataSourceParamters } from './helper';
import { HttpClient } from '@angular/common/http';
import DataSource from 'devextreme/data/data_source';
import { OptionTypeEnum } from '../../enums';
import { Result } from '../../result';
// import { USER_INFO_CONTEXT } from '../constant-context';

/**
 * 企联网公共下拉数据源
 */
@Injectable()
export class QlwODataContext extends ODataContextBase {
    private context: ODataContext;
    /**
     * 人员数据
     */
    personODataStore: ODataStore;

    constructor(private tokenService: TokenAuthService, private http: HttpClient) {
        super();
        this.context = new ODataContext({
            url: `${environment.qlwCommonService}/oq/`,
            version: this.version,
            errorHandler: (error) => {
                throw new Error('[QlwODataContext] Get QlwOdataContext throw exception.');
            },
            entities: {
                Qlw_ProductOData: {
                    key: 'ProductID',
                    keyType: 'String',
                },
                Qlw_PersonOData: {
                    key: 'UserID',
                    keyType: 'String',
                },
            },
        });
        this.personODataStore = this.context['Qlw_PersonOData'];
    }
    /**
     * 获取企联网人员数据源
     * @param dataSourceParams
     */
    getQlWPersonOData(dataSourceParams: DataSourceParamters = new DataSourceParamters()) {
        return this.helper.getDataSource(this.personODataStore, dataSourceParams);
    }
    /**
     * 获取省市县级联数据
     * @param parentId 省/市/区 id
     */
    getAreas(id?: string, name?: string, pid?: string) {
        let filter = `$filter=buse eq 1`;
        if (id) {
            filter += ` and areaid eq '${id}' `;
        }
        if (name) {
            filter += ` and contains(CAreaName, '${name}') `;
        }
        if (pid) {
            filter += ` and Pid eq '${pid}' `;
        }
        return this.http.get(`${environment.qlwSystemServerOq}/Bsarea?` + filter).toPromise();
    }

    private get getAreaData(): ODataStore {
        return new ODataStore({
            url: `${environment.qlwSystemServerOq}/Bsarea`,
            key: 'AreaID',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        });
    }

}
