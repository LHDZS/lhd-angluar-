import { Component, ViewChild } from '@angular/core';
import { NxFormDetail } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail-extend';
import { NxZlwFormDetailComponent } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { ActivatedRoute } from '@angular/router';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxConditionItem } from 'src/app/components/search-panel/search-panel-extend';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { DataStatus, FormOptions, DataDictionary, DataDictionarySource } from 'src/app/providers/enums';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { NxDataGridSummaryTotal } from 'src/app/components/component-model/data-grid/summary/model';
import { QlwODataContext, BasicSettingODataContext, QlwCustomerContext } from 'src/app/providers/odataContext';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { NxDataGridColumnValidationRule } from 'src/app/components/component-model/data-grid/columns/validation-rule/model';
import { RegExps } from 'src/app/providers/regexp';
import { DateTime } from 'src/app/providers/common/datetime';
import { layEggsIndexService } from '../layEggsIndex.service';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { TokenAuthService } from 'src/app/shared/services';
import { layEggsIndexModel } from '../layEggsIndex.model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { groupBy } from 'src/app/providers/groupby';
import { PrintPageComponent } from 'nxin-print';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { dealBigMoney, Distinct } from 'src/app/providers/distinct';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { ToolbarPanelType } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { YHProductionODataContext } from 'src/app/providers/odataContext/yhp.odataContext';
import DataSource from 'devextreme/data/data_source';

