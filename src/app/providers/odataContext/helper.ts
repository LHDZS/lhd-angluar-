import ODataStore from 'devextreme/data/odata/store';
import { environment } from 'src/environments/environment';
import { ODATA_URL_INFO } from './data';
export class OdataContextHelper {
    /**
     * 获取DataSource隐式数据源
     * @param store
     * @param filter
     * @param select
     * @param expand
     * @param pageSize
     */
    getDataSource(store: ODataStore, dataSourceParams: DataSourceParamters) {
        if (!dataSourceParams['hasOwnProperty']('paginate')) {
            dataSourceParams.paginate = true;
        }
        return {
            store: store,
            filter: dataSourceParams.filter,
            select: dataSourceParams.select,
            expand: dataSourceParams.expand,
            paginate: dataSourceParams.paginate,
            pageSize: dataSourceParams.pageSize ? dataSourceParams.pageSize : 15,
            group: dataSourceParams.group,
            customQueryParams: dataSourceParams.customQueryParams,
        };
    }
}
export class ODataContextBase {
    /**
     * OData 版本
     */
    protected version: number = 4;
    protected helper: OdataContextHelper = new OdataContextHelper();
    /**
     * 猪联网基础设置 OData URL
     */
    protected zlwBasicSettingOdataUrl: string = `${environment.zlwBasicSettingServer}/oq`;
    /**
     * 猪联网生产服务 OData URL
     */
    protected zlwProductionODataUrl: string = `${environment.zlwProductionServer}/oq`;
    /**
     * 猪联网母猪生产 OData URL
     */
    protected zlwProductionSowServer: string = `${environment.zlwProductionSowServer}/oq`;
    /**
     * 猪联网生产只读服务 OData URL
     */
    protected zlwProductReadODataUrl: string = `${environment.zlwProductionReadServer}/oq`;
    /**
     * 猪联网母猪生产只读服务 OData URL
     */
    protected zlwProductSowReadODataUrl: string = `${environment.zlwProductionSowReadServer}/oq`;
    /**
     * 育种模块公共接口
     */
    protected zlwBreedingServerODataUrl: string = `${environment.zlwBreedingServer}/oq`;
    /**
     * 物资模块公共接口
     */
    protected zlwMaterialsServerODataUrl: string = `${environment.zlwMaterialsManageServer}/oq`;
    /**
     *  禽联网基础设置 ODATA URL
     */
    protected poultryBasicSettingOdataUrl : string = ODATA_URL_INFO.poultryBasicSettingOdataUrl;

    /**
     *  禽联网生产单据 ODATA URL
     */
    protected poultryProductOdataUrl : string = ODATA_URL_INFO.poultryProductOdataUrl;

}
/**
 * DataSource参数
 */
export class DataSourceParamters {
    /**
     * 条件过滤
     * 示例：[['id','=','1'],['type','=','1']]
     */
    filter?: Array<any>;
    /**
     * 查询字段
     * 示例：['dataFieldA','dataFieldB']
     */
    select?: Array<any>;
    /**
     * 展开查询
     * 示例：['tableA','tableB']
     */
    expand?: Array<any>;
    /** 是否启用分页 */
    paginate?: boolean = true;
    /**
     * 分段加载
     */
    pageSize?: number = 15;
    /**
     * 分组
     */
    group?: any;
    /**
     * 自定义查询参数
     */
    customQueryParams?: any;
}
