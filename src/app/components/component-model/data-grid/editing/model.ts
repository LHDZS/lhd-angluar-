import { NxForm } from '../../form/mode';

export class NxDataGridEditing {
    enabled: Boolean = false;
    allowAdding: Boolean = false;
    allowDeleting: Boolean = false;
    allowUpdating: Boolean = true;
    mode: 'batch' | 'cell' | 'row' | 'form' | 'popup' = 'batch';
    refreshMode: 'full' | 'reshape' | 'repaint' = 'full';
    selectTextOnEditStart: Boolean = false;
    startEditAction: 'click' | 'dblClick' = 'click';
    useIcons: Boolean = false;
    form: NxForm = new NxForm();
}
export class NxDataGridEditingText {}
