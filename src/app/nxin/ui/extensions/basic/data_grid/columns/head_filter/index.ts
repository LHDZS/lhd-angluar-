import DataSource from 'devextreme/data/data_source';

export interface NxHeadFilter{
    /**
     * 是否允许搜索
     * @default true
     */
    allowSearch?: boolean;
    /**
     * 数据源
     */
    dataSource?: Array<any> | DataSource;
    /**
     * 指定标题过滤器如何将值组合到组中
     */
    groupInterval?: number | string;
    /**
     * 高度
     */
    height?: number;
    /**
     * 搜索模式
     * @default 'contains'
     */
    searchMode?: 'contains' | 'startswith' | 'equals';
    /**
     * 宽度
     */
    width?: number;
}