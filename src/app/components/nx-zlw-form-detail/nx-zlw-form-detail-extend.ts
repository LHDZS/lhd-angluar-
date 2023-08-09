import { NxToolbarPanel } from '../toolbar-panel/toolbar-panel-extend';
import { NxDataGrid } from '../component-model/data-grid/model';
import { NxSearchPanel } from '../search-panel/search-panel-extend';
import { NxReview } from '../review/review.extend';
import { NxCalc } from '../calc/model';

export class NxFormDetail {
    url: string = '';
    headerDataExpr: string = '';
    bodyDataExpr: string = '';
    permissionCode: number;
    toolbar: NxToolbarPanel = new NxToolbarPanel('detail');
    conditionPanel: NxSearchPanel = new NxSearchPanel();
    dataGrid: NxDataGrid = new NxDataGrid('detail');
    initialization: Function = null;
    remarks: NxRemarks = new NxRemarks();
    review: NxReview = new NxReview();
    calc: NxCalc = new NxCalc();
    reviewFun: Function = null;
    columnSettingDisabled: boolean = false;
}
export class NxRemarks {
    visible: boolean = true;
    dataField: string = 'Remarks';
    disabled: boolean = false;
}
