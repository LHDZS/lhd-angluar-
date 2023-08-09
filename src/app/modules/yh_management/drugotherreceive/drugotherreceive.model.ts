import { DataDictionary } from 'src/app/providers/enums';
export class DrugOtherReceive {
    /// <summary>
    /// 日期
    /// </summary>
    DataDate: string;
    ChickenFarmID: string = "0";
    YHFarmerID: string;
    YHBatch: string = '';
    Abstract: string;
    OutWarehouse: string;
    InWarehouse: string;
    BreedingID: string;
    CalcFeeStatus: Number = 0;
    Driver: string;
    ConfirmStatus: Number = 0;
    NumericalOrder: string;
    isbegin: boolean;
    Number: Number;
    ComboPack: string = DataDictionary.ComboPackA;
    ReceiveType: string;
    /// <summary>
    /// 备注
    /// </summary>
    Remarks: string;
    /// <summary>
    /// 详情数据
    /// </summary>
    DrugOtherReceiveDetailDto: Array<MaterialReceiveDetailDto> = [];
}
export class MaterialReceiveDetailDto {
    NumericalOrder: string;
    NumericalOrderDetail: string;
    NumericalOrderDetailSource: string;
    NumericalOrderSource: string;
    StandardPack: string;
    Specification: string;
    HenhouseID: string;
    ProductID: string;
    ProductBatchID: string;
    ProductionDate: string;
    Packages: Number;
    MeasureUnitName: string;
    UnitPrice: Number;
    AmountTotal: Number;
    Quantity: Number;
    Gift: boolean;
    BreedingID: string;
    DetailRemarks: string;
    Vendor: string;
    Target: Number;
}

const gridRefColumns: any = [
    {
        dataField: 'iSortPlusName',
        dataType: 'string',
        caption: '内置属性',
        width: '100',
        alignment: 'left',
        allowEditing: false,
        fixed: true,
        editorOptions: undefined
    }, {
        dataField: 'Amount',
        dataType: 'number',
        caption: '已领金额',
        width: '100',
        alignment: 'right',
        allowEditing: true,
        fixed: false,
        editorOptions: {
            type: 'fixedPoint',
            min: 0
        },
        precision: 2
    }, {
        dataField: 'ValueAmount2',
        dataType: 'number',
        caption: '按领苗计价数只均药费',
        width: '120',
        alignment: 'right',
        allowEditing: true,
        fixed: false,
        editorOptions: {
            type: 'fixedPoint',
            min: 0
        },
        precision: 2
    }, {
        dataField: 'ValueAmount',
        dataType: 'number',
        caption: '按领苗计价数应领金额',
        width: '120',
        alignment: 'right',
        allowEditing: true,
        fixed: false,
        editorOptions: {
            type: 'fixedPoint',
            min: 0
        },
        precision: 2
    }, {
        dataField: 'ValueBalance',
        dataType: 'number',
        caption: '按领苗计价数差额',
        width: '120',
        alignment: 'right',
        allowEditing: true,
        fixed: false,
        editorOptions: {
            type: 'fixedPoint',
            min: 0
        },
        precision: 2
    }, {
        dataField: 'TotalAmount2',
        dataType: 'number',
        caption: '按领苗总只数只均药费',
        width: '120',
        alignment: 'right',
        allowEditing: true,
        fixed: false,
        editorOptions: {
            type: 'fixedPoint',
            min: 0
        },
        precision: 2
    }, {
        dataField: 'TotalAmount',
        dataType: 'number',
        caption: '按领苗总只数应领金额',
        width: '120',
        alignment: 'right',
        allowEditing: true,
        fixed: false,
        editorOptions: {
            type: 'fixedPoint',
            min: 0
        },
        precision: 2
    }, {
        dataField: 'TotalBalance',
        dataType: 'number',
        caption: '按领苗总只数差额',
        width: '120',
        alignment: 'right',
        allowEditing: true,
        fixed: false,
        editorOptions: {
            type: 'fixedPoint',
            min: 0
        },
        precision: 2
    }
]

export { gridRefColumns }
