import { Component, ViewChild } from '@angular/core';
import { NxFormDetail } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail-extend';
import { NxZlwFormDetailComponent } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { ActivatedRoute } from '@angular/router';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxConditionItem } from 'src/app/components/search-panel/search-panel-extend';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { DataDictionary, DataDictionarySource, FormOptions } from 'src/app/providers/enums';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { NxDataGridSummaryTotal } from 'src/app/components/component-model/data-grid/summary/model';
import {
    BasicSettingODataContext,
    QlwCustomerContext,
    QlwODataContext,
    QlwProductContext,
    YHBasicSettingODataContext,
    YHProductionODataContext,
} from 'src/app/providers/odataContext';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { NxDataGridColumnValidationRule } from 'src/app/components/component-model/data-grid/columns/validation-rule/model';
import { DateTime } from 'src/app/providers/common/datetime';
import { YHPoultrySalesService } from '../yhpoultrysales.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { TokenAuthService } from 'src/app/shared/services';
import { TranslateService } from 'src/app/providers/i18n-translate';

import { dealBigMoney, Distinct } from 'src/app/providers/distinct';
import { YHPoultrySales } from '../yhpoultrysales.model';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import CustomStore from 'devextreme/data/custom_store';
import DataSource from 'devextreme/data/data_source';
import { RegExps } from 'src/app/providers/regexp';
import { ToolbarPanelType } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { DataStatus } from 'src/app/components/editor-grid/util/index';
import { COM } from 'src/app/providers/common/common';
import { environment } from 'src/environments/environment';
import { AppIdEnum } from 'src/app/providers/appids';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { PrintPageComponent } from 'nxin-print';
import Guid from 'devextreme/core/guid';
@Component({
    selector: 'yhpoultrysales-detail',
    templateUrl: './yhpoultrysales-detail.component.html',
    styleUrls: ['./yhpoultrysales-detail.component.scss'],
})
export class YHPoultrySalesDetailComponent {
    @ViewChild('detailInstance', { static: false })
    detailInstance: NxZlwFormDetailComponent;
    model: NxFormDetail = new NxFormDetail();
    numericalOrder: string;
    @ViewChild('dataGrid', { static: false })
    dataGrid: DxDataGridComponent;
    permission: PermissionService = new PermissionService();
    batchSource: any = [];
    productSource: any = [];
    currentCount: number = 0;
    iNumericalOrderPlan: string = '0';
    stocktransferSource: any;
    HenhouseSource: any = [];
    zqHenhouseSource: any = [];
    BatchDataSourceThree: any = [];
    allUnitmeasurementDataSource: any = [];
    //#endregion
    outVisible: boolean = false;
    AutoDataSource: any; //自动筛选数据源
    selectedRows: any = [];
    dateDisabled: boolean = false;
    productDataSource: any = [];
    UrlParam: any; //传递参数
    MeasureUnitPara: any; //传递参数
    ProductID: string;
    WarehouseID: string;
    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;
    MeasureUnitSource: any; //辅助单位数据源
    displayMode = 'full';
    showPageSizeSelector: boolean = true;
    showInfo: boolean = true;
    showNavButtons: boolean = true;
    allProductSource: any = [];

    allProductBatchSource: any = []; //所有批号数据源
    $transfer: boolean = false;
    changeFalg: boolean = true;
    singleMeasureUnitExtSource: any = [];
    myMeasureUnitExtSource: any = [];
    allMeasureUnitExtSource: any = []; //所有商品的辅助单位数据源
    measureUnitExtSource: any = []; //商品的所有最近辅助单位数据源
    productFoumula: any = [];
    //附件
    uploadUrl: string = environment.nxinfileServerUrl;
    fileList: FileInfo[] = [];
    uploader: NxUploader = new NxUploader();
    //打印
    menu_id: string;
    environment: any;
    tokenData: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    newestMeasureUnitExt: string;
    newestMeasureUnitNameExt: string;
    kehu: any = [];
    yewuyuan: any = [];
    cangku: any = [];
    hesuandanyuan: any = [];
    bumen: any = [];
    editorValue: any = null;
    eRowKey: string = '';
    printDataSource: any = [];
    HangNum: number = 6;
    groupID: string = '0';
    CustomerDataSource: any = []; //收货客户数据源
    custFlag: boolean = true;
    $OpenOption: any;

    loading: boolean = false;
    constructor(
        private route: ActivatedRoute,
        private service: YHPoultrySalesService,
        private qlwOdataContext: QlwODataContext,
        private qlwProductionContext: QlwProductContext,
        private qlwCustomerContext: QlwCustomerContext,
        private tokenService: TokenAuthService,
        private BasicSettingOdataContext: BasicSettingODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private statusOdataContext: StatusODataContext,
        private translator: TranslateService
    ) {
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.$OpenOption = this.route.queryParams['value']['$open'];
        this.permission.refresh(this.tokenService.getTokenData.permissions);
        this.model.initialization = this.initialization.bind(this);
        this.service.getProductBatch().then((res: any) => {
            this.allProductBatchSource = res.value;
        });
        //商品筛选条件新商品分类为蛋品和包装物
        var iSort = "iSortPlus=" + DataDictionary.iSortG + ',' + DataDictionary.iSortI + "&";
        this.service.getProductMeasureunit(<any>iSort).then((result: any) => {
            this.allMeasureUnitExtSource = result.value;
        });
        this.qlwCustomerContext.CustomerBaseInfoOData.load().then((res: any) => {
            this.CustomerDataSource = res.filter(o => o.IsUse == true);
        })
        this.init_data_grid().init_table_header().init_toolbar_panel().init_uploader();

        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
        var params = 'BillType=2201131629250001455&';
        this.service.GetQueryProductMeasureUnitExt(<any>params).then((res: any) => {
            this.measureUnitExtSource = res.value;
        })
        var params2 = window.location.href.split('?');
        if (params2.length > 1) {
            let index = params2[1].indexOf('gId=');
            let groupId = index >= 0 ? params2[1].substr(index + 4).split('&')[0] : '0';
            this.groupID = groupId;
        }
    }