@Component({
    selector: 'layEggsIndex-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class layEggsIndexDetailComponent {
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
    dataDateFlag: boolean = false;
    pcDate: string;
    DaysOld: Number;
    editFlag: boolean = false;
    allProductBatchSource: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    printDataSource: any = [];
    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;
    outVisible: boolean = false;
    formData: any = {};
    $form: boolean = false;
    AutoDataSource: any;
    AutoDataSourceFilter: any;
    selectedRows: any;
    loading: boolean = false;
    BatchDataSource: any;
    ChickenFarmDataSource: any;
    HenhouseSourceall: any;
    modifyVisible: boolean = false;
    HenhouseBydataSource: any;
    popupDataSource: any = [
        {
            name: 123,
        },
    ]; // 弹框-表格
    popupVisible: boolean = false;
    //#endregion
    constructor(
        private route: ActivatedRoute,
        private service: layEggsIndexService,
        private http: HttpClient,
        private qlwOdataContext: QlwODataContext,
        private tokenService: TokenAuthService,
        private basicSettingODataContext: BasicSettingODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private translator: TranslateService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private StatusODataContext: StatusODataContext
    ) {
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.model.initialization = this.initialization.bind(this);

        // this.service.getProductBatch().then((res: any) => {
        //     this.allProductBatchSource = res.value;
        // });

        this.YHBasicSettingODataContext.YHBatch.load().then((res: any) => {
            this.BatchDataSource = res;
        });

        this.basicSettingODataContext.bizChickenFarm.load().then((res: any) => {
            this.ChickenFarmDataSource = res;
        });

        this.init_data_grid().init_table_header().init_toolbar_panel();
    }
    //#region 初始化表格
    init_data_grid(): layEggsIndexDetailComponent {
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.stateStoring.storageKey = 'layEggsIndex-detail';
        this.model.dataGrid.stateStoring.enabled = true;
        this.model.dataGrid.columns.push(...this.columns);
        this.model.dataGrid.editing.enabled = true;
        // this.model.dataGrid.summary.enabled = true;

        // const summaryItem_total_Packages = new NxDataGridSummaryTotal();
        // summaryItem_total_Packages.column = 'Packages';
        // summaryItem_total_Packages.summaryType = 'sum';
        // summaryItem_total_Packages.valueFormat = '0';

        // const summaryItem_total_Quantity = new NxDataGridSummaryTotal();
        // summaryItem_total_Quantity.column = 'Quantity';
        // summaryItem_total_Quantity.summaryType = 'sum';
        // summaryItem_total_Quantity.valueFormat = '0';

        // this.model.dataGrid.summary.totalItems = [summaryItem_total_Packages, summaryItem_total_Quantity];
        this.model.dataGrid.events.onCellClick = this.handleCell.bind(this);
        this.model.dataGrid.paginate.pager.visible = 'auto';
        // this.model.dataGrid.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);

        // mock data
        // console.log(111)
        // this.model.dataGrid.props.dataSource = [
        //     {
        //         id: 1,
        //         DaysWeek: '111'
        //     },
        // ];

        return this;
    }

    get columns() {
        // 周龄
        const col_DaysWeek = new NxDataGridColumn('周龄', 'DaysWeek', 'number');
        col_DaysWeek.props.alignment = 'center';
        col_DaysWeek.props.lookup.enabled = true;
        col_DaysWeek.props.allowEditing = false;

        // 母死淘率
        const col_FemaleDeadRate = new NxDataGridColumn('母死淘率%', 'FemaleDeadRate', 'number');
        col_FemaleDeadRate.props.alignment = 'center';
        // col_FemaleDeadRate.props.allowEditing = false;

        // 产蛋率
        const col_LayingRate = new NxDataGridColumn('产蛋率%', 'LayingRate', 'number');
        col_LayingRate.props.alignment = 'center';
        // col_LayingRate.props.allowEditing = false;

        // 种蛋合格率
        const col_QualifiedEggRate = new NxDataGridColumn('种蛋合格率%', 'QualifiedEggRate', 'number');
        col_QualifiedEggRate.props.alignment = 'center';
        // col_QualifiedEggRate.props.allowEditing = false;

        return [col_DaysWeek, col_FemaleDeadRate, col_LayingRate, col_QualifiedEggRate];
    }

    onEditorPreparingFn(e) {
        console.log(33);
        if (e.parentType == 'dataRow') {
            const defaultValueChangeEvent = e.editorOptions.onValueChanged;
            const rowData = e.row.data;
            let triggerValueChanged = true;

            switch (e.dataField) {
                case 'HenhouseID':
                    e.editorOptions.dataSource = this.HenhouseBydataSource;
                    break;
                case 'DetailProductID':
                    // var ProductBatchID = e.row.data['ProductBatchID'];
                    // ProductBatchID = ''
                    break;
                case 'ProductBatchID':
                    var ProductID = e.row.data['DetailProductID'];
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
                    if (!args.previousValue && args.previousValue != 0 && !args.value && args.value != 0) {
                    } else {
                        this.detailInstance.modifyDataStatusSet();
                        setTimeout(() => {
                            e.setValue(args.value, args.component._changedValue);
                        }, 0);
                    }
                };
            }
        }
    }

    handleCell(e) {}

    //#endregion
    //#region 初始化工具条
    init_toolbar_panel(): layEggsIndexDetailComponent {
        this.model.toolbar.checkInfo.visible = false;
        // this.model.toolbar.moreButton.props.visible = true;

        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).props.visible = false;
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('messageBox')).props.visible = false;
        (<NxButton>this.model.toolbar.getOtherWidgetByKey('filterRow')).events.onClick =
            this.toogleFilterRow.bind(this);
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('setting')).props.visible = true;
        // this.model.toolbar.getOtherWidgetByKey('headSetting').props.visible = true;

        // 引入生产标准按钮
        const introduceButton = new ToolbarPanelType();
        introduceButton.key = 'import-button';
        introduceButton.widget = new NxButton('引入生产标准', 'iconfont iconadd-select');
        introduceButton.widget.props.disabled = false;

        // 导出按钮
        const exportButton = new ToolbarPanelType();
        exportButton.key = 'export-button';
        exportButton.widget = new NxButton('导出表体');

        this.model.toolbar.mainPanel.push(...[introduceButton, exportButton]);

        (<NxButton>this.model.toolbar.getWidgetByKey('export-button')).events.onClick = this.onExport.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('import-button')).events.onClick = this.onImport.bind(this);

        return this;
    }
    toogleFilterRow() {
        this.detailInstance.dataGrid.toggleFilterRow();
    }

    onImport() {
        this.popupVisible = true;

        // let filter = [];
        // this.popupDataSource = this.service.getPopupData(filter);
    }

    onRowDblClick(e) {
        console.log('row data ', e.data);
    }

    /**
     * 导出表体
     */
    onExport() {
        console.log('export');
        this.model.dataGrid.export.fileName = `${new DateTime().toString()}`;
        // this.model.dataGrid.instance.exportToExcel(false);

        // this.model.dataGrid.export(false);
        console.log(this.model.dataGrid);
        // console.log(this.model.dataGrid.export);

        // console.log(<Array<any>>this.model.dataGrid.props.dataSource);

        console.log(33333);
        console.log(this.detailInstance.dataGrid);

        console.log(this.model.dataGrid.events);

        let option = {
            fileName: `${new DateTime().toString()}`,
        };
        this.detailInstance.detailExport(option);
    }

    create() {
        this.model.conditionPanel.data = {};
        this.detailInstance.cacheSearchData = {};
        this.model.conditionPanel.data['DataDate'] = new Date();
        this.model.conditionPanel.data.NumericalOrder = '';
        this.numericalOrder = '';
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data.Remarks = '';
        this.model.dataGrid.type = 'detail';
        this.detailInstance.$open = FormOptions.$create;
        this.model.review.visible = false;
        // this.getWarehouse(USER_INFO_CONTEXT.childId);
        // this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);

        // setTimeout(() => {
        //     console.log(111)
        //     // this.detailInstance.createDataStatus();
        //     // 设置按钮默认情况
        // }, 20);

        (<NxButton>this.model.toolbar.getWidgetByKey('import-button')).props.disabled = false;
        (<NxButton>this.model.toolbar.getWidgetByKey('export-button')).props.disabled = false;

        let arr = [];
        for (let i = 22; i < 81; i++) {
            arr.push({
                DaysWeek: i,
            });
        }
        setTimeout(() => {
            this.model.dataGrid.props.dataSource = arr;

            this.model.dataGrid.commandRow.visible = false; // 禁用删行增行
        }, 400);
    }
    save() {
        this.detailInstance.saveChanges().then((value) => {
            this.detailInstance.openCheck(
                () => {
                    const data = this.getSaveData(value);
                    console.log('data: ', data);
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
                        const data = this.getSaveData(value);
                        console.log('data:222 ', data);
                        if (data) {
                            this.service.update(data).then((result: Result) => {
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
    }
    private dataValidation(data): boolean {
        const validator = new DataValidator();
        validator.forObjRequire(data, [
            // ['DetailProductID', this.translator.I18N.layEggsIndexDetail.ProductName.required],
            // ['TotalQuantity', this.translator.I18N.layEggsIndexDetail.TotalQuantity.message],
            // ['UnitPrice', this.translator.I18N.layEggsIndexDetail.UnitPrice.message],
        ]);
        return validator.validation;
    }

    private getSaveData(value) {
        const validation = this.dataValidation(value.body);
        if (validation) {
            let saveData = new layEggsIndexModel();
            const date = new DateTime(value.header.DataDate.toString()).toString('yyyy-MM-dd');
            saveData.DataDate = date;
            saveData.NumericalOrder = value.header.NumericalOrder || '0';
            saveData.Remarks = value.header.Remarks || '';
            if (value.header.Number) {
                saveData.Number = value.header.Number;
            }
            value.body.map((m) => {
                // console.log(m);
                saveData.layEggsIndexDetailDto.push({
                    NumericalOrder: m.NumericalOrder || '0',
                    NumericalOrderDetail: m.NumericalOrderDetail || '0',
                    DaysWeek: m.DaysWeek || 0,
                    FemaleDeadRate: m.FemaleDeadRate || 0,
                    LayingRate: m.LayingRate || 0,
                    QualifiedEggRate: m.QualifiedEggRate || 0,
                    Target: m.target,
                });
            });
            if (this.detailInstance.$open == FormOptions.$modify) {
                saveData.layEggsIndexDetailDto.push(...value.deleted);
            }
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }

    //#endregion

    //#region  表头配置
    init_table_header(): layEggsIndexDetailComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        //制单日期
        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.label = '制单日期';
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.requiredDisable = true;
        condition_date.widget = new NxDateBox();
        // condition_date.widget.props.disabled = true;
        condition_date.widget.props.readOnly = false;

        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        // condition_date.widget.props.max = new Date();

        // 名称
        const condition_optName = new NxConditionItem();
        condition_optName.label = '名称';
        condition_optName.required = true;
        condition_optName.dataField = 'OptName';
        condition_optName.type = 'TextBox';
        condition_optName.widget = new NxTextBox();

        // 单据号
        const col_number = new NxConditionItem('单据号', 'Number', 'TextBox');
        col_number.widget = new NxTextBox();
        col_number.requiredDisable = false;
        col_number.widget.props.readOnly = true;

        this.model.conditionPanel.conditionItems.push(...[condition_date, condition_optName, col_number]);
        return this;
    }

    getWarehouse(value) {
        if (this.editFlag) {
            return;
        }
        if (value && value != '0') {
            var param = 'ChickenFarmID=' + value + '&Billtype=zjyz&';
            this.service.queryWarehouseByFarm(<any>param).then((res: any) => {
                if (res && res.WarehouseID && res.WarehouseID != '0') {
                    this.model.conditionPanel.data['WarehouseID'] = res.WarehouseID;
                } else {
                    this.model.conditionPanel.data['WarehouseID'] = null;
                }
            });
        } else {
            this.model.conditionPanel.data['WarehouseID'] = null;
        }
    }

    updateDaysOld() {
        if (this.editFlag) {
            return;
        }
        var DaysOld = '';
        if (this.pcDate && this.DaysOld && this.model.conditionPanel.data['DataDate']) {
            let pcDate = new DateTime(this.pcDate).toString('yyyy-MM-dd');
            let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let start = new Date(DataDate);
            let end = new Date(pcDate);
            let diff = new DateTime().diff(start, end);
            DaysOld = Number(diff) + Number(this.DaysOld) + '';
        }
        this.model.conditionPanel.data['DaysOld'] = DaysOld;
    }
    removeRow() {
        // 底部删除选中行
        // 获取到用户当前选中的key
        // 删除数据的时候需要把数据标记为delete
        if (!this.detailInstance.dataGrid.model.editing.allowUpdating) {
            Notify.toast('当前状态不可以操作', NotifyType.Warning);
            return;
        }
        if ((<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length == 0) {
            return;
        }
        if (this.detailInstance.dataGrid.selectRowIndex == -1) {
            this.detailInstance.dataGrid.dataGrid.instance.deleteRow(
                (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length - 1
            );
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
            let deletedRowData = (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).splice(
                this.detailInstance.dataGrid.selectRowIndex,
                1
            );
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
    }
    queryDetail() {
        this.service
            .getCustomDataSourceById(this.numericalOrder)
            .load()
            .then((value: Array<any>) => {
                this.editFlag = true;
                console.log(222);
                this.model.dataGrid.props.dataSource = value;
                this.model.dataGrid.props.dataSource.map((m) => (m.target = DataStatus.none));
                this.model.conditionPanel.data = value[0];
                this.model.conditionPanel.data['ConfirmStatus'] = value[0].ConfirmStatus ? 1 : 0;
                this.detailInstance.cacheSearchData = deepCopy(value[0]);
                this.detailInstance.cacheBodyData = deepCopy(value);
                //开启审核功能
                this.model.review.visible = true;
                this.model.review.numericalOrder = this.numericalOrder;
                // this.qlwOdataContext.personODataStore
                // .byKey(value[0].OwnerID)
                // .then((value) => {
                //     if(value&&value.length>0&&value[0].PersonName){
                //         this.model.review.ownerName = value[0].PersonName;
                //     }
                // });
                this.model.review.ownerName = value[0].CreatedOwnerName;
                setTimeout(() => {
                    this.detailInstance.saveDataAfterStatus();
                    this.editFlag = false;
                    if (value[0].ChickenSource == DataDictionary.ChickenSourceA) {
                        this.model.conditionPanel.conditionItems.filter(
                            (q) => q.dataField == 'DataDate'
                        )[0].widget.props.readOnly = true;
                    } else {
                        this.model.conditionPanel.conditionItems.filter(
                            (q) => q.dataField == 'DataDate'
                        )[0].widget.props.readOnly = false;
                    }
                }, 200);
            });
    }
    //#region 初始化数据源
    initialization(e: NxZlwFormDetailComponent) {
        e.isRightReview = true; //禁用右键
        console.log(333333455);
        this.model.dataGrid.commandRow.visible = false; //禁用删行、增行
        // this.detailInstance.dataGrid.commandRow.visible = false; //禁用删行、增行
        //详情进入编辑页面
        if (this.route.queryParams['value']['$open'] == FormOptions.$modify) {
            console.log('modify');
            setTimeout(() => {
                this.queryDetail();
            }, 200);
        } else {
            console.log('dddsss');
            setTimeout(() => {
                this.create();
            }, 200);
        }
        // setTimeout(() => {
        //     this.detailInstance.dataGrid.removeRow = this.removeRow.bind(this);
        // }, 1000);
    }
}
