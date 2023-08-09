import ODataStore from 'devextreme/data/odata/store';
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
        return {
            store: store,
            filter: dataSourceParams.filter,
            select: dataSourceParams.select,
            expand: dataSourceParams.expand,
            paginate: true,
            sort: dataSourceParams.sort,
            pageSize: dataSourceParams.pageSize ? dataSourceParams.pageSize : 10,
        };
    }
}
export class ODataContextBase {
    /**
     * OData 版本
     */
    protected version: number = 4;
    protected helper: OdataContextHelper = new OdataContextHelper();
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
    /**
     * 分段加载
     */
    pageSize?: number = 10;
    /**
     * 排序
     */
    sort?: Array<any>;
}
