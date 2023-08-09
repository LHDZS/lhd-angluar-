import { Component, ViewChild } from '@angular/core';
import { NxFormDetail } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail-extend';
import { NxZlwFormDetailComponent } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { ActivatedRoute } from '@angular/router';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxConditionItem } from 'src/app/components/search-panel/search-panel-extend';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { DataStatus, FormOptions,DataDictionary,DataDictionarySource } from 'src/app/providers/enums';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { NxDataGridSummaryTotal } from 'src/app/components/component-model/data-grid/summary/model';
import {
    QlwODataContext,
    BasicSettingODataContext,
    QlwCustomerContext,
    YHBasicSettingODataContext,
    YHProductionODataContext
} from 'src/app/providers/odataContext';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { NxDataGridColumnValidationRule } from 'src/app/components/component-model/data-grid/columns/validation-rule/model';
import { RegExps } from 'src/app/providers/regexp';
import { DateTime } from 'src/app/providers/common/datetime';
import { DrugOtherReceiveService } from '../drugotherreceive.service';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { TokenAuthService } from 'src/app/shared/services';
import { DrugOtherReceive, gridRefColumns } from '../drugotherreceive.model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { groupBy } from 'src/app/providers/groupby';
import { PrintPageComponent } from 'nxin-print';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { Distinct, dealBigMoney } from 'src/app/providers/distinct';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { ToolbarPanelType } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import DataSource from 'devextreme/data/data_source';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { NxDropDownButtonItem } from 'src/app/components/component-model/drop-down-button/model';

@Component({
    selector: 'drugotherreceive-detail',
    templateUrl: './drugotherreceive-detail.component.html',
    styleUrls: ['./drugotherreceive-detail.component.scss'],
})
export class DrugOtherReceiveDetailComponent {
    @ViewChild('detailInstance', { static: false })
    detailInstance: NxZlwFormDetailComponent;
    @ViewChild('citeDetailGrid', { static: false })
    citeDetailGrid: DxDataGridComponent;
    model: NxFormDetail = new NxFormDetail();
    /**
     * 流水号
     */
    numericalOrder: string;
    @ViewChild('dataGrid', { static: false })
    dataGrid: DxDataGridComponent;

    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;

    @ViewChild('gridRef2', { static: false })
    dataGridRef2: DxDataGridComponent;
    TotalFormData : any={
        TotalDataDate:"",
        TotalQuantity:"",
        TotalValueQuantity:"",
        TotalYHBatchName:"",
        TotalBreedingName:"",
        TotalOneMedicineFee:""
    };
    outVisible2: boolean = false;
    batchSource: any = [];
    productSource: any;
    currentCount: number = 0;
    iNumericalOrderPlan: string = '0';
    dataDateFlag: boolean = false;
    pcDate: string;
    DaysOld: Number;
    outVisible: boolean = false;
    popTitle: string;
    editFlag : boolean = false;
    HenhouseSourceall:any = [];
    cProductNameSource: any;
     //打印
     menu_id: string;
     environment: any;
     tokenData: any;
     @ViewChild('printPage', { static: false })
     _printPage: PrintPageComponent;
     printDataSource:any=[];

    //弹出框数据
    formData: any = {
        CommonName: '',
        ProductID: ''
    };
    $form: boolean = false;
    AutoDataSource: any;
    AutoDataSourceFilter: any;
    lingliaoDataSource: any;
    selectedRows: any = [];
    OutHouseNameSource: any;

    loading: boolean = false;
    YHFarmerContract: string;

    citeVisible: boolean = false;
    ReferenceStateSource: any = [
        {
            name: '未领用',
            value: 0
        },
        {
            name: '已领用',
            value: 1
        }
    ];
    citeDataSourceAll: any;
    citeDataSource: any;
    citeSelectedRows: any = [];
    colorStatusArr: any = {
        0:{color:'#F56C6C'},
        1:{color:'#67C23A'},
    };
    citeFormData: any = {};
    YHFarmerSource: any;
    BatchSourceAll: any;
    BatchSource: any;
    FarmerDisabled: boolean = false;
    BatchDisabled: boolean = false;

    //弹出框表格数据存储
    storageKey: string = 'drugotherreceive-batch-grid2';
    gridRefColumns: any = gridRefColumns;
    //#endregion
    constructor(
        private route: ActivatedRoute,
        private service: DrugOtherReceiveService,
        private http: HttpClient,
        private qlwOdataContext: QlwODataContext,
        private tokenService: TokenAuthService,
        private basicSettingODataContext: BasicSettingODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private StatusODataContext: StatusODataContext,
        private translator: TranslateService
    ) {
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.model.initialization = this.initialization.bind(this);
        this.init_data_grid().init_table_header().init_toolbar_panel();
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
        this.YHFarmerSource = this.yhBasicSettingODataContext.getYHFarmerInfoDataSource();
        this.yhBasicSettingODataContext.YHBatch.load().then((res:any) => {
            this.BatchSourceAll = res;
        })
        this.cProductNameSource = this.basicSettingODataContext.getBizProductannexedDataSource({
            filter: [
                [['iSortPlus', '=', DataDictionary.iSortB],
                'or',
                ['iSortPlus', '=', DataDictionary.iSortC],
                'or',
                ['iSortPlus', '=', DataDictionary.iSortE]],
            ],
            select: ['ProductID', 'cProductName'],
        });

        //弹出框表格数据存储
        this.customStateStoringSave = this.customStateStoringSave.bind(this);
        this.customStateStoringLoad = this.customStateStoringLoad.bind(this);
    }

    //弹出框表格数据存储 函数
    customStateStoringSave(e) {
        this.detailInstance.customStateStoringSave(e);
    }

    customStateStoringLoad(e) {
        this.detailInstance.customStateStoringLoad()
    }

    // 下拉数据控制
    giveDataSource(name) {
        return this[name]
    }

    // calss 类控制
    classType(item) {
        let str = []
        if (item.HeaderRequiredIcon) {
            str.push('required')
        }
        if (item.allowEditing === false) {
            str.push('disabled')
        }
        if (item.cellTemplate) {
            str.push("dx-editor-cell")
        }
        return str.join(' ')
    }

    onFieldDataChanged(e) {
        let DataDate = new Date(this.model.conditionPanel.data['DataDate']);
        switch (e.dataField) {
            case 'YHFarmerID' :
                let farmer = e.value || '0';
                var YHBatch = this.citeFormData.YHBatch || '0';
                this.getFormDataSource(farmer,YHBatch);
                this.getDrugApplicationSource(farmer,YHBatch);
                if (e.value) {
                    this.BatchSource = this.BatchSourceAll.filter( o => o.YHFarmerID === farmer && new Date(o.TransferDate) <= DataDate);
                } else {
                    this.BatchSource = [];
                }
                break;
            case 'YHBatch' :
                let batch = e.value || '0';
                var YHFarmerID = this.citeFormData.YHFarmerID || '0';
                this.getFormDataSource(YHFarmerID,batch);
                this.getDrugApplicationSource(YHFarmerID,batch);
                break;
            case 'LyStatus' :
                var LyStatus = Number(e.value);
                this.citeDataSource = this.citeDataSourceAll.filter( o => o.LyStatus === LyStatus);
                break;
            default:
                break;
        }
    }

    // 状态色值
    typeColor(type) {
        return this.colorStatusArr[type]
    }

