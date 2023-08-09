import { NxDataGrid } from '../component-model/data-grid/model';
import { NxFormListHeaderPanelModel } from '../nx-form-list-header-panel/nx-form-list-header-panel.extend';

export class NxFormSingleModel {
    dataGrid: NxDataGrid = new NxDataGrid();
    headerPanel: NxFormListHeaderPanelModel = new NxFormListHeaderPanelModel();
}
