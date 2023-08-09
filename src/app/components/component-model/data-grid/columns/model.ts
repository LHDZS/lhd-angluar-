import { NxDataGridColumnValidationRule } from './validation-rule/model';
import { NxDataGridColumnCellTemplate, NxDataGridColumnCellLinkTemplate } from './template/model';

export class NxDataGridColumn {
    props: DataGridColumnProps = new DataGridColumnProps();
    events: DataGridColumnEvents = new DataGridColumnEvents();
    validationRules: NxDataGridColumnValidationRule[] = [];
    constructor(
        caption?: string,
        dataField?: string,
        dataType?: string,
        calculateDisplayValue?: string,
        requiredDisable?: boolean
    ) {
        if (caption) {
            this.props.caption = caption;
            this.props.showCaption = caption;
        }
        if (dataField) this.props.dataField = dataField;
        if (dataType) this.props.dataType = dataType;
        if (calculateDisplayValue) this.props.calculateDisplayValue = calculateDisplayValue;
        if (requiredDisable) this.props.requiredDisable = requiredDisable;
    }
}
export class CommandColumn {
    props: CommandColumnProps = new CommandColumnProps();
    visible: boolean = true;
    useDefault: boolean = true;
    deleteButton: CommandColumnDelete = new CommandColumnDelete();
    editButton: CommandColumnEdit = new CommandColumnEdit();
    trashButton: CommandColumnTrash = new CommandColumnTrash();
    copyRowButton: CommandColumnCopyRow = new CommandColumnCopyRow();
    addRowButton: CommandColumnAddRow = new CommandColumnAddRow();
    insertRowButton: CommandColumnInsert = new CommandColumnInsert();
    customs: NxDataGridCommandColumnCustomItem[] = [];
}
export class NxDataGridCommandColumnCustomItem {
    label: string | ((row: any) => string) | any;
    onClick: Function = () => {};
    isVisible: Function = null;
    isAbled: Function = (e) => {
        return true;
    };
}
export class CommandButton {
    visible: boolean = true;
    onClick: Function = null;
    statusCtrl: Function = null;
}
export class CommandColumnProps {
    width: number | string = 130;
}
export class CommandColumnAddRow extends CommandButton {
    constructor() {
        super();
    }
    /**
     * @param data 新增行数据
     */
    onClick: (data: any) => void;
}
export class CommandColumnCopyRow extends CommandButton {
    constructor() {
        super();
    }
    /**
     * 复制行单击事件
     * @param target 插入行索引
     * @param data 行数据
     * @param direction 插入方向
     */
    onClick: (target: number, data: any, direction: 'top' | 'bottom') => void;
}
export class CommandColumnTrash extends CommandButton {
    constructor() {
        super();
    }
}
export class CommandColumnEdit extends CommandButton {
    constructor() {
        super();
    }
    text:string = ''
}
export class CommandColumnDelete extends CommandButton {
    constructor() {
        super();
    }
    confirmText:string = '';
    text:string = '';
    enabled: boolean = true;
    confirm: Function = null;
    cancel: Function = null;
}
export class CommandColumnInsert extends CommandButton {
    constructor() {
        super();
    }
    /**
     * 插入行单击事件
     * @param target 插入行索引
     * @param data 行数据
     * @param direction 插入方向
     */
    onClick: (target: number, data: any, direction: 'top' | 'bottom' | 'unshift') => void;
}
export class DataGridColumnProps {
    alignment: 'undefined' | 'center' | 'left' | 'right' = 'left';
    maxZoomLevel: string = '';
    allowEditing: boolean = true;
    allowExporting: boolean = true;
    allowFiltering: boolean = true;
    allowFixing: boolean = true;
    allowGrouping: boolean = true;
    allowHeaderFiltering: boolean = false;
    allowHiding: boolean = true;
    allowReordering: boolean = true;
    allowResizing: boolean = true;
    allowSearch: boolean = true;
    allowSorting: boolean = true;
    autoExpandGroup: boolean = true;
    calculateCellValue: Function;
    calculateDisplayValue: string | Function;
    calculateGroupValue: string | Function;
    calculateSortValue: string | Function;
    calculateFilterExpression: Function = null;
    caption: string = '';
    showCaption: string = '';
    cellTemplate: NxDataGridColumnCellTemplate = new NxDataGridColumnCellTemplate();
    cellLinkTemplate: NxDataGridColumnCellLinkTemplate = new NxDataGridColumnCellLinkTemplate();
    cssClass: string;
    dataField: string;
    dataType: string;
    editorOptions: object;
    encodeHtml: boolean = true;
    falseText: string = 'false';
    trueText: string = 'true';
    showEditorAlways: boolean = false;
    /**
     * 行内过滤条件
     */
    filterOperations: Array<
        | '='
        | '<>'
        | '<'
        | '<='
        | '>'
        | '>='
        | 'contains'
        | 'endswith'
        | 'isblank'
        | 'isnotblank'
        | 'notcontains'
        | 'startswith'
        | 'between'
        | 'anyof'
        | 'noneof'
    >;
    filterType: string = 'include';
    filterValue: any;
    filterValues: Array<any>;
    fixed: boolean = false;
    fixedPosition: 'left' | 'right';
    format: any = '';
    max: any = '';
    hidingPriority: number;
    isBand: boolean;
    lookup: DataGridColumnLookup = new DataGridColumnLookup();
    width: number;
    minWidth: number;
    name: string;
    setCellValue: Function;
    visible: boolean = true;
    selectedFilterOperation:
        | '='
        | '<>'
        | '<'
        | '<='
        | '>'
        | '>='
        | 'contains'
        | 'endswith'
        | 'isblank'
        | 'isnotblank'
        | 'notcontains'
        | 'startswith'
        | 'between'
        | 'anyof'
        | 'noneof';
    sortOrder: undefined | 'asc' | 'desc';
    sortIndex: Number;
    headerCellTemplateName: string;
    headerHelpEnabled: boolean = false;
    headerHelpMessage: string;
    HeaderRequiredIcon: boolean = false;
    required: boolean = false;
    requiredDisable?: boolean = false;
    customizeText: Function = null;
    hasTooltip: boolean = false;
    tooltipTitle: string;
    tooltipClick: Function;
    showClearButton: boolean = false;
}
export class DataGridColumnEvents {
    calculateCellValue: Function = null;
}
export class DataGridColumnLookup {
    enabled: boolean = false;
    allowClearing: boolean = false;
    dataSource: any;
    displayExpr: string;
    valueExpr: string;
    showClearButton: boolean = false;
}
