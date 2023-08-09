export class NxDataGridSummary {
    enabled: boolean = false;
    recalculateWhileEditing: boolean = true;
    calculateSummary:Function = () => {};
    totalItems: NxDataGridSummaryTotal[] = [];
}

export class NxDataGridSummaryTotal {
    constructor(column?: string, summaryType: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum' = 'sum',valueFormat:string='2') {
        if (column) {
            this.column = column;
        }
        this.summaryType = summaryType;
        this.valueFormat = valueFormat;
    }
    column: string;
    summaryType: 'avg' | 'count' | 'custom' | 'max' | 'min' | 'sum';
    displayFormat: string = '{0}';
    valueFormat:string ='2';
    customizeText: (itemInfo) => string;
}