    ngAfterViewInit() {
        //重写组件修改事件
        var dfModifyDataStatusSet = this.detailInstance.modifyDataStatusSet.bind(this.detailInstance);
        this.detailInstance.modifyDataStatusSet = function () {
            dfModifyDataStatusSet();
            (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = false;
        }

        //重写组件撤消事件
        var dfResetDataStatus = this.detailInstance.resetDataStatus.bind(this.detailInstance);
        this.detailInstance.resetDataStatus = function () {
            dfResetDataStatus();
            (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = true;
        }

        //重写组件保存事件
        var dfSaveDataAfterStatus = this.detailInstance.saveDataAfterStatus.bind(this.detailInstance);
        this.detailInstance.saveDataAfterStatus = function () {
            dfSaveDataAfterStatus();
            (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = true;
        }

        //重写组件新增事件
        var dfCreateDataStatus = this.detailInstance.createDataStatus.bind(this.detailInstance);
        this.detailInstance.createDataStatus = function () {
            dfCreateDataStatus();
            (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = true;
        }

        //重写组件删除事件
        var dfDeletedStatus = this.detailInstance.deletedStatus.bind(this.detailInstance);
        this.detailInstance.deletedStatus = function () {
            dfDeletedStatus();
            setTimeout(() => {
                (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = true;
            }, 500);
        }

        //重写删行
        var dfRemoveRow = this.detailInstance.dataGrid.removeRow.bind(this.detailInstance.dataGrid);
        this.detailInstance.dataGrid.removeRow = () => {
            let selectRow;
            if(this.detailInstance.dataGrid.selectRowIndex == -1)
            {
                selectRow = (<Array<any>>this.model.dataGrid.props.dataSource)[(<Array<any>>this.model.dataGrid.props.dataSource).length-1];
            }
            else
            {
                selectRow = (<Array<any>>this.model.dataGrid.props.dataSource)[this.detailInstance.dataGrid.selectRowIndex];
            }

            if(selectRow.NumericalOrderDetailBuyBack)
            {
                Notify.warning("该行明细已被回收计划引用，不可删除！");
                return;
            }
            else
            {
                dfRemoveRow();
            }
        }

        //重写增行
        this.detailInstance.dataGrid.appendRow = () => {
            let SerialNo = 0;
            (<Array<any>>this.model.dataGrid.props.dataSource).forEach((m) => {
                if(m.SerialNo > SerialNo) SerialNo = m.SerialNo;
            });
            let empty = {};
            empty[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
            empty["SerialNo"] = ++SerialNo;
            empty['target'] = DataStatus.New;

            // 增行一次五行
            if (!this.model.dataGrid.editing.allowUpdating || !this.detailInstance.dataGrid.isAddRow) {
                return;
            }
            if (this.model.dataGrid.commandColumn.addRowButton.onClick) {
                this.model.dataGrid.commandColumn.addRowButton.onClick(empty);
            } else {
                for (let index = 0; index < 1; index++) {
                    (<Array<any>>this.model.dataGrid.props.dataSource).push(empty);
                }
            }
            // 工具条状态控制
            this.model.dataGrid.commandColumn.addRowButton.statusCtrl();
            this.detailInstance.dataGrid.selectRowIndex = -1;
        }
    }

    // init_uploader(): EggGoodsSalesOrderDetailComponent {
    //     this.model.uploader.visible = true;
    //     //this.model.uploader.readonly=!this.permission.$$edit || !this.permission.$$add;
    //     this.model.uploader.numericalOrder = this.numericalOrder;
    //     this.model.uploader.fileListChange = this.fileListChanged.bind(this);

    //     return this;
    // }
    init_uploader(): YHPoultrySalesDetailComponent {
        this.uploader.visible = true;
        this.uploader.readonly = !this.permission.$$edit || !this.permission.$$add;
        this.uploader.numericalOrder = this.numericalOrder;
        this.uploader.fileListChange = this.fileListChanged.bind(this);

        return this;
    }
    fileListChanged(e) {
        if (!e.isInit) {
            this.detailInstance.modifyDataStatusSet();
        }
        this.fileList = e.Files;
        // if (this._editorCommonService.mode == 'view') return this;
        // this._editorToolbarService._onValueChangedToolbarStatusCtrl();
        return this;
    }
    handleCell(e) {
        if (e.row) {
            // if (e.column.dataField == 'ProductID') {
            //     if (e.data['NumericalOrderDetailBuyBack'] && e.data['NumericalOrderDetailBuyBack'] != "0") {
            //         e.column.allowEditing = false;
            //     } else {
            //         e.column.allowEditing = true;
            //     }
            // }
        }
    }

    async onEditorPreparingFn(e) {
        if (e.parentType == 'dataRow') {

            switch (e.dataField) {
                // case 'ProductID':
                //     if(e.row.dataIndex == 0)
                //     {
                //         e.editorOptions.disabled = true;
                //         return;
                //     }
                //     break;
                default:
                    if(e.row.data.NumericalOrderDetailBuyBack)
                    {
                        e.editorOptions.disabled = true;
                        Notify.warning("该行明细已被回收计划引用，不可编辑！");
                    }
                    break;
            }

            var dfOnValueChanged = e.editorOptions.onValueChanged;
            e.editorOptions.onValueChanged = async (args) => {
                // detaiilInstance是详情组件的实例,这里是单元格编辑之后的工具条按钮状态控制
                this.detailInstance.modifyDataStatusSet();
                // 用setTimeout延迟支持获取选中的文本值
                setTimeout(() => {
                    // 将选中的文本值赋值到数据源上,_changedValue是下拉数据中对应的文本值
                    e.setValue(args.value, args.component._changedValue);
                }, 0);
            };
        }
    }
    //#region 初始化表格
    init_data_grid(): YHPoultrySalesDetailComponent {
        this.model.dataGrid.stateStoring.storageKey = 'yhpoultrysales-detail';
        this.model.dataGrid.stateStoring.enabled = true;
        this.model.dataGrid.recordDisplay = false;
        this.model.dataGrid.InColumnText = '行号';
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.columns.push(...this.columns);
        this.model.dataGrid.events.onCellClick = this.handleCell.bind(this);
        this.model.dataGrid.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.summary.enabled = true;
        this.model.dataGrid.props.columnAutoWidth = true;

        const summaryItem_total_Quantity = new NxDataGridSummaryTotal();
        summaryItem_total_Quantity.column = 'Quantity';
        summaryItem_total_Quantity.summaryType = 'sum';
        summaryItem_total_Quantity.valueFormat = '0';
        this.model.dataGrid.summary.totalItems = [
            summaryItem_total_Quantity,
        ];
        this.model.dataGrid.paginate.pager.visible = 'auto';
        return this;
    }
    //查询商品的单位之间的换算公式
    async getMeasureUnitRate(value) {

        var where = 'ProductIDs=' + value + '&';
        this.service.getProductMeasure(<any>where).then((result2: any) => {
            this.detailInstance.loading = false;
            if (result2 && result2.length > 0) {
                result2.forEach((d) => {
                    this.productFoumula.push(d);
                });
            }
        });
    }

    get columns() {
        //行号
        const col_SerialNo = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.SerialNo.text,
            'SerialNo',
            'number',
        );
        col_SerialNo.props.width = 80;
        col_SerialNo.props.allowEditing = false;
        col_SerialNo.props.alignment = 'center';


        //商品代号
        const col_ProductID = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.ProductID.text,
            'ProductID',
            'string'
        );
        col_ProductID.props.lookup.enabled = true;
        col_ProductID.props.allowEditing = true;
        col_ProductID.props.width = 180;
        col_ProductID.props.HeaderRequiredIcon = true;
        col_ProductID.props.requiredDisable = true;

        // col_ProductID.props.lookup.dataSource = this.BasicSettingOdataContext.getBizProductannexedDataSource({
        //     filter: [
        //         ['iSortPlus', '=', DataDictionary.iSortF]
        //     ],
        //     select: ['ProductID', 'cProductName'],
        // });
        // col_ProductID.props.lookup.valueExpr = 'ProductID';
        // col_ProductID.props.lookup.displayExpr = 'cProductName';

        //允许用户自定义输入
        col_ProductID.props.cellTemplate.enabled = true;
        col_ProductID.props.cellTemplate.type = "SelectBox";
        col_ProductID.props.cellTemplate.templateName = "aName"; //设置任意名称，但必须有值
        col_ProductID.props.cellTemplate.widget = new NxSelectBox();
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.dataSource = this.yhBasicSettingODataContext.getProductPoultryDataSource({
            filter: [
                ['PoultryStatus', '=', true]
            ]
        });
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.valueExpr = "ProductID";
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.displayExpr = "cProductName";
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchExpr = ['ProductID','cProductName', 'MnemonicCode'];
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchEnabled = true;
        // (<NxSelectBox>col_ProductID.props.cellTemplate.widget).events.onValueChanged = (e) => {
        //     console.log(e);
        // }

        col_ProductID.props.setCellValue = (newdata, value, olddata) => {
            let isCanEdit = true;
            (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                if (m.NumericalOrderDetail == olddata.NumericalOrderDetail && olddata.NumericalOrderBuyBack && olddata.NumericalOrderBuyBack != "0") {
                    Notify.warning("该行明细已被回收计划引用，不可编辑！");
                    isCanEdit = false;
                }
            });
            if(!isCanEdit) return;

            new DataSource(this.BasicSettingOdataContext.getProductDataSource({
                filter: ["ProductID", '=', value]
            })).load().then((res) => {
                if (res.length > 0) {
                    (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                        if (m.NumericalOrderDetail == olddata.NumericalOrderDetail) {
                            m.MeasureUnitName = res[0].MeasureUnitName;
                            m.ProductID = res[0].ProductID;
                            m.ProductName = res[0].ProductName;
                            m.SexType = res[0].SexType;
                            m.PoultrySalesRank = res[0].PoultrySalesRank;
                            m.BreedingID = res[0].BreedingID;
                        }
                    });
                }
                else {
                    (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                        if (m.NumericalOrderDetail == olddata.NumericalOrderDetail) {
                            m.MeasureUnitName = "";
                            m.ProductName = "";
                            m.ProductID = olddata.ProductID;
                            m.SexType = "0";
                            m.PoultrySalesRank = "0";
                            m.BreedingID = "0";
                        }
                    });
                }
            })
        }

        col_ProductID.props.calculateDisplayValue = 'ProductName';

        //公母
        const col_SexType = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.SexType.text,
            'SexType',
            'string'
        );
        col_SexType.props.lookup.enabled = true;
        col_SexType.props.lookup.dataSource = DataDictionarySource.SexTypeSource;
        col_SexType.props.lookup.valueExpr = "SexType";
        col_SexType.props.lookup.displayExpr = "SexTypeName";
        col_SexType.props.lookup.allowClearing = true;
        col_SexType.props.alignment = 'center';
        col_SexType.props.allowEditing = false;

        //等级
        const col_PoultrySalesRank = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.PoultrySalesRank.text,
            'PoultrySalesRank',
            'string'
        );
        col_PoultrySalesRank.props.lookup.enabled = true;
        col_PoultrySalesRank.props.lookup.dataSource = this.BasicSettingOdataContext.getBizRemindGroupDataSource({
            filter: [
                ['Status', '=', true],
                [
                    'PID', '=', '2201051734480004080'
                ]
            ],
            select: ['RemindID', 'RemindName'],
        })
        col_PoultrySalesRank.props.lookup.valueExpr = 'RemindID';
        col_PoultrySalesRank.props.lookup.displayExpr = 'RemindName';
        col_PoultrySalesRank.props.lookup.allowClearing = true;
        col_PoultrySalesRank.props.alignment = 'center';
        col_PoultrySalesRank.props.allowEditing = false;

