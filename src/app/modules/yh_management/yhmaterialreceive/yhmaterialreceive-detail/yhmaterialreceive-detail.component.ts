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
    QlwCustomerContext
} from 'src/app/providers/odataContext';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { NxDataGridColumnValidationRule } from 'src/app/components/component-model/data-grid/columns/validation-rule/model';
import { RegExps } from 'src/app/providers/regexp';
import { DateTime } from 'src/app/providers/common/datetime';
import { YhMaterialReceiveService } from '../yhmaterialreceive.service';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { TokenAuthService } from 'src/app/shared/services';
import { YhMaterialReceiveAdd } from '../yhmaterialreceive.model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { groupBy } from 'src/app/providers/groupby';
import { PrintPageComponent } from 'nxin-print';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { dealBigMoney,Distinct } from 'src/app/providers/distinct';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { ToolbarPanelType } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import DataSource from 'devextreme/data/data_source';
import { NxDropDownButtonItem } from 'src/app/components/component-model/drop-down-button/model';
import { ignoreElements } from 'rxjs-compat/operator/ignoreElements';

@Component({
    selector: 'yhmaterialreceive-detail',
    templateUrl: './yhmaterialreceive-detail.component.html',
    styleUrls: ['./yhmaterialreceive-detail.component.scss'],
})
export class YhMaterialReceiveDetailComponent {
    @ViewChild('detailInstance', { static: false })
    detailInstance: NxZlwFormDetailComponent;
    model: NxFormDetail = new NxFormDetail();
    /**
     * 流水号
     */
    numericalOrder: string;
    @ViewChild('dataGrid', { static: false })
    dataGrid: DxDataGridComponent;

    batchSource: any = [];
    productSource: any;
    currentCount: number = 0;
    iNumericalOrderPlan: string = '0';
    TotalFormData : any={
        TotalDataDate:"",
        TotalQuantity:"",
        TotalValueQuantity:"",
        TotalYHBatchName:""
    };
    dataDateFlag: boolean = false;
    pcDate: string;
    DaysOld: Number;

    editFlag : boolean = false;

    allProductBatchSource: any;
    //打印
    menu_id: string;
    environment: any;
    tokenData: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    printDataSource:any=[];

    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;
    outVisible: boolean = false;
    formData: any = {};
    $form: boolean = false;
    AutoDataSource: any;
    AutoDataSourceFilter: any;
    selectedRows: any;
    cProductNameSource: any;
    OutHouseNameSource: any;

    loading: boolean = false;
    zqHenhouseSource: any;
    BatchDataSource: any;
    ChickenFarmDataSource: any;

    HenhouseSourceall:any
    modifyVisible: boolean = false;

