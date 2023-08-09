export class NxDataGridKeyboardNavigation {
    editOnKeyPress: Boolean = true;
    enabled: Boolean = true;
    enterKeyAction: 'startEdit' | 'moveFocus' = 'moveFocus';
    enterKeyDirection: 'none' | 'column' | 'row' = 'none';
}
