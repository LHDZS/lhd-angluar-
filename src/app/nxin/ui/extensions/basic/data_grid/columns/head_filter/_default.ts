import { NxHeadFilter } from '.';

/**
 * 表格头过滤器
 */
export class NxHeadFilterImplement implements NxHeadFilter{
    /**
     * 是否允许搜索
     * @default true
     */
    allowSearch: boolean = true;
    /**
     * 高度
     */
    // height: number;
    /**
     * 搜索模式
     * @default 'contains'
     */
    searchMode: 'contains' | 'startswith' | 'equals' = 'contains';
    /**
     * 宽度
     */
    // width: number;
}