    //#region 初始化表格
    init_data_grid(): DrugOtherReceiveDetailComponent {
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.stateStoring.storageKey = 'DrugOtherReceive-detail';
        this.model.dataGrid.stateStoring.enabled = true;
        this.model.dataGrid.columns.push(...this.columns);
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.summary.enabled = true;
        const summaryItem_total_Packages = new NxDataGridSummaryTotal();
        summaryItem_total_Packages.column = 'Packages';
        summaryItem_total_Packages.summaryType = 'sum';
        summaryItem_total_Packages.valueFormat = '4';

        const summaryItem_total_DeliveryTotal = new NxDataGridSummaryTotal();
        summaryItem_total_DeliveryTotal.column = 'Quantity';
        summaryItem_total_DeliveryTotal.summaryType = 'sum';
        summaryItem_total_DeliveryTotal.valueFormat = '4';

        const summaryItem_total_AmountTotal = new NxDataGridSummaryTotal();
        summaryItem_total_AmountTotal.column = 'AmountTotal';
        summaryItem_total_AmountTotal.summaryType = 'sum';
        summaryItem_total_AmountTotal.valueFormat = '2';

        this.model.dataGrid.summary.totalItems = [summaryItem_total_Packages, summaryItem_total_DeliveryTotal,summaryItem_total_AmountTotal];
        this.model.dataGrid.paginate.pager.visible = 'auto';
        this.model.dataGrid.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);
        this.model.dataGrid.events.onCellClick = (e) => { };
        return this;
    }

    get columns() {

        //商品代号
        const col_ProductID = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.ProductName.text,
            'ProductID',
            'string',
            'ProductName'
        );
        col_ProductID.props.width = 130;
        col_ProductID.props.requiredDisable = true;
        col_ProductID.props.lookup.enabled = true;
        col_ProductID.props.allowEditing = true;
        col_ProductID.props.HeaderRequiredIcon = true;
        col_ProductID.props.lookup.dataSource = this.basicSettingODataContext.getProductDataSource({
            filter: [
                [
                    ['iSortPlus', '=', DataDictionary.iSortB],
                    'or',
                    ['iSortPlus', '=', DataDictionary.iSortC],
                    'or',
                    ['iSortPlus', '=', DataDictionary.iSortE],
                ]
            ],
        });
        const col_ProductID_required = new NxDataGridColumnValidationRule('required');
        col_ProductID_required.message = this.translator.I18N.DrugOtherReceiveDetail.ProductName.required;
        col_ProductID.validationRules.push(...[col_ProductID_required]);
        col_ProductID.props.lookup.allowClearing = true;
        col_ProductID.props.lookup.valueExpr = 'ProductID';
        col_ProductID.props.lookup.displayExpr = 'ProductName';
        col_ProductID.props.setCellValue = this.setProductValue.bind(this);

        const col_CommonName = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.CommonName.text,
            'CommonName',
            'string'
        );
        col_CommonName.props.width = 120;
        col_CommonName.props.cssClass = 'disabled';
        col_CommonName.props.allowEditing = false;

        const col_Specification = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.Specification.text,
            'Specification',
            'string'
        );
        col_Specification.props.cssClass = 'disabled';
        col_Specification.props.allowEditing = false;
        col_Specification.props.width = 80;

        const col_bIsStandardPack = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.bIsStandardPack.text,
            'bIsStandardPackText',
            'boolean'
        );
        col_bIsStandardPack.props.cssClass = 'disabled';
        col_bIsStandardPack.props.allowEditing = false;
        col_bIsStandardPack.props.width = 80;

        const col_StandardPack = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.StandardPack.text,
            'StandardPack',
            'string'
        );
        col_StandardPack.props.cssClass = 'disabled';
        col_StandardPack.props.alignment = 'right';
        col_StandardPack.props.allowEditing = false;
        col_StandardPack.props.width = 80;

        const col_ProductBatchID = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.ProductBatchID.text,
            'ProductBatchID',
            'string',
            'ProductBatchName'
        );
        col_ProductBatchID.props.width = 120;
        col_ProductBatchID.props.requiredDisable = true;
        col_ProductBatchID.props.lookup.enabled = true;
        col_ProductBatchID.props.allowEditing = true;
        col_ProductBatchID.props.HeaderRequiredIcon = false;
        col_ProductBatchID.props.lookup.dataSource = []
        col_ProductBatchID.props.lookup.allowClearing = true;
        col_ProductBatchID.props.lookup.valueExpr = 'BatchID';
        col_ProductBatchID.props.lookup.displayExpr = 'BatchNumber';
        col_ProductBatchID.props.calculateCellValue = (rowData) => {
            return rowData.ProductBatchID == '0' ? '' : rowData.ProductBatchID
        };

        const col_ProductionDate = new NxDataGridColumn(this.translator.I18N.DrugOtherReceiveDetail.ProductionDate.text, 'ProductionDate', 'string');
        col_ProductionDate.props.allowEditing = false;
        col_ProductionDate.props.cssClass = 'disabled';
        col_ProductionDate.props.width = 100;

        const col_ProductValidity = new NxDataGridColumn(this.translator.I18N.DrugOtherReceiveDetail.ProductValidity.text, 'ProductValidity', 'string');
        col_ProductValidity.props.alignment = 'right';
        col_ProductValidity.props.allowEditing = false;
        col_ProductValidity.props.cssClass = 'disabled';
        col_ProductValidity.props.width = 100;

        const col_ValidDate = new NxDataGridColumn(this.translator.I18N.DrugOtherReceiveDetail.ValidDate.text, 'ValidDate', 'string');
        col_ValidDate.props.allowEditing = false;
        col_ValidDate.props.cssClass = 'disabled';
        col_ValidDate.props.calculateCellValue = (rowData) => {
            if (rowData.ProductBatchName) {
                return rowData.ValidDate;
            } else {
                return null
            }
        };
        col_ValidDate.props.width = 100;

        //件数
        const col_Packages = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.Packages.text,
            'Packages',
            'number'
        );
        col_Packages.props.width = 100;
        col_Packages.props.alignment = 'right';
        col_Packages.props.allowEditing = true;
        const col_Packages_pattern = new NxDataGridColumnValidationRule();
        col_Packages_pattern.type = 'pattern';
        col_Packages_pattern.pattern = RegExps.AllNumber4;
        col_Packages_pattern.message = this.translator.I18N.DrugOtherReceiveDetail.Packages.patternMessage;
        col_Packages.validationRules.push(...[col_Packages_pattern]);
        col_Packages.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    var StandardPack = oldData['StandardPack'];
                    var bIsStandardPack = oldData['bIsStandardPack'];

                    m['Packages'] = value;

                    if (StandardPack && bIsStandardPack) {
                        m['Quantity'] = (value*StandardPack).toFixed(4);
                        var AmountTotal = 0;
                        var Quantity = value*StandardPack;
                        if(oldData.UnitPrice){
                            AmountTotal = Number(oldData.UnitPrice) * Quantity;
                        }
                        if (m['Gift']) {
                            m['AmountTotal'] = 0;
                            m['UnitPrice'] = 0;
                        } else {
                            m['AmountTotal'] = AmountTotal.toFixed(4);
                        }
                    }
                }
            });
        }

        //数量
        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.Quantity.text,
            'Quantity',
            'number'
        );
        col_Quantity.props.width = 100;
        col_Quantity.props.alignment = 'right';
        col_Quantity.props.allowEditing = true;
        col_Quantity.props.HeaderRequiredIcon = false;
        const col_Quantity_pattern = new NxDataGridColumnValidationRule();
        col_Quantity_pattern.type = 'pattern';
        col_Quantity_pattern.pattern = RegExps.AllNumber4;
        col_Quantity_pattern.message = this.translator.I18N.DrugOtherReceiveDetail.Quantity.patternMessage;
        const col_Quantity_required = new NxDataGridColumnValidationRule('required');
        col_Quantity_required.type = 'required';
        col_Quantity_required.message = this.translator.I18N.DrugOtherReceiveDetail.Quantity.required;
        col_Quantity.validationRules.push(...[col_Quantity_pattern,col_Quantity_required]);
        col_Quantity.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    var AmountTotal=0;
                    var Quantity=0;
                    var StandardPack = oldData['StandardPack'];
                    var bIsStandardPack = oldData['bIsStandardPack']

                    if(value){
                        Quantity = Number(value);
                    }
                    if(oldData.UnitPrice){
                        AmountTotal = Number(oldData.UnitPrice) * value;
                    }

                    if (StandardPack && bIsStandardPack) {
                        if(Number(StandardPack)!=0){
                            m['Packages'] = value/Number(StandardPack);
                        }
                    }
                    if (m['Gift']) {
                        m['AmountTotal'] = 0;
                        m['UnitPrice'] = 0;
                    } else {
                        m['AmountTotal'] = AmountTotal.toFixed(4);
                    }
                    m['Quantity'] = Quantity.toFixed(4);
                }
            });
        };

        const col_MeasureUnitName = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.MeasureUnitName.text,
            'MeasureUnitName',
            'string'
        );
        col_MeasureUnitName.props.width = 80;
        col_MeasureUnitName.props.cssClass = 'disabled';
        col_MeasureUnitName.props.allowEditing = false;

        const col_UnitPrice = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.UnitPrice.text,
            'UnitPrice',
            'number'
        );
        col_UnitPrice.props.width = 100;
        col_UnitPrice.props.alignment = 'right';
        col_UnitPrice.props.allowEditing = true;
        const col_UnitPrice_pattern = new NxDataGridColumnValidationRule();
        col_UnitPrice_pattern.type = 'pattern';
        col_UnitPrice_pattern.pattern = RegExps.PositiveNumberFix4;
        col_UnitPrice_pattern.message = this.translator.I18N.YhMaterialReceiveDetail.UnitPrice.patternMessage;
        col_UnitPrice.validationRules.push(...[col_UnitPrice_pattern]);
        col_UnitPrice.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    var AmountTotal=0;
                    var UnitPrice=0;
                    if(value){
                        UnitPrice = Number(value);
                    }
                    if(oldData.Quantity){
                        AmountTotal = Number(oldData.Quantity) * UnitPrice;
                    }

                    if (m['Gift']) {
                        m['AmountTotal'] = 0;
                        m['UnitPrice'] = 0;
                    } else {
                        m['AmountTotal'] = AmountTotal.toFixed(4);
                        m['UnitPrice'] = UnitPrice.toFixed(4);
                    }
                }
            });
        };

        const col_AmountTotal = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.AmountTotal.text,
            'AmountTotal',
            'number'
        );
        col_AmountTotal.props.width = 100;
        col_AmountTotal.props.alignment = 'right';
        col_AmountTotal.props.allowEditing = true;
        const col_AmountTotal_pattern = new NxDataGridColumnValidationRule();
        col_AmountTotal_pattern.type = 'pattern';
        col_AmountTotal_pattern.pattern = RegExps.AllNumber4;
        col_AmountTotal_pattern.message = this.translator.I18N.YhMaterialReceiveDetail.AmountTotal.patternMessage;
        col_AmountTotal.validationRules.push(...[col_AmountTotal_pattern]);
        col_AmountTotal.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    var AmountTotal=0;
                    var UnitPrice=0;
                    var Quantity=0;
                    if(value){
                        AmountTotal = Number(value);
                    }
                    if(oldData.UnitPrice && oldData.UnitPrice != 0){
                        UnitPrice = oldData.UnitPrice;
                        console.log(UnitPrice,'1')
                        Quantity = value / Number(UnitPrice);
                        console.log(Quantity,'1.1')
                    }
                    if(oldData.Quantity && oldData.Quantity != 0){
                        Quantity = oldData.Quantity;
                        console.log(Quantity,'2')
                        UnitPrice = value / Number(Quantity);
                        console.log(UnitPrice,'2.1')
                    }
                    if (m['Gift']) {
                        m['AmountTotal'] = 0;
                        m['UnitPrice'] = 0;
                    } else {
                        m['AmountTotal'] = value;
                        m['UnitPrice'] = Number(UnitPrice).toFixed(4);
                    }

                    m['Quantity'] = Number(Quantity).toFixed(4);
                }
            });
        };

        const col_Gift = new NxDataGridColumn(this.translator.I18N.DrugOtherReceiveDetail.Gift.text, 'Gift', 'boolean');
        col_Gift.props.width = 80;
        col_Gift.props.alignment="center";
        col_Gift.props.showEditorAlways=true;
        col_Gift.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    m['Gift'] = value;
                    if (value) {
                        m['AmountTotal'] = 0;
                        m['UnitPrice'] = 0;
                    }
                }
            });
        }

        const col_HenHouseName = new NxDataGridColumn(
            this.translator.I18N.DrugOtherReceiveDetail.HenhouseID.text,
            'HenhouseID',
            'string',
            'HenhouseName'
        );
        col_HenHouseName.props.width = 100;
        col_HenHouseName.props.requiredDisable = true;
        col_HenHouseName.props.lookup.enabled = true;
        col_HenHouseName.props.lookup.dataSource = this.HenhouseSourceall;
        col_HenHouseName.props.lookup.allowClearing = true;
        col_HenHouseName.props.lookup.valueExpr = 'HenhouseID';
        col_HenHouseName.props.lookup.displayExpr = 'HenhouseName';
        col_HenHouseName.props.setCellValue = (newdata, value, oldData) => {
            // var res = this.HenhouseBydataSource.filter((o) => o.HenhouseID == value);
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    m['HenhouseID'] = value;
                    // m['HenhouseName'] = res[0].HenhouseName;
                }
            })
        };

        //生产厂家
        const col_Vendor = new NxDataGridColumn(this.translator.I18N.YhDrugApplicationDetail.Vendor.text, 'Vendor');
        col_Vendor.props.width = 100;

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.dataGridOptions.remarks.text, 'DetailRemarks');
        col_Remarks.props.width = 100;

        //订药申请单据号
        const col_NumberSource = new NxDataGridColumn( '订药申请' + this.translator.I18N.commonColumns.number.text, 'NumberSource');
        col_NumberSource.props.width = 120;
        col_NumberSource.props.cssClass = 'disabled';
        col_NumberSource.props.allowEditing = false;

        //行号
        const col_SerialNo = new NxDataGridColumn( '申请' + this.translator.I18N.YHPoultrySalesDetail.SerialNo.text, 'LySerialNo');
        col_SerialNo.props.width = 80;
        col_SerialNo.props.alignment = 'center';
        col_SerialNo.props.cssClass = 'disabled';
        col_SerialNo.props.allowEditing = false;

        //申请通用名
        const col_CommonNameRef = new NxDataGridColumn( '申请' + this.translator.I18N.YhDrugApplicationDetail.CommonName.text, 'LyCommonName');
        col_CommonNameRef.props.width = 100;
        col_CommonNameRef.props.cssClass = 'disabled';
        col_CommonNameRef.props.allowEditing = false;

        //申请商品代号
        const col_ProductName = new NxDataGridColumn( '申请' + this.translator.I18N.YhDrugApplicationDetail.ProductName.text, 'LyProductName');
        col_ProductName.props.width = 120;
        col_ProductName.props.cssClass = 'disabled';
        col_ProductName.props.allowEditing = false;

        //申请计量单位
        const col_MeasureUnitNameRef = new NxDataGridColumn( '申请' + this.translator.I18N.YhDrugApplicationDetail.MeasureUnitName.text, 'LyMeasureUnitName');
        col_MeasureUnitNameRef.props.width = 100;
        col_MeasureUnitNameRef.props.alignment = 'center';
        col_MeasureUnitNameRef.props.cssClass = 'disabled';
        col_MeasureUnitNameRef.props.allowEditing = false;

        //申请数量
        const col_QuantityRef = new NxDataGridColumn( '申请' + this.translator.I18N.YhDrugApplicationDetail.Quantity.text, 'LyQuantity');
        col_QuantityRef.props.width = 100;
        col_QuantityRef.props.alignment = 'right';
        col_QuantityRef.props.cssClass = 'disabled';
        col_QuantityRef.props.allowEditing = false;

        return [
            col_ProductID,
            col_CommonName,
            col_Specification,
            col_bIsStandardPack,
            col_StandardPack,
            col_ProductBatchID,
            col_ProductionDate,
            col_ProductValidity,
            col_ValidDate,
            col_Packages,
            col_Quantity,
            col_MeasureUnitName,
            col_UnitPrice,
            col_AmountTotal,
            col_Gift,
            col_HenHouseName,
            col_Vendor,
            col_Remarks,
            col_NumberSource,
            col_SerialNo,
            col_CommonNameRef,
            col_ProductName,
            col_MeasureUnitNameRef,
            col_QuantityRef
        ];
    }
    //#endregion
    //#region 初始化工具条
    init_toolbar_panel(): DrugOtherReceiveDetailComponent {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;
        const add_type = new ToolbarPanelType();
        add_type.key = 'addHang';
        add_type.widget = new NxButton('批量增行');
        add_type.widget.events.onClick = this.addHang.bind(this);

        const refer_type = new ToolbarPanelType();
        refer_type.key = 'copyLine';
        refer_type.widget = new NxButton('参照新增');
        refer_type.widget.events.onClick = this.referHang.bind(this);

        const introduce_type = new ToolbarPanelType();
        introduce_type.key = 'introduce';
        introduce_type.widget = new NxButton('引入订药申请');
        introduce_type.widget.events.onClick = this.Introduce.bind(this);

        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).props.visible = false;
        this.model.toolbar.mainPanel.push(...[add_type,refer_type,introduce_type]);
        this.model.toolbar.getOtherWidgetByKey('headSetting').props.visible = true;

        this.model.toolbar.moreButton.props.visible = true;
        this.model.toolbar.moreButton.props.disabled = true;
        this.model.toolbar.moreButton.props.hint = "更多";
        this.model.toolbar.moreButton.props.icon = 'iconfont iconellipsis';
        this.model.toolbar.moreButton.props.showArrowIcon = false;
        this.model.toolbar.moreButton.props.stylingMode = 'text';
        this.model.toolbar.moreButton.props.dropDownOptions = { width: 130 };
        this.model.toolbar.moreButton.props.items = [
            new NxDropDownButtonItem(
                '批次累计领药金额',
                'lingyaosum',
                'iconfont iconwuzilingyong'
            ),
        ];
        this.model.toolbar.moreButton.props.displayExpr = 'text';
        this.model.toolbar.moreButton.events.onItemClick = (e) => {
            if (e.type == 'lingyaosum') {
                this.openLingyaosum();
            }
        };
        this.model.toolbar.moreButton.props.disabled = true;

        return this;
    }
 
    // 引入订药申请
    Introduce() {
        let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'] || '0';
        let YHBatch = this.model.conditionPanel.data['YHBatch'] || '0';
        this.getDrugApplicationSource(YHFarmerID,YHBatch);
        this.getFormDataSource(YHFarmerID,YHBatch);
        if (YHFarmerID && YHFarmerID != '' && YHFarmerID != '0') {
            this.FarmerDisabled = true;
        } else {
            this.FarmerDisabled = false;
        }
        if (YHBatch && YHBatch != '' && YHBatch != '0') {
            this.BatchDisabled = true;
        } else {
            this.BatchDisabled = false;
        }
        this.citeFormData.YHFarmerID = YHFarmerID;
        this.citeFormData.YHBatch = YHBatch;
        this.citeSelectedRows = [];
        this.citeVisible = true;
    }

    getFormDataSource(YHFarmerID,YHBatch) {
        this.service.getFarmerMgmtByYHFarmerID(YHFarmerID).then( (res:any) => {
            this.citeFormData.PersonNames = res.PersonName;
        })
        this.service.getYHBatchDetailByYHBatch(YHBatch).then( (res:any) => {
            this.citeFormData.ChickenFarmName = res[0].ChickenFarmName;
            this.citeFormData.BreedingName = res[0].BreedingName;
            this.citeFormData.CurrQuantity = res[0].Quantity;
            this.citeFormData.CurrDaysOld = res[0].DaysOld;
        })
    }

    /**
     * 获取列表/详情数据源
     */
    getDrugApplicationSource(YHFarmerID,YHBatch) {
        this.service.getDrugApplicationList(YHFarmerID,YHBatch).then((res:any) => {
            console.log(res,'res');
            this.citeDataSourceAll = res.map( m => {
                m['LyStatusText'] = m.LyStatus == 0 ? '未领用' : '已领用'
                return m
            });
            this.citeDataSource = this.citeDataSourceAll.filter( o => o.LyStatus === 0);
            // this.citeDataSource = this.citeDataSourceAll.filter( o => o.LyStatus === 1);
            // console.log(this.citeDataSourceAll);
            // console.log(this.citeDataSource);
            this.citeFormData.LyStatus = 0;
            // this.citeFormData = res.length > 0 ? res[0] : {};
        })
    }

    getSelection3(type) {
        if (type == '3') {
            this.citeVisible = false;
            return false;
        }
        setTimeout(async () => {
            this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
            var selectedRowsData11 = this.citeDetailGrid.instance.getSelectedRowsData();
            let val = selectedRowsData11[0].YHFarmerID + selectedRowsData11[0].YHBatch
            for (let index = 0; index < selectedRowsData11.length; index++) {
                const element = selectedRowsData11[index];
                var key = element.YHFarmerID + element.YHBatch;
                if (val != key) {
                    return Notify.toast('请选择相同养户相同批次的数据！', NotifyType.Error);
                }
            }
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            let arry = [];
            (<Array<any>>oldData).forEach((data) => {
                let isAllEmpty = true;
                let props = Object.keys(data).filter(
                    (x) => x != this.model.dataGrid.primaryKey && x != 'target' && x != 'SerialNo'
                ); //过滤主键跟target
                for (const prop of props) {
                    if (data[prop] != null && data[prop] != '' && data[prop] != undefined) {
                        isAllEmpty = false;
                        break;
                    }
                }
                if (!isAllEmpty) {
                    arry.push(data);
                }
            });
            let SerialNo = 0;
            (<Array<any>>this.model.dataGrid.props.dataSource).forEach((m) => {
                if(m.SerialNo > SerialNo) SerialNo = m.SerialNo;
            });
            selectedRowsData11.forEach((f, i) => {
                var row = deepCopy(f);
                row[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                row.target = DataStatus.newline;
                row['ProductID'] = f.LyProductID;
                row['ProductName'] = f.LyProductName;
                row['CommonName'] = f.LyCommonName;
                row['MeasureUnitName'] = f.LyMeasureUnitName;
                row['DetailRemarks'] = f.Remarks;
                arry.push(row);
            });
            if (!this.model.conditionPanel.data['YHFarmerID'] || this.model.conditionPanel.data['YHFarmerID'] == '0') {
                this.model.conditionPanel.data['YHFarmerID'] = (this.citeFormData.YHFarmerID && this.citeFormData.YHFarmerID != '0') || arry[0].YHFarmerID;
            }
            if (!this.model.conditionPanel.data['YHBatch'] || this.model.conditionPanel.data['YHBatch'] == '0') {
                this.model.conditionPanel.data['YHBatch'] = (this.citeFormData.YHBatch && this.citeFormData.YHBatch != '0' ) || arry[0].YHBatch;
            }

            this.model.dataGrid.props.dataSource = arry;
            this.detailInstance.dataGrid.dataGrid.instance.refresh();
            this.detailInstance.modifyDataStatusSet();
            this.citeSelectedRows = [];

            if (type == '1') {
                this.citeVisible = false;
            }
            this.setReadOnly()
        },200)
    }

    openLingyaosum() {
        if (!this.model.conditionPanel.data.YHBatch||this.model.conditionPanel.data.YHBatch=="0") {
            return Notify.toast('请选择养户批次！', NotifyType.Error);
        }
        this.outVisible2 = true;
        let UrlParam = '?DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd') + '&YHBatch=' + this.model.conditionPanel.data.YHBatch + '&';
        this.loading = true;
        this.service.DrugotherReceiveTotal(UrlParam).then( (res:any) => {
            this.loading = false;
            this.TotalFormData ={
                TotalDataDate:"",
                TotalQuantity:"",
                TotalValueQuantity:"",
                TotalYHBatchName:"",
                TotalBreedingName:"",
                TotalOneMedicineFee:""
            };
            var dets=[];
            if(res.data&&res.data.length>0){
                this.TotalFormData.TotalDataDate = res.data[0].DataDate;
                this.TotalFormData.TotalQuantity = res.data[0].TotalQuantity;
                this.TotalFormData.TotalValueQuantity = res.data[0].ValueQuantity;
                this.TotalFormData.TotalYHBatchName = res.data[0].YHBatchName;
                this.TotalFormData.TotalBreedingName = res.data[0].BreedingName;
                this.TotalFormData.TotalOneMedicineFee = res.data[0].OneMedicineFee;
                dets = res.data[0].dets;
            }
            this.lingliaoDataSource = dets;
        })
    }


    onPopupHiding2() {
        this.outVisible2 = false;
        this.lingliaoDataSource = [];
    }

    getSelection2(type) {
        if (type == '3') {
            this.outVisible2 = false;
            this.lingliaoDataSource = [];
            return false;
        }
    }

    addHang() {
        if (!this.model.conditionPanel.data.DataDate) {
            return Notify.toast('请选择日期！', NotifyType.Error);
        }
        if (!this.model.conditionPanel.data.ReceiveType||this.model.conditionPanel.data.ReceiveType=="0") {
            return Notify.toast('请选择类型！', NotifyType.Error);
        }
        if (this.model.conditionPanel.data.ReceiveType==DataDictionary.ReceiveTypeA) {
            this.popTitle="批量增行弹出框（领取）";
            if (!this.model.conditionPanel.data.OutWarehouse||this.model.conditionPanel.data.OutWarehouse=="0") {
                return Notify.toast('请选择总部仓库！', NotifyType.Error);
            }
        }else{
            if (!this.model.conditionPanel.data.YHBatch||this.model.conditionPanel.data.YHBatch=="0") {
                return Notify.toast('请选择养户批次！', NotifyType.Error);
            }
            this.popTitle="批量增行弹出框（退回）";
        }
        this.outVisible = true;
    }

    onPopupHiding() {
        this.outVisible = false;
        this.AutoDataSourceFilter = [];
        this.AutoDataSource = [];
    }

    reset() {
        this.AutoDataSourceFilter = deepCopy(this.AutoDataSource);
    }

    onSearch() {
        let UrlParam = 'iSortPlus='+DataDictionary.iSortB+','+DataDictionary.iSortC+','+DataDictionary.iSortE+'&';
        UrlParam += 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd')+ '&';
        if (this.model.conditionPanel.data.ReceiveType==DataDictionary.ReceiveTypeA) {
            UrlParam +=  '&WarehouseID=' + this.model.conditionPanel.data.OutWarehouse + '&';
        }else{
            UrlParam +=  '&YHBatchID=' + this.model.conditionPanel.data.YHBatch + '&';
        }
        if (this.numericalOrder) {
            UrlParam += 'NumericalOrder=' + this.numericalOrder + '&';
        }
        if (this.formData.ProductID) {
            UrlParam += 'ProductID=' + this.formData.ProductID + '&';
        }
        if (this.formData.CommonName) {
            UrlParam += 'CommonName=' + this.formData.CommonName + '&';
        }
        UrlParam += 'ProductionPDateFalg=1&';
        UrlParam += 'groupBy=md.ProductID,mt.BatchID&';
        this.loading = true;
        this.service.getQLWWarehouseStock(UrlParam,this.model.conditionPanel.data.ReceiveType).then( (res:any) => {
            this.AutoDataSourceFilter = [];
            this.loading = false;
            var selectedRowsData11 = res.value;
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            if (oldData && oldData.length > 0) {
                selectedRowsData11.forEach((f) => {
                    if(!f.ProductBatchID){
                        f.ProductBatchID="0";
                    }
                    var HenhouseID = "0";
                    if(f.systemstart){
                        HenhouseID = f.HenhouseID;
                    }

                    oldData.forEach((row) => {
                        var OldHenhouseID = "0";
                        if(f.systemstart){
                            OldHenhouseID = row.HenhouseID;
                        }
                        if (f.ProductBatchID == row.ProductBatchID && f.ProductID == row.ProductID && OldHenhouseID==HenhouseID) {
                            var Quantity = Number(f.cQuantity);
                            var cQuantity = 0;
                            if (row.Quantity) {
                                cQuantity = Number(row.Quantity);
                            }
                            if (this.model.conditionPanel.data.ReceiveType==DataDictionary.ReceiveTypeA) {
                                f.cQuantity = Quantity - cQuantity;
                            }else{
                                f.cQuantity = Quantity + cQuantity;
                            }
                        }
                    });
                });
            }
            var data = [];
            selectedRowsData11.forEach((f) => {
                if (f.cQuantity && Number(f.cQuantity) > 0) {
                    f.DetailID = new DateTime().randomValue.toString();
                    f.ProductName = f.cProductName;
                    f.ProductionDate = f.ProductionPDate;
                    data.push(f);
                }
            });
            this.AutoDataSource = data;
            this.AutoDataSourceFilter = data;
        })
    }

    //弹出框显隐判断
    itemIF(arr) {
        if (arr==this.model.conditionPanel.data.ReceiveType) {
            return true
        }
        return false
    }

    getSelection(type) {
        if (type == '3') {
            this.outVisible = false;
            this.AutoDataSourceFilter = [];
            return false;
        }
        setTimeout(async () => {
            this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
            var selectedRowsData11 = this.dataGridRef.instance.getSelectedRowsData();
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            let arry = [];
            (<Array<any>>oldData).forEach((data) => {
                let isAllEmpty = true;
                let props = Object.keys(data).filter(
                    (x) => x != this.model.dataGrid.primaryKey && x != 'target'
                ); //过滤主键跟target
                for (const prop of props) {
                    if (data[prop] != null && data[prop] != '' && data[prop] != undefined) {
                        isAllEmpty = false;
                        break;
                    }
                }

                if (!isAllEmpty) {
                    arry.push(data);
                }
            });
            let HenhouseName = '';
            if (this.formData.HenhouseID) {
                var source = this.HenhouseSourceall.filter(o => o.HenhouseID === this.formData.HenhouseID);
                if(source&&source.length>0){
                    HenhouseName = source[0].HenhouseName;
                }
            }
            if (DataDictionary.MaterialSupplyPolicyA != this.model.conditionPanel.data['Abstract']) {
                var ids = [];
                selectedRowsData11.forEach((f) => {
                    if(ids.indexOf(f.ProductID) === -1){
                        ids.push(f.ProductID);
                    }
                });

                let UrlParam = 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd')+ '&';
                UrlParam += 'ProductCollectType=' + DataDictionary.ProductCollectTypeC + '&';
                if (this.model.conditionPanel.data['YHFarmerID']) {
                    UrlParam += 'YHFarmerID=' + this.model.conditionPanel.data['YHFarmerID'] + '&';
                }
                if (this.model.conditionPanel.data.YHBatch) {
                    UrlParam += 'YHBatchID=' + this.model.conditionPanel.data.YHBatch + '&';
                }
                UrlParam += 'ProductID=' + ids.join(',') + '&';
                this.loading = true;
                await this.service.getGetUnitPrice(UrlParam).then( (res:any) => {
                    this.loading = false;
                    if(res&&res.length>0){
                        res.forEach(element => {
                            selectedRowsData11.forEach((f) => {
                                if(f.ProductID==element.ProductID){
                                    f.UnitPrice = element.UnitPrice;
                                }
                            });
                        });
                    }
                })
            }
            selectedRowsData11.forEach((f) => {
                var row = deepCopy(f);
                row[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                row.target = DataStatus.newline;
                if(!row['Packages']){
                    row['Packages'] = 0;
                }
                if(!row['Quantity']){
                    row['Quantity'] = 0;
                }

                if(row['Quantity']&&row['UnitPrice']){
                    row['AmountTotal'] = (Number(row['Quantity'])*Number(row['UnitPrice'])).toFixed(2);
                }

                if (this.model.conditionPanel.data.ReceiveType==DataDictionary.ReceiveTypeA) {
                    row['HenhouseID'] = this.formData.HenhouseID;
                    row['HenhouseName'] = HenhouseName;
                }
                else{
                    row['Packages'] = -Math.abs(row['Packages']);
                    row['Quantity'] = -Math.abs(row['Quantity']);
                }
                arry.push(row);
            });
            this.model.dataGrid.props.dataSource = arry;
            this.detailInstance.dataGrid.dataGrid.instance.refresh();
            this.detailInstance.modifyDataStatusSet();

            if (type == '2') {
                this.AutoDataSourceFilter = [];
                // this.clickAuto();
            }
            if (type == '1') {
                this.AutoDataSourceFilter = [];
                this.outVisible = false;
            }
            this.setReadOnly();
        },200)
    }

    async referHang() {
        this.model.dataGrid.type = 'detail';
        this.numericalOrder = null;
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data.NumericalOrder = '';
        this.model.conditionPanel.data.DataDate = new DateTime(new Date()).toString('yyyy-MM-dd');
        var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
        var ids = [];
        for (let index = 0; index < oldData.length; index++) {
            const element = oldData[index];
            element.Packages = null;
            element.Quantity = null;
            element.AmountTotal = null;
            element.UnitPrice = null;
            if(ids.indexOf(element.ProductID) === -1){
                ids.push(element.ProductID);
            }
        }
        let UrlParam = 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd')+ '&';
        UrlParam += 'ProductCollectType=' + DataDictionary.ProductCollectTypeC + '&';
        if (this.model.conditionPanel.data['YHFarmerID']) {
            UrlParam += 'YHFarmerID=' + this.model.conditionPanel.data['YHFarmerID'] + '&';
        }
        if (this.model.conditionPanel.data.YHBatch) {
            UrlParam += 'YHBatchID=' + this.model.conditionPanel.data.YHBatch + '&';
        }
        UrlParam += 'ProductID=' + ids.join(',') + '&';
        this.loading = true;
        await this.service.getGetUnitPrice(UrlParam).then( (res:any) => {
            this.loading = false;
            if(res&&res.length>0){
                res.forEach(element => {
                    oldData.forEach((f) => {
                        if(f.ProductID==element.ProductID){
                            f.UnitPrice = element.UnitPrice;
                        }
                    });
                });
            }
        })
        this.detailInstance.dataGrid.dataGrid.instance.refresh();
        
        this.detailInstance.addCreateDataStatus();
       
    }

    create() {
        this.model.toolbar.moreButton.props.disabled = true;
        this.model.conditionPanel.data = {};
        this.detailInstance.cacheSearchData = {};
        this.model.conditionPanel.data['DataDate'] = new Date();
        this.model.conditionPanel.data['YHFarmerID'] = null;
        this.model.conditionPanel.data['YHBatch'] = null;
        this.model.conditionPanel.data['isbegin'] = false;
        this.model.conditionPanel.data['ConfirmStatus'] = false;
        this.model.conditionPanel.data['ReceiveType'] = DataDictionary.ReceiveTypeA;
        this.model.conditionPanel.data.NumericalOrder = '';
        this.numericalOrder = '';
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data.Remarks = '';
        this.model.dataGrid.type = 'detail';
        this.detailInstance.$open = FormOptions.$create;
        this.model.review.visible = false;
        this.onDataDateChange(null);
        this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);

        setTimeout(() => {
            this.detailInstance.createDataStatus(undefined,5);
            this.setReadOnly();
        }, 20);
    }
    save() {
        if (!this.model.conditionPanel.data['Abstract'] || this.model.conditionPanel.data['Abstract'] == "0") {
            return Notify.toast('摘要，不能为空！', NotifyType.Error);
        }
        if (this.model.conditionPanel.data['Abstract'] == DataDictionary.MaterialSupplyPolicyA && (!this.model.conditionPanel.data['InWarehouse'] || this.model.conditionPanel.data['InWarehouse'] =="0")) {
            return Notify.toast('养殖场仓库不能为空，请先在养殖场设置中设置该养殖场的药杂仓库！', NotifyType.Error);
        }
        var oldData = <Array<any>>this.model.dataGrid.props.dataSource;

            for (let i = 0; i < oldData.length; i++) {
                const element = oldData[i];
                if(element.ProductID && (!element.Quantity||element.Quantity==0)){
                    return Notify.toast('第'+(i+1)+'行，数量必须填!', NotifyType.Error);
                }
                if (this.model.conditionPanel.data['ReceiveType'] == DataDictionary.ReceiveTypeB) {
                    if (element.ProductID && element.Quantity > 0) {
                        return Notify.toast('退回的数量必须需为负数!', NotifyType.Error);
                    }
                }
            }

        if (!this.model.conditionPanel.data['YHBatch'] || this.model.conditionPanel.data['YHBatch'] == "0") {
            return Notify.toast('养户批次，不能为空！', NotifyType.Error);
        }
        if (!this.model.conditionPanel.data['YHFarmerID'] || this.model.conditionPanel.data['YHFarmerID'] == "0") {
            return Notify.toast('养户名称，不能为空！', NotifyType.Error);
        }
        if (!this.model.conditionPanel.data['OutWarehouse'] || this.model.conditionPanel.data['OutWarehouse'] == "0") {
            return Notify.toast('总部仓库，不能为空！', NotifyType.Error);
        }
        if (!this.model.conditionPanel.data['ReceiveType'] || this.model.conditionPanel.data['ReceiveType'] == "0") {
            return Notify.toast('类别，不能为空！', NotifyType.Error);
        }

        this.detailInstance.saveChanges().then((value) => {

            this.detailInstance.openCheck(
                () => {
                    const data = this.getSaveData(value);
                    if (data) {
                        this.service.create(data).then((result: Result) => {
                            const response = ResponseSuccess.handle(result);
                            if (response.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                this.model.conditionPanel.data['NumericalOrder'] = result.data.NumericalOrder;
                                this.numericalOrder = result.data.NumericalOrder;
                                //开启审核功能
                                this.model.review.visible = true;
                                this.model.review.numericalOrder = this.numericalOrder;
                                this.model.dataGrid.type = 'detail';
                                this.detailInstance.$open = FormOptions.$modify;

                                this.queryDetail();
                            } else {
                                // Notify.toast(response.message, NotifyType.Error);
                                this.detailInstance.messageBox.show(response.message);
                                this.detailInstance.saveDataError();
                            }
                        });
                    }
                },
                () => {
                    if (this.detailInstance.reviewValidation()) {
                        this.service.update(this.getSaveData(value)).then((result: Result) => {
                            const res = ResponseSuccess.handle(result);
                            if (res.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                // this.detailInstance.saveDataAfterStatus();
                                this.queryDetail();
                            } else {
                                // Notify.toast(res.message, NotifyType.Error);
                                this.detailInstance.messageBox.show(res.message);
                                this.detailInstance.saveDataError();
                            }
                        });
                    }
                }
            );
        });
    }
    delete() {
        MessageBox.confirm(
            this.translator.I18N.commandOptions.delete.confirm,
            this.translator.I18N.commandOptions.delete.confirmTitle
        ).then((require) => {
            if (require) {
                this.detailInstance.dataGrid.dataGrid.instance;
                this.service.deleteByKey(this.model.conditionPanel.data.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.toast(this.translator.I18N.commandOptions.delete.success, NotifyType.Success);
                        this.detailInstance.deletedStatus();
                    } else {
                        // Notify.toast(response.message, NotifyType.Error);
                        this.detailInstance.messageBox.show(response.message);
                        this.detailInstance.saveDataError();
                    }
                });
            }
        });
    }
    cancel() {
        if (this.detailInstance.$open == FormOptions.$create) {
            this.create();
        } else {
            this.queryDetail();
        }
        // this.detailInstance.resetDataStatus();
    }
    private dataValidation(data): boolean {
        const validator = new DataValidator();
        validator.forObjRequire(data, [
            ['ProductID', this.translator.I18N.DrugOtherReceiveDetail.ProductName.required]
        ]);
        return validator.validation;
    }
    private getSaveData(value) {
        const validation = this.dataValidation(value.body);
        if (validation) {
            let saveData = new DrugOtherReceive();
            const date = new DateTime(value.header.DataDate.toString()).toString('yyyy-MM-dd');
            saveData.DataDate = date;
            saveData.Number = 0;
            saveData.NumericalOrder = value.header.NumericalOrder || '0';
            saveData.ChickenFarmID = value.header.ChickenFarmID || '0';
            saveData.YHFarmerID = value.header.YHFarmerID || '0';
            saveData.YHBatch = value.header.YHBatch || '0';
            saveData.Abstract = value.header.Abstract || "0";
            saveData.OutWarehouse = value.header.OutWarehouse || "0";
            saveData.InWarehouse = value.header.InWarehouse || '0';
            saveData.Remarks = value.header.Remarks || '';
            saveData.ReceiveType = value.header.ReceiveType || '0';
            saveData.ConfirmStatus = value.header.ConfirmStatus;
            saveData.ComboPack = value.header.ComboPack || DataDictionary.ComboPackA;
            saveData.isbegin = value.header.isbegin || false;
            value.body.map((m) => {
                saveData.DrugOtherReceiveDetailDto.push({
                    NumericalOrder: m.NumericalOrder || '0',
                    NumericalOrderDetail: m.NumericalOrderDetail || '0',
                    NumericalOrderSource: m.NumericalOrderSource || '0',
                    NumericalOrderDetailSource: m.NumericalOrderDetailSource || '0',
                    DetailRemarks: m.DetailRemarks || '',
                    HenhouseID: m.HenhouseID || '0',
                    StandardPack: m.StandardPack || '0',
                    Specification: m.Specification || '0',
                    ProductID: m.ProductID,
                    ProductBatchID: m.ProductBatchID || '0',
                    ProductionDate: m.ProductionDate?m.ProductionDate:'',
                    MeasureUnitName: m.MeasureUnitName || '',
                    Vendor: m.Vendor || '',
                    UnitPrice: m.UnitPrice?Number(m.UnitPrice):0,
                    AmountTotal: m.AmountTotal?Number(m.AmountTotal):0,
                    Packages: m.Packages?Number(m.Packages):0,
                    Quantity: m.Quantity?Number(m.Quantity):0,
                    Gift: m.Gift,
                    BreedingID: m.BreedingID || '0',
                    Target: m.target
                });
            });
            if (this.detailInstance.$open == FormOptions.$modify) {
                saveData.DrugOtherReceiveDetailDto.push(...value.deleted);
            }
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }
    //#endregion

    //#region  表头配置
    init_table_header(): DrugOtherReceiveDetailComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        const condition_ChickenFarmID = new NxConditionItem(this.translator.I18N.DrugOtherReceive.ChickenFarmID.text, 'ChickenFarmName', 'TextBox', false);
        condition_ChickenFarmID.headVisible = true;
        condition_ChickenFarmID.widget = new NxTextBox();
        condition_ChickenFarmID.widget.props.readOnly = true;

        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.label = this.translator.I18N.DrugOtherReceive.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.requiredDisable = true;
        condition_date.widget = new NxDateBox();
        condition_date.widget.events.onValueChanged = this.onDataDateChange.bind(this);
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.readOnly = false;
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 3);
        condition_date.widget.props.max = maxDate;

        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.DrugOtherReceive.YHFarmerID.text;
        condition_YHFarmerID.required = true;
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.requiredDisable = true;
        condition_YHFarmerID.widget = new NxSelectBox();
        condition_YHFarmerID.widget.events.onValueChanged = this.onDataDateChange.bind(this);
        condition_YHFarmerID.widget.props.dataSource = this.yhBasicSettingODataContext.getYHFarmerInfoDataSource();
        condition_YHFarmerID.widget.props.valueExpr = "YHFarmerID";
        condition_YHFarmerID.widget.props.displayExpr = "YHFarmerName";
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerName', 'YHPersonName', 'Phone', 'MnemonicCode'];

        const condition_BatchID = new NxConditionItem();
        condition_BatchID.label = this.translator.I18N.DrugOtherReceive.YHBatch.text;
        condition_BatchID.required = true;
        condition_BatchID.dataField = 'YHBatch';
        condition_BatchID.type = 'SelectBox';
        condition_BatchID.requiredDisable = true;
        condition_BatchID.widget = new NxSelectBox();
        condition_BatchID.widget.events.onValueChanged = this.onZqbatchValueChange.bind(this);
        condition_BatchID.widget.props.dataSource = this.yhBasicSettingODataContext.getYHBatchDataSource();
        condition_BatchID.widget.props.valueExpr = "YHBatchID";
        condition_BatchID.widget.props.displayExpr = "YHBatchName";
        condition_BatchID.widget.props.searchExpr = ['YHBatchName','MnemonicCode'];
        condition_BatchID.widget.props.readOnly = false;
        condition_BatchID.widget.props.placeholder = '请先选养户';
        condition_BatchID.widget.events.onOpened = e => {
            let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            if(YHFarmerID&&YHFarmerID!="0"){
                let filter = [['TransferDate', '<=', new Date(new Date(new Date(DataDate).getTime()).toLocaleDateString())],['Status', '=', true],['YHFarmerID','=',YHFarmerID]];
                e.component.option('dataSource',this.yhBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName'],
                }));
            }else{
                e.component.option('dataSource',[]);
            }
        };

        const condition_ReceiveType = new NxConditionItem();
        condition_ReceiveType.label = this.translator.I18N.DrugOtherReceive.ReceiveType.text;
        condition_ReceiveType.required = true;
        condition_ReceiveType.requiredDisable = true;
        condition_ReceiveType.type = 'SelectBox';
        condition_ReceiveType.dataField = 'ReceiveType';
        condition_ReceiveType.widget = new NxSelectBox();
        condition_ReceiveType.widget.props.showClearButton = false;
        condition_ReceiveType.widget.props.disabled = false;
        condition_ReceiveType.widget.props.dataSource = DataDictionarySource.ReceiveTypeSource;
        condition_ReceiveType.widget.props.valueExpr = 'Value';
        condition_ReceiveType.widget.props.displayExpr = 'Text';

        const condition_Abstract = new NxConditionItem(this.translator.I18N.DrugOtherReceive.Abstract.text, 'AbstractName', 'TextBox', false);
        condition_Abstract.headVisible = true;
        condition_Abstract.widget = new NxTextBox();
        condition_Abstract.widget.props.readOnly = true;

        const condition_OutWarehouse = new NxConditionItem();
        condition_OutWarehouse.label =  this.translator.I18N.DrugOtherReceive.OutWarehouse.text;
        condition_OutWarehouse.required = true;
        condition_OutWarehouse.type = 'SelectBox';
        condition_OutWarehouse.dataField = 'OutWarehouse';
        condition_OutWarehouse.requiredDisable = true;
        condition_OutWarehouse.widget = new NxSelectBox();
        condition_OutWarehouse.widget.props.showClearButton = false;
        condition_OutWarehouse.widget.props.disabled = false;
        condition_OutWarehouse.widget.props.dataSource = this.basicSettingODataContext.getWareHouseDataSource({
            select: ['WarehouseID', 'WarehouseName'],
        });
        condition_OutWarehouse.widget.props.valueExpr = 'WarehouseID';
        condition_OutWarehouse.widget.props.displayExpr = 'WarehouseName';

        const condition_InWarehouse = new NxConditionItem(this.translator.I18N.DrugOtherReceive.InWarehouse.text, 'InWarehouseName', 'TextBox', false);
        condition_InWarehouse.headVisible = true;
        condition_InWarehouse.widget = new NxTextBox();
        condition_InWarehouse.widget.props.readOnly = true;


        const condition_ConfirmStatus = new NxConditionItem();
        condition_ConfirmStatus.label = this.translator.I18N.DrugOtherReceive.ConfirmStatus.text;
        condition_ConfirmStatus.requiredDisable = true;
        condition_ConfirmStatus.type = 'SelectBox';
        condition_ConfirmStatus.dataField = 'ConfirmStatus';
        condition_ConfirmStatus.widget = new NxSelectBox();
        condition_ConfirmStatus.widget.props.showClearButton = false;
        condition_ConfirmStatus.widget.props.disabled = false;
        condition_ConfirmStatus.widget.props.dataSource = DataDictionarySource.blImmunitySource
        condition_ConfirmStatus.widget.props.valueExpr = 'value';
        condition_ConfirmStatus.widget.props.displayExpr = 'name';
        condition_ConfirmStatus.widget.props.readOnly = true;

        const condition_number = new NxConditionItem();
        condition_number.label = this.translator.I18N.commonColumns.number.text;
        condition_number.type = 'Span';
        condition_number.headVisible = true;
        condition_number.dataField = 'Number';
        //是否期初
        const condition_isbegin = new NxConditionItem();
        condition_isbegin.label =  this.translator.I18N.DrugOtherReceive.isbegin.text;
        condition_isbegin.required = false;
        condition_isbegin.type = 'SelectBox';
        condition_isbegin.dataField = 'isbegin';
        condition_isbegin.requiredDisable = false;
        condition_isbegin.widget = new NxSelectBox();
        condition_isbegin.widget.props.showClearButton = false;
        condition_isbegin.widget.props.dataSource = this.StatusODataContext.getEggsIsShiftTrayDataSource();
        condition_isbegin.widget.props.valueExpr = 'value';
        condition_isbegin.widget.props.displayExpr = 'name';

        this.model.conditionPanel.conditionItems.push(
            ...[
                condition_date,
                condition_YHFarmerID,
                condition_BatchID,
                condition_ChickenFarmID,
                condition_ReceiveType,
                condition_Abstract,
                condition_OutWarehouse,
                condition_InWarehouse,
                condition_ConfirmStatus,
                condition_isbegin,
                condition_number,
            ]
        );
        return this;
    }

    setProductValue(newData, value, currentRowData) {
        //写这个只是我了解决第一次不填，点击保存，红框。再选择，再保存红框不消失问题。
        //赋值逻辑再preparing中
        newData.ProductID = value;//不写这个，有时无法触发必填验证。
        this.setReadOnly();
    }

    onEditorPreparingFn(e) {
        if (e.parentType == 'dataRow') {
            let triggerValueChanged = true;
            switch (e.dataField) {
                case 'ProductID':
                    e.editorOptions.onValueChanged = (args) => {
                        this.detailInstance.modifyDataStatusSet();
                        const selected = args.component.option('selectedItem');
                        (<Array<any>>this.model.dataGrid.props.dataSource).map(async (m, index) => {
                            if (m.NumericalOrderDetail == e.row.data.NumericalOrderDetail) {
                                if(selected){
                                    if (DataDictionary.MaterialSupplyPolicyA != this.model.conditionPanel.data['Abstract']) {
                                        let UrlParam = 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd')+ '&';
                                        UrlParam += 'ProductCollectType=' + DataDictionary.ProductCollectTypeC + '&';
                                        if (this.model.conditionPanel.data['YHFarmerID']) {
                                            UrlParam += 'YHFarmerID=' + this.model.conditionPanel.data['YHFarmerID'] + '&';
                                        }
                                        if (this.model.conditionPanel.data.YHBatch) {
                                            UrlParam += 'YHBatchID=' + this.model.conditionPanel.data.YHBatch + '&';
                                        }
                                        UrlParam += 'ProductID=' + selected.ProductID + '&';
                                        this.loading = true;
                                        await this.service.getGetUnitPrice(UrlParam).then( (res:any) => {
                                            this.loading = false;
                                            if(res&&res.length>0){
                                                m.UnitPrice = res[0].UnitPrice;
                                            }
                                        })
                                    }
                                    m.ProductValidity = parseInt(selected.ProductValidity) || 0; //保质期
                                    m.ProductID = selected.ProductID;
                                    m.ProductName = selected.ProductName;
                                    m.Specification = selected.Specification;
                                    m.bIsStandardPack = selected.bIsStandardPack;
                                    m.bIsStandardPackText = selected.bIsStandardPack=="1"?"是":"否";
                                    m.StandardPack = selected.StandardPack;
                                    m.CommonName = selected.CommonName;
                                    m.MeasureUnitName = selected.MeasureUnitName;
                                }
                                else{
                                    m.ProductValidity = null; //保质期
                                    m.ProductID = null;
                                    m.ProductName = '';
                                    m.Specification = '';
                                    m.bIsStandardPack = null;
                                    m.bIsStandardPackText = '';
                                    m.StandardPack = null;
                                    m.CommonName = '';
                                    m.MeasureUnitName = '';
                                    m.UnitPrice = null;
                                }
                                m.ProductionDate = null;
                                m.ProductBatchID = null;
                                this.detailInstance.dataGrid.dataGrid.instance.cellValue(index, 'ProductBatchID', null);
                                m.ProductBatchName = '';
                                m.ValidDate = null;
                                //下面代码是必须的
                                if (m['target'] == DataStatus.none) {
                                    m['target'] = DataStatus.modified;
                                }
                                setTimeout(() => {
                                    this.detailInstance.dataGrid.dataGrid.instance.refresh();
                                }, 0);
                            }
                        });
                        e.setValue(args.value);
                    }
                    triggerValueChanged = false;
                    break;
                case 'ProductBatchID':
                    if (e.row.data['ProductID']) {
                        e.editorOptions.dataSource = this.service.getproductiondata(e.row.data['ProductID'])
                    } else {
                        e.editorOptions.dataSource = [];
                    }
                    e.editorOptions.onValueChanged = (args) => {
                        this.detailInstance.modifyDataStatusSet();
                        const selected = args.component.option('selectedItem');
                        (<Array<any>>this.model.dataGrid.props.dataSource).map((m, index) => {
                            if (m.NumericalOrderDetail == e.row.data.NumericalOrderDetail) {
                                if(selected){
                                    if(selected.ProductionDate){
                                        m.ProductionDate = new DateTime(selected.ProductionDate).toString("yyyy/MM/dd");
                                        //有效日期字段：选择入库批号后带出来有效日期数据，计算公式=生产日期+保质期
                                        let _ProductionDate = new Date(m.ProductionDate)
                                        m.ValidDate = new DateTime(new Date(_ProductionDate.setDate(_ProductionDate.getDate() + parseInt(m.ProductValidity))).toString()).toString('yyyy/MM/dd');
                                    }else{
                                        m.ProductionDate = null;
                                        m.ValidDate = null;
                                    }
                                    m.ProductBatchID = selected.BatchID;
                                    m.ProductBatchName = selected.BatchNumber;
                                }
                                else{
                                    m.ProductionDate = null;
                                    m.ValidDate = null;
                                    m.ProductBatchID = null;
                                    m.ProductBatchName = null;
                                }
                                //下面代码是必须的
                                if (m['target'] == DataStatus.none) {
                                    m['target'] = DataStatus.modified;
                                }
                                setTimeout(() => {
                                    this.detailInstance.dataGrid.dataGrid.instance.refresh();
                                }, 0);
                            }
                        });
                        e.setValue(args.value);
                    }
                    triggerValueChanged = false;
                    break;
                case 'HenhouseID' :
                    e.editorOptions.dataSource = this.HenhouseSourceall;
                    break;
            }
            if (triggerValueChanged) {
                //没有这个，编辑datagrid不会激活保存按钮
                e.editorOptions.onValueChanged = (args) => {
                    if (!args.previousValue && args.previousValue != 0 && !args.value && args.value != 0) { }
                    else {
                        this.detailInstance.modifyDataStatusSet();
                        setTimeout(() => {
                            e.setValue(args.value, args.component._changedValue);
                        }, 0);
                    }
                };
            }
        }
    }

    onDataDateChange(value){
        console.log(value)
        if (!value) {
            this.HenhouseSourceall = [];
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly  = true;
        } else {
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly  = false;
        }
        if(this.editFlag){
            return;
        }

        let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
        let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
        if(YHFarmerID&&YHFarmerID!="0"){
            let filter = [['DataDate', '<=', new Date(new Date(new Date(DataDate).getTime()).toLocaleDateString())],['Status', '=', true],["YHFarmerID",'=',YHFarmerID]];
            new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
                filter: filter
            })).load().then((res:any) => {
                if(res&&res.length>0){
                    if(res.length==1){
                        this.model.conditionPanel.data['YHBatch'] = res[0].YHBatchID;
                        this.getHenhouse();
                    }else{
                        let datas = res.filter((m) => m.YHBatchID == this.model.conditionPanel.data['YHBatch']);
                        if(datas==null || datas.length==0){
                            this.onZqbatchValueChange(null);
                        } else {
                            this.onZqbatchValueChange(datas[0].YHBatchID);
                        }
                    }
                }else{
                    this.onZqbatchValueChange(null);
                }
            });
        }else{
            this.onZqbatchValueChange(null);
            console.log(3)
        }
    }

    getHenhouse(){
        var DataDate = this.model.conditionPanel.data['DataDate'];
        var ChickenFarmID = this.model.conditionPanel.data['ChickenFarmID'];
        var YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];

        this.detailInstance.dataGrid.dataGrid.instance.refresh();
        if(DataDate&&ChickenFarmID&&ChickenFarmID!="0"&&YHFarmerID){
            let UrlParam = `YHFarmerID=${YHFarmerID}&`;
            UrlParam += `ChickenFarmID=${ChickenFarmID}&`
            UrlParam += 'DataDate=' + new DateTime(DataDate).toString('yyyy-MM-dd')+ '&';
            this.service.getHenhouseByParam(UrlParam).then((res:any) => {
                this.HenhouseSourceall = res;
                if (res.length == 0) {
                    (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                        if (m.HenhouseID) {
                            m['HenhouseID'] = '0';
                            m['HenhouseName'] = '';
                        }
                    })
                }
            });
        } else {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.HenhouseID) {
                    m['HenhouseID'] = '0';
                    m['HenhouseName'] = '';
                }
            })
            this.HenhouseSourceall = [];
        }
    }

    onZqbatchValueChange(value){
        if(this.editFlag){
            return;
        }
        if (value&&value!="0") {
            this.model.toolbar.moreButton.props.disabled = false;
            let filter = [['YHBatchID', '=', value]];
            new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
                filter: filter
            })).load().then((res:any) => {
                    if(res&&res.length>0){
                        this.model.conditionPanel.data['Abstract'] = res[0].DrugAbstract;
                        this.model.conditionPanel.data['AbstractName'] = res[0].DrugAbstractName;
                        this.model.conditionPanel.data['ChickenFarmID'] = res[0].ChickenFarmID;
                        this.model.conditionPanel.data['ChickenFarmName'] = res[0].ChickenFarmName;
                        this.getHenhouse();
                        if(res[0].DrugAbstract==DataDictionary.MaterialSupplyPolicyA){
                            if(res[0].ChickenFarmID&&res[0].ChickenFarmID!="0"){
                                let filter2 = [['ChickenFarmID', '=', res[0].ChickenFarmID]];
                                new DataSource(this.yhBasicSettingODataContext.getYHChickenFarmRelateDataSource({
                                    filter: filter2
                                })).load().then((result:any) => {
                                    if(result&&result.length>0){
                                        this.model.conditionPanel.data['InWarehouse'] = result[0].DrugWarehouseID;
                                        this.model.conditionPanel.data['InWarehouseName'] = result[0].DrugWarehouseName;
                                    }
                                 });
                            }
                        }else{
                            this.model.conditionPanel.data['InWarehouse'] = '0';
                            this.model.conditionPanel.data['InWarehouseName'] = "";
                        }
                    }else{
                        this.HenhouseSourceall = [];
                        this.model.conditionPanel.data['YHBatch'] = '0';
                        this.model.conditionPanel.data['Abstract'] = null;
                        this.model.conditionPanel.data['AbstractName'] = "";
                        this.model.conditionPanel.data['ChickenFarmID'] = null;
                        this.model.conditionPanel.data['ChickenFarmName'] = "";
                        this.model.conditionPanel.data['InWarehouse'] = '0';
                        this.model.conditionPanel.data['InWarehouseName'] = "";
                    }
                });
        }
        else{
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.HenhouseID) {
                    m['HenhouseID'] = '0';
                    m['HenhouseName'] = '';
                }
            })
            this.model.toolbar.moreButton.props.disabled = true;
            this.HenhouseSourceall = [];
            this.model.conditionPanel.data['YHBatch'] = '0';
            this.model.conditionPanel.data['Abstract'] = null;
            this.model.conditionPanel.data['AbstractName'] = "";
            this.model.conditionPanel.data['ChickenFarmID'] = null;
            this.model.conditionPanel.data['ChickenFarmName'] = "";
            this.model.conditionPanel.data['InWarehouse'] = '0';
            this.model.conditionPanel.data['InWarehouseName'] = "";
            this.detailInstance.dataGrid.dataGrid.instance.refresh();
        }
    }

    removeRow() {

        // 底部删除选中行
        // 获取到用户当前选中的key
        // 删除数据的时候需要把数据标记为delete
        if (!this.detailInstance.dataGrid.model.editing.allowUpdating) {
            Notify.toast('当前状态不可以操作', NotifyType.Warning);
            return;
        }
        if((<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length==0){
            return;
        }
        if (this.detailInstance.dataGrid.selectRowIndex == -1) {
            this.detailInstance.dataGrid.dataGrid.instance.deleteRow((<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length - 1);
            // splice源数据删除
            let deletedRowData = (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).splice(
                (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length - 1,
                1
            );
            if (deletedRowData[0].target != DataStatus.newline) {
                deletedRowData[0].target = DataStatus.deleted;
                this.detailInstance.dataGrid.$deletedData.push(...deletedRowData);
            }
        } else {
            this.detailInstance.dataGrid.dataGrid.instance.deleteRow(this.detailInstance.dataGrid.selectRowIndex);
            let deletedRowData = (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).splice(this.detailInstance.dataGrid.selectRowIndex, 1);
            if (deletedRowData[0].target != DataStatus.newline) {
                deletedRowData[0].target = DataStatus.deleted;
                this.detailInstance.dataGrid.$deletedData.push(...deletedRowData);
            }
        }
        this.detailInstance.dataGrid.dataGrid.instance.refresh();
        if (this.detailInstance.dataGrid.model.commandColumn.deleteButton.onClick) {
            this.detailInstance.dataGrid.model.commandColumn.deleteButton.onClick();
        }
        this.detailInstance.dataGrid.selectRowIndex = -1;
        this.setReadOnly();
    }
    queryDetail(){
        this.service
            .getCustomDataSourceById(this.numericalOrder)
            .load()
            .then((value: Array<any>) => {
                this.model.toolbar.moreButton.props.disabled = false;
                this.editFlag = true;
                this.model.dataGrid.props.dataSource = value;
                this.model.dataGrid.props.dataSource.map((m) => (m.target = DataStatus.none));
                this.model.conditionPanel.data = value[0];
                this.detailInstance.cacheSearchData = deepCopy(value[0]);
                this.detailInstance.cacheBodyData = deepCopy(value);
                //开启审核功能
                this.model.review.visible = true;
                this.model.review.numericalOrder = this.numericalOrder;
                this.model.review.ownerName = value[0].CreatedOwnerName;
                this.getHenhouse();
                this.setReadOnly();
                setTimeout(() => {
                    this.detailInstance.saveDataAfterStatus();
                    this.editFlag = false;
                }, 200);
            });
    }
    //#region 初始化数据源
    initialization(e: NxZlwFormDetailComponent) {
        this.service.getClosedInTheCurrent().then((res)=>{
            if(res){
                // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.visible  = false;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.disabled  = true;
            }else{
                // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.visible  = true;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.disabled  = false;
            }
        })
        e.isRightReview = true;//禁用右键
        //详情进入编辑页面
        if (this.route.queryParams['value']['$open'] == FormOptions.$modify) {
            setTimeout(() => {
                this.queryDetail();
            }, 500);
        } else {
            setTimeout(() => {
                this.create();
            }, 500);
        }
        setTimeout(() => {
            this.detailInstance.dataGrid.removeRow = this.removeRow.bind(this);
        }, 1000);
    }

    setReadOnly(){
        // var flag = false;
        // (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
        //     if((m.ProductID&&m.ProductID!="0")||(m.HenhouseID&&m.HenhouseID!="0")){
        //         flag = true;
        //         return false;
        //     }
        // })
        // if(flag){
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly = true;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly = true;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHFarmerID")[0].widget.props.readOnly = true;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "OutWarehouse")[0].widget.props.readOnly = true;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "ReceiveType")[0].widget.props.readOnly = true;
        // }
        // else{
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly = false;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHFarmerID")[0].widget.props.readOnly = false;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "OutWarehouse")[0].widget.props.readOnly = false;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "ReceiveType")[0].widget.props.readOnly = false;
        // }
    }
    //#endregion

    //跳转模板
    jump() {
        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=引种入舍`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=引种入舍`
                );
            }
        );
    }
    //自定义打印
    getSource(e) {
        if (e.status) {

            var tabid1 = [];
            var totalAmount=0;
            this.detailInstance.dataGrid.dataGrid.instance.getVisibleRows().map((m: any, index) => {
                var obj = {
                    XuHao: index + 1,
                    ProductName: m.data.ProductName,
                    CommonName:m.data.CommonName,
                    bIsStandardPack:m.data.bIsStandardPack?'是':'否',
                    Specification:m.data.Specification,
                    StandardPack:m.data.StandardPack,
                    ProductBatchName:m.data.ProductBatchName,
                    ValidDate:m.data.ValidDate,
                    Quantity:m.data.Quantity,
                    Packages:m.data.Packages,
                    MeasureUnitName:m.data.MeasureUnitName,
                    UnitPrice:m.data.UnitPrice,
                    AmountTotal:m.data.AmountTotal,
                    Gift:m.data.Gift?'是':'否',
                    HenhouseName:m.data.HenhouseName,
                    DetailRemarks:m.data.DetailRemarks,
                    NumberSource:m.data.NumberSource,
                    LySerialNo:m.data.LySerialNo,
                    LyProductName:m.data.LyProductName,
                    LyMeasureUnitName:m.data.LyMeasureUnitName,
                    LyCommonName:m.data.LyCommonName,
                    LyQuantity:m.data.LyQuantity,
                };
                totalAmount+=m.AmountTotal==''?0:m.AmountTotal;
                totalAmount=Number(totalAmount.toFixed(2));
                tabid1.push(obj);
            });
            var tabId0 = {
                   //日期
                   DataDate: new DateTime(this.model.conditionPanel.data['DataDate']).toString(),
                   //仓库
                   OutWarehouseName:  this.model.conditionPanel.data['OutWarehouseName'] == undefined ? '': this.model.conditionPanel.data['OutWarehouseName'],
                   //养户
                   YHFarmerName:  this.model.conditionPanel.data['YHFarmerName'] == undefined ? '': this.model.conditionPanel.data['YHFarmerName'],
                   //批次
                   YHBatchName:  this.model.conditionPanel.data['YHBatchName'] == undefined ? '': this.model.conditionPanel.data['YHBatchName'],
                   //类型
                   ReceiveTypeName:  this.model.conditionPanel.data['ReceiveTypeName'] == undefined ? '': this.model.conditionPanel.data['ReceiveTypeName'],
                   //摘要
                   AbstractName:this.model.conditionPanel.data['AbstractName'] == undefined ? '': this.model.conditionPanel.data['AbstractName'],
                   //养殖场
                   ChickenFarmName:this.model.conditionPanel.data['ChickenFarmName'] == undefined ? '': this.model.conditionPanel.data['ChickenFarmName'],
                   //入库仓库
                   InWarehouseName:this.model.conditionPanel.data['InWarehouseName'] == undefined ? '': this.model.conditionPanel.data['InWarehouseName'],
                   //期初
                   isbegin:this.model.conditionPanel.data['isbegin'] == false ? '否': '是',
                   //养户确认
                   ConfirmStatus:this.model.conditionPanel.data['ConfirmStatus'] == false ?'否': '是',
                   //单位
                   EnterpriseName:USER_INFO_CONTEXT.enterpriseName,
                   // 单据号
                   Number:this.model.conditionPanel.data['Number'] == undefined ? '': this.model.conditionPanel.data['Number'],
                   // 说明
                   Remarks:this.model.conditionPanel.data['Remarks'] == undefined ? '': this.model.conditionPanel.data['Remarks'],
                   // 制单人
                   creatorName: this.model.review.ownerName,
                   // 审核人
                   auditerName: this.model.review.reviewName,
            };
            let sources = {
                tabId0: tabId0,
                tabId1: tabid1,
            };
            var direct =false;
            if (e.isDirect) {
                direct = true;
            }
            this._printPage.instance.printGeneration(sources, false, false, null, { isDirect: direct,});
        }
    }

    onEditorPreparingFn2(e) {
        // 判单值发生改变 自动勾选
        if (e.dataField && e.row.rowType == 'data') {
            const rowData = e.row.data;
            if (e.dataField == 'Quantity') {
                e.editorOptions.onValueChanged = (_e) => {
                    if (this.selectedRows.indexOf(e.row.key) === -1) {
                        this.selectedRows.push(e.row.key)
                    }
                    let rowData2 = this.AutoDataSourceFilter.find((m) => m['DetailID'] == rowData['DetailID']);
                    var StandardPack = rowData2['StandardPack'];
                    var bIsStandardPack = rowData2['bIsStandardPack']
                    if(!_e.value){
                        _e.value =0;
                    }
                    if (StandardPack && bIsStandardPack) {
                        var ss = Number(_e.value).toFixed(4);
                        if(Number(StandardPack)!=0){
                            rowData2['Packages'] = (Number(ss)/Number(StandardPack)).toFixed(4);
                        }
                    }
                    rowData2['Quantity'] = Number(_e.value).toFixed(4);
                    this.dataGridRef.instance.refresh();
                };
            }
            else if (e.dataField == 'Packages') {
                e.editorOptions.onValueChanged = (_e) => {
                    if (this.selectedRows.indexOf(e.row.key) === -1) {
                        this.selectedRows.push(e.row.key)
                    }
                    let rowData2 = this.AutoDataSourceFilter.find((m) => m['DetailID'] == rowData['DetailID']);
                    var StandardPack = rowData2['StandardPack'];
                    var bIsStandardPack = rowData2['bIsStandardPack']
                    if(!_e.value){
                        _e.value =0;
                    }
                    if (StandardPack && bIsStandardPack) {
                        var ss = Number(_e.value).toFixed(4);
                        if(Number(StandardPack)!=0){
                            rowData2['Quantity'] = (Number(ss)*Number(StandardPack)).toFixed(4);
                        }
                    }
                    rowData2['Packages'] = Number(_e.value).toFixed(4);
                    this.dataGridRef.instance.refresh();
                };
            }
        }
    }
}