    HenhouseBydataSource: any;
    YHFarmerContract: string;
    //#endregion
    constructor(
        private route: ActivatedRoute,
        private service: YhMaterialReceiveService,
        private http: HttpClient,
        private qlwOdataContext: QlwODataContext,
        private tokenService: TokenAuthService,
        private basicSettingODataContext: BasicSettingODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private translator: TranslateService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private StatusODataContext: StatusODataContext
    ) {
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.model.initialization = this.initialization.bind(this);

        this.service.getProductBatch().then((res:any)=>{
            this.allProductBatchSource = res.value;
        });

        this.cProductNameSource = this.basicSettingODataContext.getBizProductannexedDataSource({
            filter: [
                ['iSortPlus', '=', DataDictionary.iSortF],
            ],
            select: ['ProductID', 'cProductName'],
        });

        let Param = 'groupBy=m.HenhouseID';
        this.service.getBatchByDataDateAndHenhouse(<any>Param).then((res:any) => {
            this.zqHenhouseSource = res.value;
        })

        // new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource()).load().then((res:any) => {
        //     this.BatchDataSource = res
        // })
        this.YHBasicSettingODataContext.YHBatch.load().then((res:any) => {
            this.BatchDataSource = res
        })

        this.basicSettingODataContext.bizChickenFarm.load().then((res:any) => {
            this.ChickenFarmDataSource = res
        })

        // this.service.getHenhouseByParam('').then((res:any) => {
        //     this.HenhouseSourceall = res;
        // })

        this.OutHouseNameSource = this.basicSettingODataContext.getZqHenhouseDataSource({
            // filter: [['ChickenFarmID ', '<>','0']],
            select: ['HenHouseID', 'HenHouseName'],
        });
        this.init_data_grid().init_table_header().init_toolbar_panel();
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
    }
    //#region 初始化表格
    init_data_grid(): YhMaterialReceiveDetailComponent {
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.stateStoring.storageKey = 'YhMaterialReceive-detail';
        this.model.dataGrid.stateStoring.enabled = true;
        this.model.dataGrid.columns.push(...this.columns);
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.summary.enabled = true;

        const summaryItem_total_Packages = new NxDataGridSummaryTotal();
        summaryItem_total_Packages.column = 'Packages';
        summaryItem_total_Packages.summaryType = 'sum';
        summaryItem_total_Packages.valueFormat = '4';

        const summaryItem_total_Quantity = new NxDataGridSummaryTotal();
        summaryItem_total_Quantity.column = 'Quantity';
        summaryItem_total_Quantity.summaryType = 'sum';
        summaryItem_total_Quantity.valueFormat = '4';

        const summaryItem_total_AmountTotal = new NxDataGridSummaryTotal();
        summaryItem_total_AmountTotal.column = 'AmountTotal';
        summaryItem_total_AmountTotal.summaryType = 'sum';
        summaryItem_total_AmountTotal.valueFormat = '4';

        this.model.dataGrid.summary.totalItems = [summaryItem_total_Packages,summaryItem_total_Quantity,summaryItem_total_AmountTotal];
        this.model.dataGrid.events.onCellClick = this.handleCell.bind(this);
        this.model.dataGrid.paginate.pager.visible = 'auto';
        this.model.dataGrid.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);
        return this;
    }

    get columns() {
        //栋舍
        const col_HenHouseName = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.HenhouseID.text,
            'HenhouseID',
            'string',
            'HenhouseName'
        );
        col_HenHouseName.props.width = 120;
        col_HenHouseName.props.alignment = 'center';
        col_HenHouseName.props.lookup.enabled = true;
        col_HenHouseName.props.lookup.dataSource = [];
        col_HenHouseName.props.lookup.valueExpr = 'HenhouseID';
        col_HenHouseName.props.lookup.displayExpr = 'HenhouseName';
        col_HenHouseName.props.setCellValue = (newdata, value, oldData) => {
            var res = this.HenhouseBydataSource.filter((o) => o.HenhouseID == value);
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    m['HenhouseID'] = value;
                    m['HenhouseName'] = res[0].HenhouseName;
                }
            })
        };
        // const col_HenHouseName_required = new NxDataGridColumnValidationRule('required');
        // col_HenHouseName_required.message = this.translator.I18N.YhMaterialReceiveDetail.HenhouseID.required;
        // col_HenHouseName.validationRules.push(...[col_HenHouseName_required]);

        //商品代号
        const col_ProductID = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.ProductName.text,
            'ProductID',
            'string',
            'ProductName'
        );
        col_ProductID.props.width = 120;
        col_ProductID.props.requiredDisable = true;
        // col_ProductID.props.lookup.enabled = true;
        // col_ProductID.props.allowEditing = true;
        col_ProductID.props.HeaderRequiredIcon = true;
        col_ProductID.props.cellTemplate.widget = new NxSelectBox();
        col_ProductID.props.cellTemplate.enabled = true;
        col_ProductID.props.cellTemplate.type = 'SelectBox';
        col_ProductID.props.cellTemplate.templateName = "aName";
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.dataSource = this.basicSettingODataContext.getProductDataSource({
            filter: [
                ['iSortPlus', '=', DataDictionary.iSortA],
                'or',
                ['iSortPlus', '=', DataDictionary.iSortK]
            ],
            // select: ['ProductID', 'cProductName','MnemonicCode'],
        });
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.valueExpr = 'ProductID';
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.displayExpr = 'ProductName';
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchExpr = ['ProductID','ProductName','MnemonicCode'];
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchEnabled = true;
        const col_ProductID_required = new NxDataGridColumnValidationRule('required');
        col_ProductID_required.message = this.translator.I18N.YhMaterialReceiveDetail.ProductName.required;
        col_ProductID.validationRules.push(...[col_ProductID_required]);
        col_ProductID.props.setCellValue = (newdata, value, oldData) => {
            if (value) {
                var iSort = 'ProductID=' + value + '&';
                this.service
                    .getProduct(<any>iSort)
                    .then((result: any) => {
                        (<Array<any>>this.model.dataGrid.props.dataSource).map(async (m) => {
                            if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                                if (DataDictionary.MaterialSupplyPolicyA != this.model.conditionPanel.data['Abstract']) {
                                    let UrlParam = 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd')+ '&';
                                    UrlParam += 'ProductCollectType=' + DataDictionary.ProductCollectTypeB + '&';
                                    if (this.model.conditionPanel.data['YHFarmerID']) {
                                        UrlParam += 'YHFarmerID=' + this.model.conditionPanel.data['YHFarmerID'] + '&';
                                    }
                                    if (this.model.conditionPanel.data.YHBatch) {
                                        UrlParam += 'YHBatchID=' + this.model.conditionPanel.data.YHBatch + '&';
                                    }
                                    UrlParam += 'ProductID=' + value + '&';
                                    this.loading = true;
                                    await this.service.getGetUnitPrice(UrlParam).then( (res:any) => {
                                        this.loading = false;
                                        if(res&&res.length>0){
                                            m['UnitPrice'] = res[0].UnitPrice;
                                        }
                                    })
                                }
                                m['ProductID'] = value;
                                m['ProductName'] = result.value[0].cProductName;
                                m['Specification'] = result.value[0].Specification;
                                m['StandardPack'] = result.value[0].StandardPack;
                                m['bIsStandardPack'] = result.value[0].bIsStandardPack;
                                m['MeasureUnitName'] = result.value[0].MeasureUnitName;

                                setTimeout(() => {
                                    this.setReadOnly();
                                    this.detailInstance.dataGrid.refresh();
                                }, 10);
                            }
                        });

                        // this.model.dataGrid.props.dataSource = deepCopy(this.model.dataGrid.props.dataSource);
                    });
            } else {
                (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                    if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                        m['ProductID'] = '';
                        m['ProductName'] = '';
                        m['MeasureUnitName'] = '';
                        m['Specification'] = null;
                        m['StandardPack'] = null;
                        m['bIsStandardPack'] = null;
                        m['bIsStandardPackName'] = null;

                    }
                });
                this.setReadOnly();
                this.detailInstance.dataGrid.refresh();
            }
        }

        const col_Specification = new NxDataGridColumn(
            this.translator.I18N.EggGoodsSalesOrderDetail.Specification.text,
            'Specification',
            'string'
        );
        col_Specification.props.visible = true;
        col_Specification.props.allowEditing = false;
        col_Specification.props.width=100;
        col_Specification.props.alignment = 'center';


        const col_StandardPack = new NxDataGridColumn(
            '标包',
            'StandardPack',
            'string'
        );
        col_StandardPack.props.visible = true;
        col_StandardPack.props.allowEditing = false;
        col_StandardPack.props.width=100;
        col_StandardPack.props.alignment = 'center';

        const col_bIsStandardPack = new NxDataGridColumn(
            '标品',
            'bIsStandardPack',
            'string'
        );
        col_bIsStandardPack.props.visible = true;
        col_bIsStandardPack.props.allowEditing = false;
        col_bIsStandardPack.props.width=100;
        col_bIsStandardPack.props.alignment = 'center';
        col_bIsStandardPack.props.lookup.enabled = true;
        col_bIsStandardPack.props.lookup.dataSource = DataDictionarySource.blImmunitySource;
        col_bIsStandardPack.props.lookup.valueExpr = 'value';
        col_bIsStandardPack.props.lookup.displayExpr = 'name';

        //批号
        const col_ProductBatchID = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.ProductBatchID.text,
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
        col_ProductBatchID.props.lookup.valueExpr = 'ProductBatchID';
        col_ProductBatchID.props.lookup.displayExpr = 'ProductBatchName';

        //计量单位
        const col_MeasureUnitName = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.MeasureUnitName.text,
            'MeasureUnitName',
            'string',
        );
        col_MeasureUnitName.props.lookup.enabled = true;
        col_MeasureUnitName.props.allowEditing = false;
        col_MeasureUnitName.props.width=100;
        col_MeasureUnitName.props.alignment = 'center'

        // 单价
        const col_UnitPrice = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.UnitPrice.text,
            'UnitPrice',
            'number'
        );
        col_UnitPrice.props.width = 120;
        col_UnitPrice.props.alignment = 'right';
        col_UnitPrice.props.HeaderRequiredIcon = true;
        col_UnitPrice.props.requiredDisable = true;
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
                        AmountTotal = Number(oldData.Quantity) * value;
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

        //金额
        const col_AmountTotal = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.AmountTotal.text,
            'AmountTotal',
            'number'
        );
        col_AmountTotal.props.width = 120;
        col_AmountTotal.props.HeaderRequiredIcon = true;
        col_AmountTotal.props.alignment = 'right';
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
                        Quantity = value / Number(UnitPrice);
                    }
                    if(oldData.Quantity && oldData.Quantity != 0){
                        Quantity = oldData.Quantity;
                        UnitPrice = value / Number(Quantity);
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

        // 件数
        const col_Packages = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.Packages.text,
            'Packages',
            'number'
        );
        col_Packages.props.width = 120;
        col_Packages.props.alignment = 'right';
        col_Packages.props.visible = true;
        const col_Packages_pattern = new NxDataGridColumnValidationRule();
        col_Packages_pattern.type = 'pattern';
        col_Packages_pattern.pattern = RegExps.AllNumber4;
        col_Packages_pattern.message = this.translator.I18N.YhMaterialReceiveDetail.Packages.patternMessage;
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

        // 数量
        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.YhMaterialReceiveDetail.Quantity.text,
            'Quantity',
            'number'
        );
        col_Quantity.props.width = 120;
        col_Quantity.props.visible = true;
        col_Quantity.props.alignment = 'right';
        col_Quantity.props.HeaderRequiredIcon = true;
        const col_Quantity_pattern = new NxDataGridColumnValidationRule();
        col_Quantity_pattern.type = 'pattern';
        col_Quantity_pattern.pattern = RegExps.AllNumber4;
        col_Quantity_pattern.message = this.translator.I18N.YhMaterialReceiveDetail.Quantity.patternMessage;
        col_Quantity.validationRules.push(...[col_Quantity_pattern]);
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

                    if (StandardPack || bIsStandardPack) {
                        m['Packages'] = value/StandardPack;
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

        //赠送
        const col_Gift = new NxDataGridColumn(this.translator.I18N.EggGoodsSalesOrderDetail.Gift.text, 'Gift', 'boolean');
        col_Gift.props.width=100;
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

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.Remarks.text, 'DetailRemarks');
        col_Remarks.props.width = 120;
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = false;
        col_Remarks.props.filterOperations = ['contains'];


        return [
            col_ProductID,
            col_Specification,
            col_bIsStandardPack,
            col_StandardPack,
            col_ProductBatchID,
            col_Packages,
            col_Quantity,
            col_MeasureUnitName,
            col_UnitPrice,
            col_AmountTotal,
            col_Gift,
            col_HenHouseName,
            col_Remarks,
        ];
    }

    onEditorPreparingFn(e) {
        if (e.parentType == 'dataRow') {
            const defaultValueChangeEvent = e.editorOptions.onValueChanged;
            const rowData = e.row.data;
            let triggerValueChanged = true;
            switch (e.dataField) {
                case 'HenhouseID' :
                    e.editorOptions.dataSource = this.HenhouseBydataSource;
                    this.setReadOnly();
                    break;
                case 'ProductBatchID' :
                    var ProductID = e.row.data['ProductID'];
                    var ProductBatchID = e.row.data['ProductBatchID'];
                    var dataSource = [];
                    if (ProductID) {
                        dataSource = this.allProductBatchSource.filter((o) => o.ProductID == ProductID);
                    }
                    e.editorOptions.dataSource = Distinct(dataSource, 'ProductBatchID');
                    break;
                default:
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

    onSearch() {

        let UrlParam = 'BillType=2201131629250001455&iSortPlus='+DataDictionary.iSortF+'&';

        UrlParam += 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd') + '&WarehouseID=' + this.model.conditionPanel.data.OutWarehouse + '&';
        if (this.numericalOrder) {
            UrlParam += 'NumericalOrder=' + this.numericalOrder + '&';
        }
        if (this.formData.ProductID) {
            UrlParam += 'ProductID=' + this.formData.ProductID + '&';
        }
        UrlParam += 'groupBy=md.ProductID,mt.BatchID&';
        this.loading = true;
        this.service.getQLWWarehouseStock(UrlParam).then( (res:any) => {
            this.AutoDataSourceFilter = [];
            this.loading = false;
            var selectedRowsData11 = res.value;
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            if (oldData && oldData.length > 0) {
                selectedRowsData11.forEach((f) => {
                    oldData.forEach((row) => {
                        if (f.HenhouseID == row.HenhouseID && f.BatchID == row.BatchID && f.SexType==row.SexType) {
                            var Quantity = Number(f.cQuantity);
                            var cQuantity = 0;
                            if (row.Quantity) {
                                cQuantity = Number(row.Quantity);
                                f.cQuantity = Quantity - Number(row.Quantity);
                            }
                            f.cQuantity = Quantity - cQuantity;
                        }
                    });
                });
            }
            var data = [];
            selectedRowsData11.forEach((f) => {
                if (f.cQuantity && Number(f.cQuantity) > 0) {
                    f.DetailID = new DateTime().randomValue.toString();
                    data.push(f);
                }
            });
            this.AutoDataSource = data;
            this.AutoDataSourceFilter = data;
            // res.value.forEach((f) => {
            //     if (f.cQuantity && Number(f.cQuantity) > 0) {
            //         f.DetailID = new DateTime().randomValue.toString();
            //         this.AutoDataSourceFilter.push(f);
            //     }
            // });

        })
    }

    reset() {
        this.AutoDataSourceFilter = deepCopy(this.AutoDataSource);
    }

    farConfirm() {

    }

    farCancel() {

    }

    onEditorPreparingFn2(e) {
        if (e.dataField && e.row.rowType == 'data') {
            const rowData = e.row.data;
            // let rowData2 = this.AutoDataSource.find((m) => m['RecordID'] == rowData['RecordID']);
            // if(e.dataField == 'cQuantity'){
            //     e.editorOptions.onValueChanged = (_e) => {
            //         if (this.selectedRows.indexOf(e.row.key) === -1) {
            //             this.selectedRows.push(e.row.key)
            //         }
            //         rowData2[e.dataField] = Number(_e.value);
            //         this.dataGridRef.instance.refresh();
            //     }
            // }else if (e.dataField == 'RemarksDetail') {
            //     e.editorOptions.onValueChanged = (_e) => {
            //         this.AutoDataSource.map((m) => {
            //             if (rowData.RecordID == m.RecordID) {
            //                 m['RemarksDetail'] = _e.value;
            //             }
            //         });
            //         this.dataGridRef.instance.refresh();
            //     };
            // }
        }
    }

    getSelection(type) {
        if (type == '3') {
            this.outVisible = false;
            this.AutoDataSourceFilter = [];
            return false;
        }
    }

    onPopupHiding() {
        // this.outVisible = false;
        // this.AutoDataSourceFilter = [];
        // this.AutoDataSource = [];
    }

    handleCell(e) {
    }
    //#endregion
    //#region 初始化工具条
    init_toolbar_panel(): YhMaterialReceiveDetailComponent {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;
        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).props.visible = false;
        this.model.toolbar.getOtherWidgetByKey('headSetting').props.visible = true;

        //复制
        const but_copyLine = new ToolbarPanelType();
        but_copyLine.key = 'copyLine';
        but_copyLine.widget = new NxButton('参照新增');
        but_copyLine.widget.props.disabled = !this.numericalOrder;
        but_copyLine.widget.events.onClick = this.copyLine.bind(this);
        this.model.toolbar.mainPanel.push(...[but_copyLine]);

        this.model.toolbar.moreButton.props.visible = true;
        this.model.toolbar.moreButton.props.disabled = true;
        this.model.toolbar.moreButton.props.hint = "更多";
        this.model.toolbar.moreButton.props.icon = 'iconfont iconellipsis';
        this.model.toolbar.moreButton.props.showArrowIcon = false;
        this.model.toolbar.moreButton.props.stylingMode = 'text';
        this.model.toolbar.moreButton.props.dropDownOptions = { width: 130 };
        this.model.toolbar.moreButton.props.items = [
            new NxDropDownButtonItem(
                '领料汇总',
                'lingliaosum',
                'iconfont iconwuzilingyong'
            ),
        ];
        this.model.toolbar.moreButton.props.displayExpr = 'text';
        this.model.toolbar.moreButton.events.onItemClick = (e) => {
            if (e.type == 'lingliaosum') {
                this.addHang();
            }
        };
        this.model.toolbar.moreButton.props.disabled = true;
        return this;
    }
    //复制
    async copyLine() {
        this.model.conditionPanel.data.NumericalOrder = '';
        this.numericalOrder = '';
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data.DataDate = new DateTime(new Date()).toString('yyyy-MM-dd');
        var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
        var ids = [];
        for (let index = 0; index < oldData.length; index++) {
            const element = oldData[index];
            element.Packages = null;
            element.Quantity = null;
            element.UnitPrice = null;
            element.AmountTotal = null;
            if(ids.indexOf(element.ProductID) === -1){
                ids.push(element.ProductID);
            }
        }
        let UrlParam = 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd')+ '&';
        UrlParam += 'ProductCollectType=' + DataDictionary.ProductCollectTypeB + '&';
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
    // 批量增行
    addHang () {
        if (!this.model.conditionPanel.data.YHBatch||this.model.conditionPanel.data.YHBatch=="0") {
            return Notify.toast('请选择养户批次！', NotifyType.Error);
        }
        this.outVisible = true;
        let UrlParam = '?DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd') + '&YHBatch=' + this.model.conditionPanel.data.YHBatch + '&';
        this.loading = true;
        this.service.MaterialReceiveTotal(UrlParam).then( (res:any) => {
            this.loading = false;
            this.TotalFormData ={
                TotalDataDate:"",
                TotalQuantity:"",
                TotalValueQuantity:"",
                TotalYHBatchName:""
            };
            var dets=[];
            if(res.data&&res.data.length>0){
                this.TotalFormData.TotalDataDate = res.data[0].DataDate;
                this.TotalFormData.TotalQuantity = res.data[0].TotalQuantity;
                this.TotalFormData.TotalValueQuantity = res.data[0].ValueQuantity;
                this.TotalFormData.TotalYHBatchName = res.data[0].YHBatchName;
                dets = res.data[0].dets;
            }
            this.AutoDataSourceFilter = dets;
        })

    }
    create() {
        this.model.toolbar.moreButton.props.disabled = true;
        this.model.conditionPanel.data = {};
        this.detailInstance.cacheSearchData = {};
        this.model.conditionPanel.data['DataDate'] = new Date();
        this.service.getNearCalcFeeStatus().then((res:any) => {
            this.model.conditionPanel.data['CalcFeeStatus'] = res.CalcFeeStatus ? 1 : 0;
        })
        this.model.conditionPanel.data['isbegin'] = false;
        this.model.conditionPanel.data['YHBatch'] = null;
        this.model.conditionPanel.data['YHFarmerID'] = null;
        this.model.conditionPanel.data['ReceiveType'] = DataDictionary.ReceiveTypeA;
        this.model.conditionPanel.data['ConfirmStatus'] = 0;
        // this.detailInstance.cacheSearchData['ChickenSource'] = DataDictionary.ChickenSourceB; //赋值ID
        // this.model.conditionPanel.data['FreightFor'] = '201612090104402201';
        // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "SupplierID")[0].required = true;
        this.model.conditionPanel.data.NumericalOrder = '';
        this.numericalOrder = '';
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data.Remarks = '';
        this.model.dataGrid.type = 'detail';
        this.detailInstance.$open = FormOptions.$create;
        this.model.review.visible = false;
        this.getWarehouse(USER_INFO_CONTEXT.childId);
        this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);

        setTimeout(() => {
            this.detailInstance.createDataStatus(undefined,5);
            // this.setReadOnly();
        }, 20);
    }
    save() {

        if (this.model.conditionPanel.data['Abstract'] == DataDictionary.MaterialSupplyPolicyA && (!this.model.conditionPanel.data['InWarehouse'] || this.model.conditionPanel.data['InWarehouse']=="0")) {
            return Notify.toast('养殖场仓库不能为空，请先在养殖场设置中设置该养殖场的饲料仓库！', NotifyType.Error);
        }
        var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
        if (this.model.conditionPanel.data['ReceiveType'] == DataDictionary.ReceiveTypeB) {
            for (let i = 0; i < oldData.length; i++) {
                const element = oldData[i];
                if (element.Quantity > 0) {
                    return Notify.toast('退回的数量必须需为负数!', NotifyType.Error);
                }
            }
        }
        this.detailInstance.saveChanges().then((value) => {

            const data = this.getSaveData(value);
            if(data){
                var cos = [];
                value.body.map((m) => {
                    var obj = cos.filter(o => o.ProductID === m.ProductID);
                    if(obj && obj.length>0){
                        obj[0].Quantity += Number(m.Quantity);
                    }
                    else{
                        cos.push({
                            ProductID: m.ProductID,
                            Quantity: Number(m.Quantity)
                        })
                    }
                });
                var param={
                    DataDate:new DateTime(value.header.DataDate.toString()).toString('yyyy-MM-dd'),
                    NumericalOrder : value.header.NumericalOrder || '0',
                    YHBatch : value.header.YHBatch || '0',
                    BreedingID: value.header.BreedingID || '0',
                    dets : cos
                }
                this.service.check(param).then((result: Result) => {
                    if(result.msg){
                        MessageBox.confirm(
                            result.msg,
                            this.translator.I18N.commandOptions.delete.confirmTitle
                        ).then((require) => {
                            if (require) {
                                this.saveNew(data);
                            }
                        });
                    }else{
                        this.saveNew(data);
                    }
                })
            }

        });
    }

    saveNew(data){
        if (data) {
            this.detailInstance.openCheck(
                () => {
                    this.detailInstance.loading = true;
                    this.service.create(data).then((result: Result) => {
                        const response = ResponseSuccess.handle(result);
                        this.detailInstance.loading = false;
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
                            this.detailInstance.messageBox.show(response.message);
                            this.detailInstance.saveDataError();
                        }
                    });
                },
                () => {
                    if (this.detailInstance.reviewValidation()) {
                        this.detailInstance.loading = true;
                        this.service.update(data).then((result: Result) => {
                            this.detailInstance.loading = false;
                            const res = ResponseSuccess.handle(result);
                            if (res.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                this.queryDetail();
                            } else {
                                this.detailInstance.messageBox.show(res.message);
                                this.detailInstance.saveDataError();
                            }
                        });
                    }
                }
            );
        }
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
            ['ProductID', this.translator.I18N.YhMaterialReceiveDetail.ProductName.required],
            ['Quantity', this.translator.I18N.YhMaterialReceiveDetail.Quantity.message],
            ['UnitPrice', this.translator.I18N.YhMaterialReceiveDetail.UnitPrice.message],
            ['AmountTotal', this.translator.I18N.YhMaterialReceiveDetail.AmountTotal.message],
        ]);
        return validator.validation;
    }
    private getSaveData(value) {
        const validation = this.dataValidation(value.body);
        if (validation) {
            let saveData = new YhMaterialReceiveAdd();
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
            saveData.Driver = value.header.Driver || '0';
            saveData.ReceiveType = value.header.ReceiveType || '0';
            saveData.ConfirmStatus = value.header.ConfirmStatus;
            saveData.BreedingID = value.header.BreedingID || '0';
            saveData.CalcFeeStatus = value.header.CalcFeeStatus ;
            saveData.ComboPack = value.header.ComboPack || DataDictionary.ComboPackA;
            saveData.isbegin = value.header.isbegin || false;
            value.body.map((m) => {
                saveData.MaterialReceiveDetailDto.push({
                    NumericalOrder: m.NumericalOrder || '0',
                    NumericalOrderDetail: m.NumericalOrderDetail || '0',
                    DetailRemarks: m.DetailRemarks || '',
                    HenhouseID: m.HenhouseID || '0',
                    StandardPack: m.StandardPack || '0',
                    Specification: m.Specification || '0',
                    ProductID: m.ProductID,
                    ProductBatchID: m.ProductBatchID || '0',
                    MeasureUnitName: m.MeasureUnitName || '',
                    UnitPrice: Number(m.UnitPrice),
                    AmountTotal: Number(m.AmountTotal),
                    Packages: m.Packages || 0,
                    Quantity: Number(m.Quantity),
                    Gift: m.Gift,
                    BreedingID: m.BreedingID || '0',
                    Remarks: m.DetailRemarks,
                    Target: m.target,
                });
            });
            if (this.detailInstance.$open == FormOptions.$modify) {
                saveData.MaterialReceiveDetailDto.push(...value.deleted);
            }
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }

    getHenhouse() {
        let DataDate = this.model.conditionPanel.data['DataDate'];
        let ChickenFarmID = this.model.conditionPanel.data['ChickenFarmID'];
        let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
        let page = '';
        if (DataDate) {
            page += `DataDate=${new DateTime(DataDate).toString('yyyy-MM-dd')}&`
        }
        if (YHFarmerID && YHFarmerID != '0') {
            page += `YHFarmerID=${YHFarmerID}&`
        }
        if (ChickenFarmID && ChickenFarmID != '0') {
            page += `ChickenFarmID=${ChickenFarmID}&`
        }

        if (ChickenFarmID && ChickenFarmID != '0') {
            this.service.getHenhouseByParam(page).then((res:any) => {
                this.HenhouseBydataSource = res;
            })
        }
    }
    //#endregion

    //#region  表头配置
    init_table_header(): YhMaterialReceiveDetailComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        const condition_ChickenFarmID = new NxConditionItem();
        condition_ChickenFarmID.required = false;
        condition_ChickenFarmID.requiredDisable = true;
        condition_ChickenFarmID.label = '养殖场';
        condition_ChickenFarmID.dataField = 'ChickenFarmID';
        condition_ChickenFarmID.type = 'SelectBox';
        condition_ChickenFarmID.widget = new NxSelectBox();
        condition_ChickenFarmID.widget.props.showClearButton = false;
        condition_ChickenFarmID.widget.props.readOnly = true;
        condition_ChickenFarmID.widget.props.dataSource = this.basicSettingODataContext.getBizChickenFarmDataSource({
            filter: CHICKEN_FARM_CONTEXT.ChickenFarmFilterCondition,
            select: ['ChickenFarmID', 'ChickenFarmName'],
        });
        condition_ChickenFarmID.widget.props.valueExpr = 'ChickenFarmID';
        condition_ChickenFarmID.widget.props.displayExpr = 'ChickenFarmName';
        //日期
        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.label = this.translator.I18N.YhMaterialReceive.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.requiredDisable = true;
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.readOnly = false;
        condition_date.widget.events.onValueChanged = this.updateDaysOld.bind(this);
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 3);
        condition_date.widget.props.max = maxDate;

        // 养户名称
        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.YhMaterialReceive.YHFarmerID.text;
        condition_YHFarmerID.required = true;
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.requiredDisable = true;
        condition_YHFarmerID.widget = new NxSelectBox();
        condition_YHFarmerID.widget.props.showClearButton = true;
        condition_YHFarmerID.widget.props.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                [ 'status', '=', true ]
            ]
        })
        condition_YHFarmerID.widget.events.onValueChanged = this.onChickenFarmChange.bind(this);
        condition_YHFarmerID.widget.props.valueExpr = 'YHFarmerID';
        condition_YHFarmerID.widget.props.displayExpr = 'YHFarmerName';
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerID','YHFarmerName','Phone','YHPersonName','MnemonicCode']
        // condition_YHFarmerID.widget.events.onValueChanged = (value) => {}

        //养户批次
        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YhMaterialReceive.YHBatch.text;
        condition_YHBatch.required = true;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.requiredDisable = true;
        condition_YHBatch.widget = new NxSelectBox();
        condition_YHBatch.widget.props.showClearButton = false;
        condition_YHBatch.widget.props.dataSource = this.YHBasicSettingODataContext.getYHBatchDataSource();
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';
        condition_YHBatch.widget.props.searchExpr = ['YHBatchName','MnemonicCode'];
        condition_YHBatch.widget.props.readOnly = false;
        condition_YHBatch.widget.props.placeholder = '请先选养户';
        condition_YHBatch.widget.events.onOpened = e => {
            let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            if(YHFarmerID&&YHFarmerID!="0"){
                let filter = [['TransferDate', '<=', new Date(new Date(new Date(DataDate).getTime()).toLocaleDateString())],['Status', '=', true],['YHFarmerID','=',YHFarmerID]];
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName'],
                }));
            }else{
                e.component.option('dataSource',[]);
            }
        };
        condition_YHBatch.widget.events.onValueChanged = (value) => {
            if (value) {
                this.model.toolbar.moreButton.props.disabled = false;
                let obj = this.BatchDataSource.filter(o => o.YHBatchID === value);
                obj = obj.length > 0 ? obj[0] : {};
                this.DaysOld = obj.DaysOld;
                this.pcDate = obj.DaysOldDate;
                var DaysOld = "";
                if(this.pcDate&&this.DaysOld&&this.model.conditionPanel.data['DataDate']){
                    let pcDate = new DateTime(this.pcDate).toString('yyyy-MM-dd');
                    let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
                    let start = new Date(DataDate);
                    let end= new Date(pcDate);
                    let diff = new DateTime().diff(start, end);
                    DaysOld = Number(diff)+Number(this.DaysOld)+"";
                 }
                 this.model.conditionPanel.data['DaysOld'] = DaysOld;
                 this.model.conditionPanel.data['BreedingName'] = obj.BreedingName;
                 this.model.conditionPanel.data['BreedingID'] = obj.BreedingID;

                this.YHFarmerContract = obj.YHFarmerContract;
                this.model.conditionPanel.data['Abstract'] = obj.ChickAbstract;
                this.model.conditionPanel.data['ChickenFarmID'] = obj.ChickenFarmID;
                this.getHenhouse();
                if (obj.ChickAbstract == DataDictionary.MaterialSupplyPolicyA) {

                    let list = this.ChickenFarmDataSource.filter(o => o.ChickenFarmID === obj.ChickenFarmID)[0];

                    if (list) {
                        this.model.conditionPanel.conditionItems.filter(q => q.dataField == "InWarehouse")[0].widget.props.readOnly = true;
                        this.model.conditionPanel.data['InWarehouse'] = list.ByProdWarehouseID;
                    } else {
                        this.model.conditionPanel.conditionItems.filter(q => q.dataField == "InWarehouse")[0].widget.props.readOnly = false;
                    }
                } else {
                    this.model.conditionPanel.conditionItems.filter(q => q.dataField == "InWarehouse")[0].widget.props.readOnly = true;
                    this.model.conditionPanel.data['InWarehouse'] = '';
                }
            }else{
                this.model.toolbar.moreButton.props.disabled = true;
                this.model.conditionPanel.data['DaysOld'] = '';
                this.model.conditionPanel.data['BreedingName'] = '';
            }
        }

        const condition_Abstract = new NxConditionItem();
        condition_Abstract.label = '摘要';
        condition_Abstract.type = 'SelectBox';
        condition_Abstract.dataField = 'Abstract';
        condition_Abstract.requiredDisable = true;
        condition_Abstract.widget = new NxSelectBox();
        condition_Abstract.widget.props.showClearButton = false;
        condition_Abstract.widget.props.disabled = false;
        condition_Abstract.widget.props.readOnly = true;
        condition_Abstract.widget.props.dataSource = DataDictionarySource.MaterialSupplyPolicySource
        condition_Abstract.widget.props.valueExpr = 'MaterialSupplyPolicy';
        condition_Abstract.widget.props.displayExpr = 'MaterialSupplyPolicyName';
        //出库仓库
        const condition_OutWarehouse = new NxConditionItem();
        condition_OutWarehouse.label =  this.translator.I18N.YhMaterialReceive.OutWarehouse.text;
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

        //入库仓库
        const condition_InWarehouse = new NxConditionItem();
        condition_InWarehouse.label =  this.translator.I18N.YhMaterialReceive.WarehouseID.text;
        condition_InWarehouse.required = false;
        condition_InWarehouse.type = 'SelectBox';
        condition_InWarehouse.dataField = 'InWarehouse';
        condition_InWarehouse.requiredDisable = true;
        condition_InWarehouse.widget = new NxSelectBox();
        condition_InWarehouse.widget.props.showClearButton = false;
        condition_InWarehouse.widget.props.disabled = false;
        condition_InWarehouse.widget.props.readOnly = true;
        condition_InWarehouse.widget.props.dataSource = this.basicSettingODataContext.getWareHouseDataSource({
            select: ['WarehouseID', 'WarehouseName'],
        });
        condition_InWarehouse.widget.props.valueExpr = 'WarehouseID';
        condition_InWarehouse.widget.props.displayExpr = 'WarehouseName';

        // 类别
        const condition_ReceiveType = new NxConditionItem('类别', 'ReceiveType', 'TextBox', false);
        condition_ReceiveType.headVisible = true;
        condition_ReceiveType.type = 'SelectBox';
        condition_ReceiveType.widget = new NxSelectBox();
        condition_ReceiveType.required = true;
        condition_ReceiveType.requiredDisable = true;
        condition_ReceiveType.widget.props.showClearButton = false;
        condition_ReceiveType.widget.props.disabled = false;
        condition_ReceiveType.widget.props.readOnly = false;
        condition_ReceiveType.widget.props.dataSource = DataDictionarySource.ReceiveTypeSource;
        condition_ReceiveType.widget.props.valueExpr = 'Value';
        condition_ReceiveType.widget.props.displayExpr = 'Text';

        //计算运费
        const condition_CalcFeeStatus = new NxConditionItem();
        condition_CalcFeeStatus.label = '计算运费';
        condition_CalcFeeStatus.required = false;
        condition_CalcFeeStatus.requiredDisable = true;
        condition_CalcFeeStatus.type = 'SelectBox';
        condition_CalcFeeStatus.dataField = 'CalcFeeStatus';
        condition_CalcFeeStatus.widget = new NxSelectBox();
        condition_CalcFeeStatus.widget.props.showClearButton = false;
        condition_CalcFeeStatus.widget.props.disabled = false;
        condition_CalcFeeStatus.widget.props.readOnly = false;
        condition_CalcFeeStatus.widget.props.dataSource = DataDictionarySource.ConfirmStatusSource;
        condition_CalcFeeStatus.widget.props.valueExpr = 'value';
        condition_CalcFeeStatus.widget.props.displayExpr = 'name';

        //日龄
        const condition_DaysOld = new NxConditionItem('日龄', 'DaysOld', 'TextBox', false);
        condition_DaysOld.widget = new NxTextBox();
        condition_DaysOld.widget.props.readOnly = true;

        const condition_BreedingName = new NxConditionItem('品种', 'BreedingName', 'TextBox', false);
        condition_BreedingName.widget = new NxTextBox();
        condition_BreedingName.widget.props.readOnly = true;

        const condition_Driver = new NxConditionItem();
        condition_Driver.label = '司机';
        condition_Driver.requiredDisable = true;
        condition_Driver.type = 'SelectBox';
        condition_Driver.dataField = 'Driver';
        condition_Driver.widget = new NxSelectBox();
        condition_Driver.widget.props.showClearButton = true;
        condition_Driver.widget.props.disabled = false;
        condition_Driver.widget.props.dataSource = this.qlwOdataContext.getQlWPersonOData({
            select: ['UserID', 'PersonName'],
        });
        condition_Driver.widget.props.valueExpr = 'UserID';
        condition_Driver.widget.props.displayExpr = 'PersonName';

        const condition_ConfirmStatus = new NxConditionItem();
        condition_ConfirmStatus.label = '养户确认';
        condition_ConfirmStatus.required = false;
        condition_ConfirmStatus.requiredDisable = true;
        condition_ConfirmStatus.type = 'SelectBox';
        condition_ConfirmStatus.dataField = 'ConfirmStatus';
        condition_ConfirmStatus.widget = new NxSelectBox();
        condition_ConfirmStatus.widget.props.showClearButton = false;
        condition_ConfirmStatus.widget.props.disabled = false;
        condition_ConfirmStatus.widget.props.readOnly = true;
        condition_ConfirmStatus.widget.props.dataSource = DataDictionarySource.ConfirmStatusSource;
        condition_ConfirmStatus.widget.props.valueExpr = 'value';
        condition_ConfirmStatus.widget.props.displayExpr = 'name';

        const condition_numericalOrder = new NxConditionItem();
        condition_numericalOrder.label = this.translator.I18N.commonColumns.numericalOrder.text;
        condition_numericalOrder.type = 'Span';
        condition_numericalOrder.headVisible = true;
        condition_numericalOrder.dataField = 'NumericalOrder';

        const condition_number = new NxConditionItem();
        condition_number.label = this.translator.I18N.commonColumns.number.text;
        condition_number.type = 'Span';
        condition_number.headVisible = true;
        condition_number.dataField = 'Number';

        //是否期初
        const condition_isbegin = new NxConditionItem();
        condition_isbegin.label =  this.translator.I18N.YhMaterialReceive.isbegin.text;
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
                condition_YHBatch,
                condition_ReceiveType,
                condition_CalcFeeStatus,
                condition_Abstract,
                condition_OutWarehouse,
                condition_ChickenFarmID,
                condition_InWarehouse,
                condition_ConfirmStatus,
                condition_Driver,
                condition_isbegin,
                condition_BreedingName,
                condition_DaysOld,
                condition_number,
                // condition_numericalOrder,
            ]
        );
        return this;
    }

    onChickenSourceChange(value){
        if(this.editFlag){
            return;
        }
        if (value==DataDictionary.ChickenSourceA) {
            this.http
            .post(environment.faUri + '/api/FA_EnterpriseAPI/GetCurEnterData', {})
            .subscribe((res: any) => {
                if(res.beginDate){
                    this.model.conditionPanel.data['DataDate'] =  new DateTime(res.beginDate).toString('yyyy-MM-dd');
                    this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly = true;
                }
                else{
                    this.model.conditionPanel.data['DataDate'] = null;
                    this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
                }
            });
            // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "SupplierID")[0].required = false;
            this.model.conditionPanel.data['SupplierID'] = '';
        }
        else{
            this.model.conditionPanel.data['DataDate'] = new Date();
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
            // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "SupplierID")[0].required = true;
            this.model.conditionPanel.data['SupplierID'] = '';
        }
    }
    onChickenFarmChange(value){
        if (value) {
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly  = false;
        }else {
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly  = true;
        }

        if(this.editFlag){
            return;
        }
        this.model.conditionPanel.data['YHBatch'] = null;
        this.model.conditionPanel.data['Abstract'] = '';
        // this.model.conditionPanel.data['ProductID'] = '';
        this.model.conditionPanel.data['ChickenFarmID'] = '';
        this.model.conditionPanel.data['InWarehouse'] = '';
        let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
        let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
        let filter = [['DataDate', '<=', new Date(new Date(new Date(DataDate).getTime()).toLocaleDateString())],['Status', '=', true],["YHFarmerID",'=',YHFarmerID]];
        new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
            filter: filter
        })).load().then((res:any) => {
            if(res&&res.length>0){
                if(res.length==1){
                    this.model.conditionPanel.data['YHBatch'] = res[0].YHBatchID;
                }else{
                    this.HenhouseBydataSource = [];
                    let datas = res.filter((m) => m.YHBatchID == this.model.conditionPanel.data['YHBatch']);
                    if(datas==null || datas.length==0){
                        this.model.conditionPanel.data['YHBatch'] = '0';
                    }
                }
            }else{
                this.HenhouseBydataSource = [];
                this.model.conditionPanel.data['YHBatch'] = '0';
            }
        });
    }

    getWarehouse(value){
        if(this.editFlag){
            return;
        }
        if (value&&value!="0") {
            var param = "ChickenFarmID="+value+"&Billtype=zjyz&";
            this.service
                .queryWarehouseByFarm(<any>param)
                .then((res: any) => {
                    if(res&&res.WarehouseID&&res.WarehouseID!="0"){
                        this.model.conditionPanel.data['WarehouseID'] = res.WarehouseID;
                    }
                    else{
                        this.model.conditionPanel.data['WarehouseID'] = null;
                    }
                });
        }
        else{
            this.model.conditionPanel.data['WarehouseID'] = null;
        }
    }

    updateDaysOld() {
        if(this.editFlag){
            return;
        }
        var DaysOld = "";
        if(this.pcDate&&this.DaysOld&&this.model.conditionPanel.data['DataDate']){
            let pcDate = new DateTime(this.pcDate).toString('yyyy-MM-dd');
            let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let start = new Date(DataDate);
            let end= new Date(pcDate);
            let diff = new DateTime().diff(start, end);
            DaysOld = Number(diff)+Number(this.DaysOld)+"";
         }
         this.model.conditionPanel.data['DaysOld'] = DaysOld;
         this.getHenhouse();
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
                this.model.conditionPanel.data['ConfirmStatus'] = value[0].ConfirmStatus ? 1 : 0;
                this.model.conditionPanel.data['CalcFeeStatus'] = value[0].CalcFeeStatus ? 1 : 0;
                this.detailInstance.cacheSearchData = deepCopy(value[0]);
                this.detailInstance.cacheBodyData = deepCopy(value);
                //开启审核功能
                this.model.review.visible = true;
                this.model.review.numericalOrder = this.numericalOrder;

                this.DaysOld = value[0].PcDaysOld;
                this.pcDate = value[0].DaysOldDate;

                // this.qlwOdataContext.personODataStore
                // .byKey(value[0].OwnerID)
                // .then((value) => {
                //     if(value&&value.length>0&&value[0].PersonName){
                //         this.model.review.ownerName = value[0].PersonName;
                //     }
                // });
                this.model.review.ownerName = value[0].CreatedOwnerName;
                this.getHenhouse();
                this.setReadOnly();
                setTimeout(() => {
                    this.detailInstance.saveDataAfterStatus();
                    this.editFlag = false;
                    if (value[0].ChickenSource==DataDictionary.ChickenSourceA) {
                        this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = true;
                    }else{
                        this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
                    }
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
            this.detailInstance.dataGrid.dataGrid.instance.getVisibleRows().map((m: any, index) => {
                var obj = {
                    XuHao: index + 1,
                    ProductName: m.data.ProductName,
                    bIsStandardPack:m.data.bIsStandardPack?'是':'否',
                    Specification:m.data.Specification,
                    StandardPack:m.data.StandardPack,
                    ProductBatchName:m.data.ProductBatchName,
                    Packages:m.data.Packages,
                    Quantity:m.data.Quantity,
                    MeasureUnitName:m.data.MeasureUnitName,
                    UnitPrice:m.data.UnitPrice,
                    AmountTotal:m.data.AmountTotal,
                    Gift:m.data.Gift?'是':'否',
                    HenhouseName:m.data.HenhouseName,
                    DetailRemarks:m.data.DetailRemarks,
                };
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
                 //计算运费
                 CalcFeeStatus:this.model.conditionPanel.data['CalcFeeStatus'] == 1 ? '是': '否',
                 //领苗日龄
                 DaysOld:this.model.conditionPanel.data['DaysOld'] == undefined ? '': this.model.conditionPanel.data['DaysOld'],
                 //品种
                 BreedingName:this.model.conditionPanel.data['BreedingName'] == undefined ? '': this.model.conditionPanel.data['BreedingName'],
                 //司机
                 DriverName:this.model.conditionPanel.data['DriverName'] == undefined ? '': this.model.conditionPanel.data['DriverName'],
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
}
