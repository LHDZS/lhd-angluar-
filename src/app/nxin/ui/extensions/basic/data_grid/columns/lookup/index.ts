import DataSource from 'devextreme/data/data_source';

export interface NxDataGridColumnLookup {
    enabled?: boolean;
    /**
     * 是否显示清空按钮
     * @default true
     */
    allowClearing?: boolean;
    /**
     * 数据源
     */
    dataSource?: Array<any> | DataSource;
    /**
     * 显示的值的字段名称
     */
    displayExpr?: Function | string;
    /**
     * 绑定值的字段名称
     */
    valueExpr?: string;
}
