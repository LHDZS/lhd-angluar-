import { NxDataGridColumnLookup } from '.';

export class NxDataGridColumnLookupimplement implements NxDataGridColumnLookup {
    enabled: boolean;
    /**
     * 是否显示清空按钮
     * @default true
     */
    allowClearing: boolean = true;
}