        //品种
        const col_BreedingID = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.BreedingID.text,
            'BreedingID',
            'string'
        );
        col_BreedingID.props.lookup.enabled = true;
        col_BreedingID.props.lookup.dataSource = this.BasicSettingOdataContext.getZqBreedingsetDataSource({
            filter: [
                ['Status', '=', true],
                // [
                //     ['PoultryType', '=', DataDictionary.PoultryTypeA],
                //     'or',
                //     ['PoultryType', '=', DataDictionary.PoultryTypeB],
                // ]
            ]
        });
        col_BreedingID.props.lookup.valueExpr = 'BreedingID';
        col_BreedingID.props.lookup.displayExpr = 'BreedingName';
        col_BreedingID.props.lookup.allowClearing = true;
        col_BreedingID.props.alignment = 'center';
        col_BreedingID.props.allowEditing = false;

        //只数
        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.Quantity.text,
            'Quantity',
            'number'
        );
        col_Quantity.props.alignment = 'right';
        col_Quantity.props.HeaderRequiredIcon = true;
        var col_Quantity_pattern = new NxDataGridColumnValidationRule();
        col_Quantity_pattern.type = 'pattern';
        col_Quantity_pattern.pattern = RegExps.PositiveInteger7;
        col_Quantity_pattern.message = this.translator.I18N.YHPoultrySalesDetail.Quantity.patternMessage;
        col_Quantity.validationRules.push(...[col_Quantity_pattern]);


        //计量单位
        const col_MeasureUnitName = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.MeasureUnitName.text,
            'MeasureUnitName',
            'string'
        );
        col_MeasureUnitName.props.alignment = 'center';
        col_MeasureUnitName.props.allowEditing = false;

        //单价
        const col_UnitPrice = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.UnitPrice.text,
            'UnitPrice',
            'number'
        );
        col_UnitPrice.props.alignment = 'right';
        col_UnitPrice.props.HeaderRequiredIcon = true;
        var col_UnitPrice_pattern = new NxDataGridColumnValidationRule();
        col_UnitPrice_pattern.type = 'pattern';
        col_UnitPrice_pattern.pattern = RegExps.PositiveNumberFix4;
        col_UnitPrice_pattern.message = this.translator.I18N.YHPoultrySalesDetail.UnitPrice.patternMessage;
        col_UnitPrice.validationRules.push(...[col_UnitPrice_pattern]);


        //备注
        const col_remarks = new NxDataGridColumn(
            this.translator.I18N.YHPoultrySalesDetail.Remarks.text,
            'RemarksDetail',
            'string'
        );
        col_remarks.props.allowEditing = true;
        col_remarks.props.width = 100;

        return [
            col_SerialNo,
            col_ProductID,
            col_SexType,
            col_PoultrySalesRank,
            col_BreedingID,
            col_Quantity,
            col_MeasureUnitName,
            col_UnitPrice,
            col_remarks,
        ];
    }

    //#endregion
    //#region 初始化工具条
    init_toolbar_panel(): YHPoultrySalesDetailComponent {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;
        // this.model.toolbar.moreButton.props.disabled = true;
        const calculation_type = new ToolbarPanelType();
        calculation_type.key = 'calculation';
        calculation_type.widget = new NxButton('保存并新增');
        calculation_type.widget.disabled = false;
        calculation_type.widget.events.onClick = this.saveAndCreated.bind(this);

        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        this.model.toolbar.mainPanel.splice(2, 0, calculation_type);
        (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).props.visible = false;
        this.model.toolbar.getOtherWidgetByKey('headSetting').props.visible = true;
        // this.model.toolbar.getOtherWidgetByKey('filterRow').props.visible = true;
        // this.toolbarPanelModel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).props.visible = false;
        return this;
    }
    //保存并新增
    saveAndCreated() {
        this.detailInstance.saveChanges('SerialNo').then((value) => {
            this.detailInstance.openCheck(
                () => {
                    const data = this.getSaveData(value);
                    if (data) {
                        (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = true;
                        data["Files"] = this.fileList;
                        this.loading = true;
                        this.service.create(data).then((result: Result) => {
                            const response = ResponseSuccess.handle(result);
                            this.loading = false;
                            if (response.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);

                                this.model.conditionPanel.data['NumericalOrder'] = result.data.NumericalOrder;
                                this.numericalOrder = result.data.NumericalOrder;

                                // 现在仅支持 制单 / 财务 / 仓库 / 审核  默认无序审核
                                this.model.review.levelOrder = [
                                    PermissionCodes.Making,
                                    // PermissionCodes.Finance,
                                    // PermissionCodes.Track,
                                    PermissionCodes.Audit,
                                ];
                                //开启审核功能
                                this.model.review.visible = true;
                                this.model.review.numericalOrder = this.numericalOrder;
                                this.model.dataGrid.type = 'detail';
                                this.detailInstance.$open = FormOptions.$modify;
                                (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = false;
                                // this.service
                                //     .getCustomDataSourceById(result.data.NumericalOrder)
                                //     .load()
                                //     .then((value: Array<any>) => {
                                //         this.model.dataGrid.props.dataSource = value;
                                //         this.model.conditionPanel.data = value[0];
                                //         this.model.review.ownerName = value[0].CreatedOwnerName;
                                //         this.model.conditionPanel.data['Number'] = value[0].Number;
                                //         this.model.dataGrid.props.dataSource.map((m) => (m.target = DataStatus.None));
                                //         this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);
                                //         this.detailInstance.cacheBodyData = deepCopy(
                                //             this.model.dataGrid.props.dataSource
                                //         );
                                //         this.printDataSource =deepCopy(this.model.dataGrid.props.dataSource);
                                //         // setTimeout(() => {
                                //         //     this.detailInstance.saveDataAfterStatus();
                                //         // });
                                //     });
                                return true;
                            } else {
                                // Notify.toast(response.message, NotifyType.Error);
                                this.detailInstance.messageBox.show(response.message);
                                this.detailInstance.saveDataError();
                            }
                            return false;
                        })
                            .then(status => {
                                if (status) {
                                    this.create();
                                }
                            });
                    }
                },
                () => {
                    if (this.detailInstance.reviewValidation()) {
                        
                        const data = this.getupdateSaveData(value);
                        if (data) {
                            (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = true;
                            data["Files"] = this.fileList;
                            this.loading = true;
                            this.service.update(data).then((result: Result) => {
                                const res = ResponseSuccess.handle(result);
                                this.loading = false;
                                if (res.status) {
                                    Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                    //重置状态
                                    this.detailInstance.$open = FormOptions.$modify;
                                    (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = false;
                                    return true;
                                } else {
                                    // Notify.toast(res.message, NotifyType.Error);
                                    this.detailInstance.messageBox.show(res.message);
                                    this.detailInstance.saveDataError();
                                }
                                return false;
                            })
                                .then(status => {
                                    if (status) {
                                        this.create();
                                    }
                                });;
                        }


                    }
                }
            );
        });
    }

    create() {
        this.detailInstance.$open = FormOptions.$create;
        // (<NxButton>this.model.toolbar.getWidgetByKey('collection')).props.disabled = true;
        this.model.conditionPanel.data = {
            DataDate: null,
            CustomerID: null,
            SalesNameID: null,
            MarketID: null,
            ReqDeliveryDate: null,
            SalesPeriod: null,
            Number: null
        };
        var emptyDatas = [];
        for (let index = 0; index < 5; index++) {
            let empty = {};
            empty[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
            empty['target'] = DataStatus.New;
            empty["SerialNo"] = index+1;
            emptyDatas.push(empty);
        }
        (<Array<any>>this.model.dataGrid.props.dataSource) = emptyDatas;
        this.detailInstance.cacheSearchData = {};
        this.detailInstance.cacheBodyData = deepCopy(emptyDatas);
        this.model.review.visible = false;
        this.model.conditionPanel.data['DataDate'] = new Date().toLocaleDateString();
        this.model.conditionPanel.data.Remarks = '';
        this.numericalOrder = '';
        this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);
        setTimeout(() => {
            // this.detailInstance.createDataStatus(undefined,5);
        }, 20);
    }
    save() {
        this.detailInstance.saveChanges('SerialNo').then((value) => {
            this.detailInstance.openCheck(
                () => {
                    const data = this.getSaveData(value);
                    if (data) {
                        data["Files"] = this.fileList;
                        this.loading = true;
                        this.service.create(data).then((result: Result) => {
                            const response = ResponseSuccess.handle(result);
                            this.loading = false;
                            if (response.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);

                                this.model.conditionPanel.data['NumericalOrder'] = result.data.NumericalOrder;
                                this.numericalOrder = result.data.NumericalOrder;

                                // 现在仅支持 制单 / 财务 / 仓库 / 审核  默认无序审核
                                this.model.review.levelOrder = [
                                    PermissionCodes.Making,
                                    // PermissionCodes.Finance,
                                    // PermissionCodes.Track,
                                    PermissionCodes.Audit,
                                ];
                                //开启审核功能
                                this.model.review.visible = true;
                                this.model.review.numericalOrder = this.numericalOrder;
                                this.model.dataGrid.type = 'detail';
                                this.detailInstance.$open = FormOptions.$modify;
                                this.service
                                .getCustomDataSourceById(result.data.NumericalOrder)
                                .load()
                                .then((value: Array<any>) => {
                                    this.model.dataGrid.props.dataSource = value;
                                    this.model.conditionPanel.data = value[0];
                                    this.model.review.ownerName = value[0].CreatedOwnerName;
                                    this.model.conditionPanel.data['Number'] = value[0].Number;
                                    this.model.dataGrid.props.dataSource.map((m) => (m.target = DataStatus.None));
                                    this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);
                                    this.detailInstance.cacheBodyData = deepCopy(
                                        this.model.dataGrid.props.dataSource
                                    );
                                    this.printDataSource = deepCopy(this.model.dataGrid.props.dataSource);
                                    setTimeout(() => {
                                        this.detailInstance.saveDataAfterStatus();
                                    });
                                });
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
                        
                        const data = this.getupdateSaveData(value);
                        if (data) {
                            data["Files"] = this.fileList;
                            this.loading = true;
                            this.service.update(data).then((result: Result) => {
                                const res = ResponseSuccess.handle(result);
                                this.loading = false;
                                if (res.status) {
                                    Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                    //重置状态
                                    this.detailInstance.$open = FormOptions.$modify;
                                    this.service
                                    .getCustomDataSourceById(result.data.NumericalOrder)
                                    .load()
                                    .then((value: Array<any>) => {

                                        this.model.dataGrid.props.dataSource = value;
                                        this.model.conditionPanel.data = value[0];
                                        this.model.dataGrid.props.dataSource.map((m) => (m.target = DataStatus.None));
                                        this.model.review.ownerName = value[0].CreatedOwnerName;
                                        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);
                                        this.detailInstance.cacheBodyData = deepCopy(
                                            this.model.dataGrid.props.dataSource
                                        );
                                        this.printDataSource = deepCopy(this.model.dataGrid.props.dataSource);
                                        setTimeout(() => {
                                            this.detailInstance.saveDataAfterStatus();
                                        });
                                    });
                                } else {
                                    // Notify.toast(res.message, NotifyType.Error);
                                    this.detailInstance.messageBox.show(res.message);
                                    this.detailInstance.saveDataError();
                                }
                            });
                        }


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
                this.service.delete(this.model.conditionPanel.data.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        // (<NxButton>this.model.toolbar.getWidgetByKey('collection')).props.disabled = true; //删除成功后，收款按钮置灰
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
            // this.detailInstance.createDataStatus();
        } else {
            this.service
                .getCustomDataSourceById(this.numericalOrder)
                .load()
                .then((value: Array<any>) => {
                    this.model.dataGrid.props.dataSource = value;
                    // this.model.review.ownerName = value[0].CreatedOwnerName;
                    this.model.dataGrid.props.dataSource.map((m) => (m.target = DataStatus.None));
                    this.model.conditionPanel.data = value[0];
                    this.detailInstance.cacheSearchData = deepCopy(value[0]);
                    this.detailInstance.cacheBodyData = deepCopy(value);
                });
        }
        this.detailInstance.resetDataStatus();
    }
    private dataValidation(data: any[], props: any[]): boolean {
        //初始化
        let isAll = true; //返回值
        let errorMessages = []; //弹出信息
        this.detailInstance.messageBox.clear();

        if (data.length <= 0) {
            errorMessages.push("订单明细表不能为空！");
            isAll = false;
        }

        //每一行
        for (let rowIndex in data) {
            //每一项
            if (data[rowIndex]) for (let prop of props) {

                let valiData = data[rowIndex];
                let propErrorMsg = this.translator.I18N.YHPoultrySalesDetail;
                let deepProp = prop.split('.'); // 'aa.bb.cc...' => ['aa', 'bb', 'cc', ...]

                //深度搜索
                deepProp.map((m) => {
                    valiData = valiData[m] || undefined;
                    propErrorMsg = propErrorMsg[m] || "未知错误!";
                });
                propErrorMsg = propErrorMsg['emptyMessage'] || "未知错误!";

                //如果校验为空
                if (valiData == null || valiData == undefined || valiData == "0") {
                    errorMessages.push(`第${Number(rowIndex) + 1}行：${propErrorMsg}`);
                    isAll = false;
                }
            }
            else {
                errorMessages.push(`第${Number(rowIndex) + 1}行：不能为空行!`);
                isAll = false;
            }
        }

        if (isAll) {
            return true;
        }

        this.detailInstance.messageBox.show(errorMessages);
        return isAll;
    }
    private getSaveData(value) {

        const validation = this.dataValidation(value.body, [
            'ProductID',
            'Quantity',
            'UnitPrice'
        ]);
        if (validation) {
            let saveData = new YHPoultrySales();
            const date = new DateTime(value.header.DataDate.toString()).toString('yyyy-MM-dd');
            saveData.DataDate = date;
            saveData.MarketID = value.header.MarketID;
            saveData.CustomerID = value.header.CustomerID;
            saveData.SalesManID = value.header.SalesManID ? value.header.SalesManID : '0';
            const dateReq = new DateTime(value.header.ReqDeliveryDate.toString()).toString('yyyy-MM-dd');
            saveData.ReqDeliveryDate = dateReq;
            saveData.Remarks = value.header.Remarks || '';
            saveData.SalesPeriod = value.header.SalesPeriod || 0;
            saveData.WeightStatus = value.header.WeightStatus || false;

            value.body.map((m) => {
                saveData.YHPoultrySalesDetailDtos.push({
                    SerialNo: m.SerialNo || 0,
                    NumericalOrder: '0',
                    NumericalOrderDetail: '0',
                    ProductID: m.ProductID,
                    SexType: m.SexType || "0",
                    PoultrySalesRank: m.PoultrySalesRank || "0",
                    BreedingID: m.BreedingID || "0",
                    Quantity: m.Quantity,
                    MeasureUnitName: m.MeasureUnitName || "",
                    UnitPrice: m.UnitPrice,
                    Remarks: m.RemarksDetail || '',
                    Target: m.target,
                    GUID: m.GUID || new Guid(),
                });
            });
            if (this.detailInstance.$open == FormOptions.$modify) {
                saveData.YHPoultrySalesDetailDtos.push(...value.deleted);
            }
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }
    private getupdateSaveData(value) {

        const validation = this.dataValidation(value.body, [
            'ProductID',
            'Quantity',
            'UnitPrice'
        ]);
        if (validation) {
            let saveData = new YHPoultrySales();
            saveData.NumericalOrder = this.numericalOrder;
            saveData.DataDate = new DateTime(value.header.DataDate.toString()).toString('yyyy-MM-dd');;
            saveData.MarketID = value.header.MarketID;
            saveData.CustomerID = value.header.CustomerID;
            saveData.SalesManID = value.header.SalesManID ? value.header.SalesManID : '0';
            saveData.ReqDeliveryDate = new DateTime(value.header.ReqDeliveryDate.toString()).toString('yyyy-MM-dd');;
            saveData.Remarks = value.header.Remarks || '';
            saveData.SalesPeriod = value.header.SalesPeriod || 0;
            value.body.map((m) => {
                saveData.YHPoultrySalesDetailDtos.push({
                    SerialNo: m.SerialNo || 0,
                    NumericalOrder: '0',
                    NumericalOrderDetail: m.NumericalOrderDetail,
                    ProductID: m.ProductID,
                    SexType: m.SexType || "0",
                    PoultrySalesRank: m.PoultrySalesRank || "0",
                    BreedingID: m.BreedingID || "0",
                    Quantity: m.Quantity,
                    MeasureUnitName: m.MeasureUnitName || "",
                    UnitPrice: m.UnitPrice,
                    Remarks: m.RemarksDetail || "",
                    Target: m.target,
                    GUID: m.GUID || new Guid(),
                });
            });
            saveData.YHPoultrySalesDetailDtos.push(...value.deleted);
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }
    //#endregion

    //#region  表头配置
    init_table_header(): YHPoultrySalesDetailComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        //订单日期
        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.headVisible = true;
        condition_date.requiredDisable = true;
        condition_date.label = this.translator.I18N.YHPoultrySales.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';

        //客户
        const condition_CustomerID = new NxConditionItem();
        condition_CustomerID.required = true;
        condition_CustomerID.headVisible = true;
        // condition_CustomerID.requiredDisable = true;
        condition_CustomerID.label = this.translator.I18N.YHPoultrySales.CustomerID.text;
        condition_CustomerID.type = 'SelectBox';
        condition_CustomerID.dataField = 'CustomerID';
        condition_CustomerID.widget = new NxSelectBox();
        condition_CustomerID.widget.props.placeholder = this.translator.I18N.EggGoodsSalesOrder.CustomerID.placeholder;
        condition_CustomerID.widget.props.showClearButton = true;
        condition_CustomerID.widget.props.dataSource = this.qlwCustomerContext.getCustomerDataSource();
        condition_CustomerID.widget.props.valueExpr = 'CustomerId';
        condition_CustomerID.widget.props.displayExpr = 'CustomerName';
        condition_CustomerID.widget.events.onValueChanged = this.changeCustomer.bind(this);

        //业务员
        const condition_SalesmanID = new NxConditionItem();
        condition_SalesmanID.required = false;
        condition_SalesmanID.headVisible = true;
        // condition_SalesmanID.requiredDisable = true;
        condition_SalesmanID.label = this.translator.I18N.YHPoultrySales.SalesManID.text;
        condition_SalesmanID.type = 'SelectBox';
        condition_SalesmanID.dataField = 'SalesManID';
        condition_SalesmanID.widget = new NxSelectBox();
        condition_SalesmanID.widget.props.placeholder = this.translator.I18N.EggGoodsSalesOrder.SalesManID.placeholder;
        condition_SalesmanID.widget.props.showClearButton = true;
        condition_SalesmanID.widget.props.disabled = false;
        condition_SalesmanID.widget.props.dataSource = this.qlwOdataContext.getQlWPersonOData();
        condition_SalesmanID.widget.props.valueExpr = 'PersonID';
        condition_SalesmanID.widget.props.displayExpr = 'PersonName';
        condition_SalesmanID.widget.events.onValueChanged = (value) => {
            //修改客户时不触发下面修改部门逻辑
            if (!this.changeFalg) {
                this.changeFalg = true;
                return;
            }
            //单纯修改业务员时在修改部门
            if (value) {
                let PurchaserIdParams = {
                    filter: [['PersonID', '=', value]]
                };
                new DataSource(this.qlwOdataContext.getQlWPersonOData(PurchaserIdParams)).load().then((result) => {
                    if (result != null && result.length > 0) {
                        this.model.conditionPanel.data['MarketID'] = result[0].MarketId;
                    }
                });

                // this.qlwOdataContext.personODataStore.byKey(value).then((result: any) => {
                //     if (result) {
                //         this.model.conditionPanel.data['SalesManID'] = result[0].PersonID;
                //         this.model.conditionPanel.data['MarketID'] = result[0].MarketId;
                //         this.model.conditionPanel.data['MarketName'] = result[0].MarketName;
                //     }
                // });
            }
        };
        //部门
        const condition_MarketID = new NxConditionItem();
        condition_MarketID.required = true;
        condition_MarketID.headVisible = true;
        condition_MarketID.requiredDisable = true;
        condition_MarketID.label = this.translator.I18N.YHPoultrySales.MarketID.text;
        condition_MarketID.type = 'SelectBox';
        condition_MarketID.dataField = 'MarketID';
        condition_MarketID.widget = new NxSelectBox();
        // condition_MarketID.widget.props.placeholder = this.translator.I18N.YHPoultrySales.MarketID.placeholder;
        condition_MarketID.widget.props.showClearButton = true;
        condition_MarketID.widget.props.disabled = false;
        condition_MarketID.widget.props.valueExpr = 'MarketId';
        condition_MarketID.widget.props.displayExpr = 'MarketName';
        condition_MarketID.widget.props.dataSource = this.qlwCustomerContext.getBizMarketDataSource({
            filter: [
                ['IsUse', '=', 1],
                ['isEnd', '=', 1],
            ],
            select: ['MarketId', 'MarketName'],
        });

        //销售日期
        const condition_ReqDeliveryDate = new NxConditionItem();
        condition_ReqDeliveryDate.required = true;
        condition_ReqDeliveryDate.headVisible = true;
        condition_ReqDeliveryDate.requiredDisable = true;
        condition_ReqDeliveryDate.label = this.translator.I18N.YHPoultrySales.ReqDeliveryDate.text;
        condition_ReqDeliveryDate.type = 'DateBox';
        condition_ReqDeliveryDate.dataField = 'ReqDeliveryDate';
        condition_ReqDeliveryDate.widget = new NxDateBox();
        condition_ReqDeliveryDate.widget.props.disabled = false;
        condition_ReqDeliveryDate.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_ReqDeliveryDate.widget.props.type = 'date';

        //时段
        const condition_SalesPeriod = new NxConditionItem();
        // condition_MarketID.required = true;
        // condition_SalesPeriod.requiredDisable = true;
        condition_SalesPeriod.label = this.translator.I18N.YHPoultrySales.SalesPeriod.text;
        condition_SalesPeriod.type = 'SelectBox';
        condition_SalesPeriod.dataField = 'SalesPeriod';
        condition_SalesPeriod.widget = new NxSelectBox();
        // condition_MarketID.widget.props.placeholder = this.translator.I18N.YHPoultrySales.MarketID.placeholder;
        condition_SalesPeriod.widget.props.showClearButton = true;
        condition_SalesPeriod.widget.props.disabled = false;
        condition_SalesPeriod.widget.props.valueExpr = 'value';
        condition_SalesPeriod.widget.props.displayExpr = 'name';
        condition_SalesPeriod.widget.props.dataSource = [
            { value: 1, name: '上午' },
            { value: 2, name: '下午' },
        ];

        //单据号
        const condition_number = new NxConditionItem();
        condition_number.required = false;
        // condition_number.requiredDisable = true;
        condition_number.headVisible = true;
        condition_number.label = this.translator.I18N.commonColumns.number.text;
        condition_number.type = 'Span';
        condition_number.dataField = 'Number';

        this.model.conditionPanel.conditionItems.push(
            ...[
                condition_date,
                condition_CustomerID,
                condition_SalesmanID,
                condition_MarketID,
                condition_ReqDeliveryDate,
                condition_SalesPeriod,
                condition_number,
            ]
        );
        return this;
    }
    //#region 初始化数据源
    initialization(e: NxZlwFormDetailComponent) {
        e.isRightReview = true; //禁用右键
        // this.model.dataGrid.commandAddRow.visible = false;//禁用增行
        // this.model.dataGrid.commandRow.visible = false;//禁用删行、增行
        // this.model.dataGrid.props.dataSource = [];
        (<NxButton>this.model.toolbar.getWidgetByKey('calculation')).props.disabled = true;
        //详情进入编辑页面
        if (this.route.queryParams['value']['$open'] == FormOptions.$modify) {
            setTimeout(() => {
                this.queryDetail();
            }, 500);
        } else {
            setTimeout(() => {
                this.create()
            },500);
        }
    }

    queryDetail() {
        //开启审核功能
        this.model.review.visible = true;
        this.model.review.numericalOrder = this.numericalOrder;
        // 现在仅支持 制单 / 财务 / 仓库 / 审核 默认无序审核
        this.model.review.levelOrder = [
            PermissionCodes.Making,
            // PermissionCodes.Finance,
            // PermissionCodes.Track,
            PermissionCodes.Audit,
        ];
        this.service
            .getCustomDataSourceById(this.numericalOrder)
            .load()
            .then((value: Array<any>) => {
                this.model.dataGrid.props.dataSource = value;
                this.model.review.ownerName = value[0].CreatedOwnerName;
                // this.qlwOdataContext.personODataStore.byKey(value[0].OwnerId).then((res) => {
                //     if(res && res.length>0){
                //         this.model.review.ownerName = res[0].PersonName;
                //     }
                // });
                this.model.dataGrid.props.dataSource.map((m) => (m.target = DataStatus.None));
                this.model.conditionPanel.data = value[0];
                this.getMeasureUnitExt(value);

                // this.model.review.ownerName = value[0].CreatedOwnerName;
                this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);
                this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
                this.printDataSource = deepCopy(this.model.dataGrid.props.dataSource);
                // (<NxButton>this.model.toolbar.getWidgetByKey('collection')).props.disabled = false;
                // //开启审核功能
                // this.model.review.visible = true;
                // this.model.review.numericalOrder = this.numericalOrder;
            });
    }

    //#endregion
    onPopupHiding() {
        this.outVisible = false;
        this.AutoDataSource = [];
    }
    appendUrlParam() {
        var WarehouseID = this.model.conditionPanel.data['WarehouseID'];
        if (WarehouseID && WarehouseID != '0') {
            this.UrlParam = 'WarehouseID=' + WarehouseID + '&';
        }
        var DataDate = this.model.conditionPanel.data['DataDate'];
        if (DataDate) {
            this.UrlParam += 'DataDate=' + new DateTime(DataDate).toString('yyyy-MM-dd') + '&';
        }
    }

    clickAuto() {
        this.appendUrlParam();
        this.UrlParam += 'BillType=2201131629250001455&iSortPlus=' + DataDictionary.iSortG + ',' + DataDictionary.iSortI + '&';
        if (this.ProductID) {
            this.UrlParam += 'ProductID=' + this.ProductID + '&';
        }
        if (this.numericalOrder) {
            this.UrlParam += 'NumericalOrder=' + this.numericalOrder + '&';
        }
        this.UrlParam += 'groupBy=md.ProductID,mt.BatchID&';
        this.service.getQLWWarehouseStock(this.UrlParam).then((res: any) => {
            var selectedRowsData11 = res.value;
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            if (oldData && oldData.length > 0) {
                selectedRowsData11.forEach((f) => {
                    oldData.forEach((row) => {
                        if (f.ProductBatchID == row.ProductBatchID && f.ProductID == row.ProductID) {
                            var cQuantity = Number(f.cQuantity);
                            if (row.Quantity) {
                                f.cQuantity = cQuantity - Number(row.Quantity);
                            }
                        }
                    });
                });
            }
            var data = [];
            selectedRowsData11.forEach((f) => {
                // f.MeasureUnitExt = f.SaleUnit;
                // f.MeasureUnitNameExt = f.SaleUnitName;
                if (f.cQuantity && Number(f.cQuantity) > 0) {
                    f.DetailID = new DateTime().randomValue.toString();
                    data.push(f);
                }
            });
            this.AutoDataSource = data;
            this.getMeasureUnitExt(data);
        });
    }
    async getMeasureUnitExt(data) {
        var data2 = Distinct(data, "ProductID");
        var ProductID = "";
        data2.forEach(async (result) => {
            if (result["ProductID"]) {
                ProductID += result["ProductID"] + ","
            }
        });
        if (ProductID) {
            ProductID = ProductID.substring(0, ProductID.length - 1);
            var iSort = "ProductID=" + ProductID + "&";
            this.service
                .getProductMeasureunit(<any>iSort)
                .then((result1: any) => {
                    this.productSource = result1.value;
                });
            var where = "ProductIDs=" + ProductID + "&";
            this.service
                .getProductMeasure(<any>where)
                .then((result2: any) => {
                    if (result2 && result2.length > 0) {
                        result2.forEach((d) => {
                            this.productFoumula.push(d);
                        });
                    }
                });
        }
    }
    getSelection(type) {
        if (type == '3') {
            this.outVisible = false;
            this.AutoDataSource = [];
            return false;
        }
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



        selectedRowsData11.forEach((f) => {
            var row = deepCopy(f);
            row[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
            row['target'] = DataStatus.New;
            var measureUnitExtdata = {};
            row.ChickenFarmID = row.FarmID;
            row.ChickenFarmName = row.FarmName;
            measureUnitExtdata['ProductID'] = row.ProductID;
            measureUnitExtdata['MeasureUnitExt'] = row.MeasureUnitExt;
            measureUnitExtdata['MeasureUnitNameExt'] = row.MeasureUnitNameExt;
            this.measureUnitExtSource.push(measureUnitExtdata);
            arry.push(row);
            // this.model.dataGrid.props.dataSource = deepCopy(oldData);
            // this.dataGridRef.instance.refresh();
        });
        this.model.dataGrid.props.dataSource = arry;
        this.detailInstance.dataGrid.dataGrid.instance.refresh();
        this.detailInstance.modifyDataStatusSet();
        if (type == '2') {
            this.AutoDataSource = [];
            this.clickAuto();
        }
        if (type == '1') {
            this.outVisible = false;
            this.AutoDataSource = [];
        }
    }


    //根据客户带出业务员/部门
    changeCustomer(value) {

        if (value) {
            if (!this.model.conditionPanel.data['SubCustomerID'] || this.model.conditionPanel.data['SubCustomerID'] == "0") {
                new DataSource(
                    this.qlwCustomerContext.getCustomerDataSource({
                        filter: [['CustomerId', '=', value]],
                    })
                )
                    .load()
                    .then((result: any) => {
                        if (result) {
                            this.model.conditionPanel.data['CustomerID'] = result[0].CustomerId;
                            let PurchaserIdParams = {
                                filter: [['UserID', '=', result[0].SalesID]]
                            };
                            // if(this.model.conditionPanel.data['SubCustomerID']){
                            //     var newGroupData = this.CustomerDataSource.filter(o=>o.CustomerId==this.model.conditionPanel.data['SubCustomerID'] && o.IsUse==true);
                            //     if(newGroupData && newGroupData.length>0){
                            //         PurchaserIdParams = {
                            //             filter: [['UserID', '=', newGroupData[0].SalesID]]
                            //         };
                            //         this.model.conditionPanel.data['MarketID'] = newGroupData[0].MarketID;
                            //     }
                            // }else{
                            //     this.model.conditionPanel.data['MarketID'] = result[0].MarketID;
                            // }
                            new DataSource(this.qlwOdataContext.getQlWPersonOData(PurchaserIdParams)).load().then((result1) => {
                                if (result1 != null && result1.length > 0) {
                                    this.model.conditionPanel.data['SalesManID'] = result1[0].PersonID;
                                    this.changeFalg = false;
                                }
                            });
                            this.model.conditionPanel.data['MarketID'] = result[0].MarketID;
                        }
                    });
            }
            var param = "CustomerID=" + value + "&"
            this.service.getEggGoodsSalesOrder(<any>param).then((res: any) => {
                this.model.conditionPanel.data['Abstract'] = res.Abstract;
            })
        }
    }

    onEditorPreparingFn2(e) {
        // 判单值发生改变 自动勾选
        if (e.dataField && e.row.rowType == 'data') {
            const rowData = e.row.data;

            if (e.dataField == 'MeasureUnitExt') {
                var ProductID = e.row.data['ProductID'];
                var mdata = this.productSource.filter(o => o.ProductID == ProductID);
                e.editorOptions.dataSource = mdata;
                e.editorOptions.onValueChanged = (_e) => {
                    if (this.selectedRows.indexOf(e.row.key) === -1) {
                        this.selectedRows.push(e.row.key)
                    }
                    var data = deepCopy(mdata.filter((o) => o.MeasureUnit == _e.value));
                    // var data2 = deepCopy(this.productFoumula.filter((o) => o.ProductID == ProductID));
                    let rowData2 = this.AutoDataSource.find((m) => m['DetailID'] == rowData['DetailID']);
                    // if (data && data.length > 0) {
                    //     var MeasureUnitNameExt = data[0].MeasureUnitName;
                    //     var MeasureUnitName =  rowData2['MeasureUnitName'];
                    //     var QuantityExt =  rowData2['QuantityExt'];
                    //     var UnicumUnitName = '枚';
                    //     var StatUnitName = '公斤';
                    //     var Quantity = rowData2['Quantity'];
                    //     var UnicumQuantity = rowData2['UnicumQuantity'];
                    //     var StatQuantity = rowData2['StatQuantity'];
                    //     var arr = [
                    //         {
                    //             UnitType: 'Quantity',
                    //             measureUnitName: MeasureUnitName,
                    //             Quantity: Quantity,
                    //         },
                    //         {
                    //             UnitType: 'UnicumQuantity',
                    //             measureUnitName: UnicumUnitName,
                    //             Quantity: UnicumQuantity,
                    //         },
                    //         {
                    //             UnitType: 'StatQuantity',
                    //             measureUnitName: StatUnitName,
                    //             Quantity: StatQuantity,
                    //         },
                    //     ];
                    //     var foumulas = COM.getScalingFactor(QuantityExt, MeasureUnitNameExt, arr, data2);
                    //     if (foumulas && foumulas.length > 0) {
                    //         foumulas.forEach((b) => {
                    //             if (b.scalingType != '3') {
                    //                 rowData2[b.UnitType] = Number(b.Quantity).toFixed(2);
                    //             }
                    //         });
                    //     }
                    rowData2['Quantity'] = 0;
                    rowData2['QuantityExt'] = 0;
                    rowData2['UnicumQuantity'] = 0;
                    rowData2['StatQuantity'] = 0;
                    rowData2['MeasureUnitExt'] = _e.value;
                    rowData2['MeasureUnitNameExt'] = data[0].MeasureUnitName;
                    // }
                    // this.dataGridRef.instance.refresh();
                };
            } else if (e.dataField == 'QuantityExt') {
                var ProductID = e.row.data['ProductID'];
                e.editorOptions.onValueChanged = (_e) => {
                    if (this.selectedRows.indexOf(e.row.key) === -1) {
                        this.selectedRows.push(e.row.key)
                    }
                    var data = deepCopy(this.productFoumula.filter((o) => o.ProductID == ProductID));
                    let rowData2 = this.AutoDataSource.find((m) => m['DetailID'] == rowData['DetailID']);
                    if (data && data.length > 0) {
                        var MeasureUnitNameExt = rowData2['MeasureUnitNameExt'];
                        var MeasureUnitName = rowData2['MeasureUnitName'];
                        var UnicumUnitName = '枚';
                        var StatUnitName = '公斤';
                        var Quantity = rowData2['Quantity'];
                        var UnicumQuantity = rowData2['UnicumQuantity'];
                        var StatQuantity = rowData2['StatQuantity'];
                        var arr = [
                            {
                                UnitType: 'Quantity',
                                measureUnitName: MeasureUnitName,
                                Quantity: Quantity,
                            },
                            {
                                UnitType: 'UnicumQuantity',
                                measureUnitName: UnicumUnitName,
                                Quantity: UnicumQuantity,
                            },
                            {
                                UnitType: 'StatQuantity',
                                measureUnitName: StatUnitName,
                                Quantity: StatQuantity,
                            },
                        ];
                        if (!_e.value) {
                            _e.value = 0;
                        }
                        var foumulas = COM.getScalingFactor(_e.value.toFixed(2), MeasureUnitNameExt, arr, data);
                        if (foumulas && foumulas.length > 0) {
                            foumulas.forEach((b) => {
                                if (b.scalingType != '3') {
                                    rowData2[b.UnitType] = Number(b.Quantity).toFixed(2);
                                }
                            });
                        }
                        rowData2['QuantityExt'] = Number(_e.value).toFixed(2);
                    }
                    this.dataGridRef.instance.refresh();
                };
            } else if (e.dataField == 'Quantity') {
                var ProductID = e.row.data['ProductID'];
                e.editorOptions.onValueChanged = (_e) => {
                    if (this.selectedRows.indexOf(e.row.key) === -1) {
                        this.selectedRows.push(e.row.key)
                    }
                    var data = deepCopy(this.productFoumula.filter((o) => o.ProductID == ProductID));
                    let rowData2 = this.AutoDataSource.find((m) => m['DetailID'] == rowData['DetailID']);
                    if (data && data.length > 0) {
                        var MeasureUnitNameExt = rowData2['MeasureUnitNameExt'];
                        var MeasureUnitName = rowData2['MeasureUnitName'];
                        var UnicumUnitName = '枚';
                        var StatUnitName = '公斤';
                        var QuantityExt = rowData2['QuantityExt'];
                        var UnicumQuantity = rowData2['UnicumQuantity'];
                        var StatQuantity = rowData2['StatQuantity'];
                        var arr = [
                            {
                                UnitType: 'QuantityExt',
                                measureUnitName: MeasureUnitNameExt,
                                Quantity: QuantityExt,
                            },
                            {
                                UnitType: 'UnicumQuantity',
                                measureUnitName: UnicumUnitName,
                                Quantity: UnicumQuantity,
                            },
                            {
                                UnitType: 'StatQuantity',
                                measureUnitName: StatUnitName,
                                Quantity: StatQuantity,
                            },

                        ];
                        if (!_e.value) {
                            _e.value = 0;
                        }
                        var foumulas = COM.getScalingFactor(_e.value.toFixed(2), MeasureUnitName, arr, data);

                        if (foumulas && foumulas.length > 0) {
                            foumulas.forEach((b) => {
                                if (b.scalingType != '3') {
                                    rowData2[b.UnitType] = Number(b.Quantity).toFixed(2);
                                }
                            });
                        }
                        rowData2['Quantity'] = Number(_e.value).toFixed(2);
                    }
                    this.dataGridRef.instance.refresh();
                };
            } else if (e.dataField == 'RemarksDetail') {
                e.editorOptions.onValueChanged = (_e) => {
                    this.AutoDataSource.map((m) => {
                        if (rowData.ProductBatchID == m.ProductBatchID && rowData.ProductID == m.ProductID) {
                            m['RemarksDetail'] = _e.value;
                        }
                    });
                    this.dataGridRef.instance.refresh();
                };
            }
        }
    }

    //跳转模板
    jump() {

        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=肉禽销售订单`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=肉禽销售订单`
                );
            }
        );
    }
    //自定义打印
    getSource(e) {
        if (e.status) {
            var tabid1 = this.printDataSource;
            var tabId0 = {
                //公司
                enterpriseName: USER_INFO_CONTEXT.enterpriseName,
                //日期
                DataDate: new DateTime(this.model.conditionPanel.data['DataDate']).toString(),
                //客户
                CustomerName: this.model.conditionPanel.data['CustomerName'] == undefined ? '' : this.model.conditionPanel.data['CustomerName'],
                //业务员
                SalesManName: this.model.conditionPanel.data['SalesManName'] == undefined ? '' : this.model.conditionPanel.data['SalesManName'],
                //部门
                MarketName: this.model.conditionPanel.data['MarketName'] == undefined ? '' : this.model.conditionPanel.data['MarketName'],
                //销售日期
                ReqDeliveryDate: this.model.conditionPanel.data['ReqDeliveryDate'] == undefined ? '' : new DateTime(this.model.conditionPanel.data['ReqDeliveryDate']).toString(),
                //时段
                SalesPeriodName: this.model.conditionPanel.data['SalesPeriodName'] == undefined ? '' : this.model.conditionPanel.data['SalesPeriodName'],
                //摘要
                AbstractName: this.model.conditionPanel.data['AbstractName'] == undefined ? '' : this.model.conditionPanel.data['AbstractName'],
                //收货客户
                SubCustomerName: this.model.conditionPanel.data['SubCustomerName'] == undefined ? '' : this.model.conditionPanel.data['SubCustomerName'],
                //单位
                EnterpriseName: USER_INFO_CONTEXT.enterpriseName,
                // 单据号
                Number: this.model.conditionPanel.data['Number'] == undefined ? '' : this.model.conditionPanel.data['Number'],
                // 说明
                Remarks: this.model.conditionPanel.data['Remarks'] == undefined ? '' : this.model.conditionPanel.data['Remarks'],
                // 制单人
                creatorName: this.model.review.ownerName,
                //财务
                financeReviewName: this.model.review.financeReviewName,
                //仓库
                warehouseReviewName: this.model.review.warehouseReviewName,
                // 审核人
                auditerName: this.model.review.reviewName
            };

            let sources = {
                tabId0: tabId0,
                tabId1: tabid1,
            };

            this._printPage.instance.printGeneration(sources);
        }
    }

}
