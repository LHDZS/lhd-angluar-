import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import { NxFormDetail } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail-extend';
import { NxZlwFormDetailComponent } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxNumberBox } from 'src/app/components/component-model/number-box/mode';
import { NxButton } from 'src/app/components/component-model/button/model';
import { DateTime } from 'src/app/providers/common/datetime';
import {
    BasicSettingODataContext,
    ProductODataContext,
    QlwCustomerContext,
    QlwODataContext,
    QlwProductContext,
    YHBasicSettingODataContext,
    YHProductionODataContext,
} from 'src/app/providers/odataContext';
import { DataDictionarySource, DataStatus} from 'src/app/providers/enums';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { NxConditionItem } from 'src/app/components/search-panel/search-panel-extend';
import { NxDataGridSummaryTotal } from 'src/app/components/component-model/data-grid/summary/model';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxDataGridColumnValidationRule } from 'src/app/components/component-model/data-grid/columns/validation-rule/model';
import {
    FormOptions,
    DataDictionary
} from 'src/app/providers/enums';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { USER_GUIDE_CONTEXT, USER_INFO_CONTEXT } from 'src/app/providers/context';
import { YHClearHouseModel, YHClearHouseDetailModel } from '../yhclearhouse.model';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { Notify, NotifyType, MessageBox } from 'src/app/providers/notify';
import { YHClearHouseService } from '../yhclearhouse.service';
// import { DataStatus } from 'src/app/components/editor-grid/util/index';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { EditorGridComponent } from 'src/app/components/editor-grid';
import { EditorGridUtils } from 'src/app/components/editor-grid';
import { DataValidator, ValidationType } from 'src/app/providers/common/dataValidator';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import Guid from 'devextreme/core/guid';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { RegExps } from 'src/app/providers/regexp';
import { PrintPageComponent } from 'nxin-print';
import { TokenAuthService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-yhclearhouse-create',
    templateUrl: './yhclearhouse-create.component.html',
    styleUrls: ['./yhclearhouse-create.component.scss'],
})
export class YHClearHouseCreateComponent implements OnInit {
    @ViewChild('detailInstance', { static: false })
    detailInstance: NxZlwFormDetailComponent;
    model: NxFormDetail = new NxFormDetail();
    numericalOrder: string;
    // @ViewChild('form', { static: false })
    // formInstance: DxFormComponent;
    $option: FormOptions = FormOptions.$modify;
    // formData: any = new ProductPackageSetModel();
    // @ViewChild('detailGrid', { static: false })
    // _detailGrid: DxDataGridComponent;
    // @ViewChild('editorGrid', { static: false })
    // _editorGrid: EditorGridComponent;
    submitOption: any;
    $save: boolean = true;
    $deleted: boolean = false;
    ff: boolean = true;
    today: Date = new Date();
    positiveNumberFix2 = RegExps.PositiveNumberFix2;
    detailSource: any;
    // 商品数据源
    productSource: any;
    // 代次
    GenerationLineDataSource: any;
    // 配套系
    MultilineCrossDataSource: any;
    // 品种
    BreedingDataSource: any;
    // 系别
    DescentLineSource: any;
    // 类型
    BatchTypeDataSource: any;
    // 农场
    FarmDataSource: any;

    sexTypeSource: any;

    BatchSource: any = new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
        filter: [
            ['YHFarmerID', '=', '']
        ]
    }));

    layEggCategoryDataSource: any;

    initFlag: boolean = true;

    initFlag2: boolean = true;
    farmDisable: boolean = false;

    // 以选取的方式创建耳标
    earTagSelectOption: boolean = false;

    zqHenhouseSource: any = [];
    zqDataSource: any = [];
    // genderSource: any[] = [
    //     { ID: PigGender.Girl, Name: PigGender.GirlName },
    //     { ID: PigGender.Boy, Name: PigGender.BoyName },
    // ];
    NumericalOrder: string;
    compareDataSource: YHClearHouseModel;
    varietiesDisplayKey: string;
    varietiesValueKey: string;
    /** 明细信息 */
    _detailUtil = new EditorGridUtils<YHClearHouseDetailModel>('RecordID', 3);

    //打印
    menu_id: string;
    environment: any;
    tokenData: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    printDataSource:any=[];

    constructor(
        private route: ActivatedRoute,
        private qlwOdataContext: QlwODataContext,
        private service: YHClearHouseService,
        private basicSettingODataContext: BasicSettingODataContext,
        private productODataContext: ProductODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private USER_GUIDE: USER_GUIDE_CONTEXT,
        private translator: TranslateService,
        public changeDetectorRef: ChangeDetectorRef,
        private tokenService: TokenAuthService,
    ) {

        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;

        // this.BatchID = this.route.queryParams['value']['BatchID'];
        this.$option = this.route.queryParams['value']['$option'];
        this.NumericalOrder = `${this.route.queryParams['value']['NumericalOrder']}`;
        // this.submitOption = {
        //     text: '保存',
        //     type: 'success',
        //     onClick: this.save.bind(this),
        // }

        this.init_data_grid().init_table_header().init_toolbar_panel();

        this.model.initialization = this.initialization.bind(this);
    }

    ngOnInit() {




    }

    ngAfterViewInit(){
        // var dfOnReviewSuccess = this.model.review.onReviewSuccess.bind(this.detailInstance);
        // this.model.review.onReviewSuccess = () => {
        //     dfOnReviewSuccess();
        //     for(let condition of this.model.conditionPanel.conditionItems)
        //     {
        //         if(condition.dataField == 'ChickenFarmID' || condition.dataField == 'WarehouseID')
        //         {
        //             condition.widget.props.disabled = true;
        //         }
        //     }
        // }

        //扩展删行逻辑
        var dfRemoveRow = this.detailInstance.dataGrid.removeRow.bind(this.detailInstance.dataGrid);
        this.detailInstance.dataGrid.removeRow = () => {
            dfRemoveRow();
            if((<Array<any>>this.model.dataGrid.props.dataSource).length <= 0)
            {
                this.model.conditionPanel.conditionItems.map(m => {
                    if(m.dataField == "YHBatch")
                    {
                        m.widget.props.readOnly = false;
                    }
                });
            }
        }
    }
    // 删除
    handleCell(e) {
        if (e.row) {
            // if (e.column.dataField == 'ProductBatchID') {
            //     if (e.data['ProductID']) {
            //         e.column.lookup.dataSource =  this.BatchDataSourceThree.filter(o => o.ProductID == e.data['ProductID']);
            //     } else {
            //         e.column.lookup.dataSource = [];
            //     }
            // }
        }
    }
    //#region 初始化表格
    init_data_grid(): YHClearHouseCreateComponent {
        this.model.dataGrid.stateStoring.storageKey = 'yhClearHouse-create';
        this.model.dataGrid.stateStoring.enabled = true;
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.columns.push(...this.columns);
        this.model.dataGrid.events.onCellClick = this.handleCell.bind(this);
        this.model.dataGrid.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.commandAddRow.visible = false;
        // this.model.dataGrid.summary.enabled = true;
        // const summaryItem_total_Quantity = new NxDataGridSummaryTotal();
        // summaryItem_total_Quantity.column = 'Quantity';
        // summaryItem_total_Quantity.summaryType = 'sum';
        // summaryItem_total_Quantity.valueFormat = '2';

        // this.model.dataGrid.summary.totalItems = [
        //     summaryItem_total_Quantity,
        // ];
        this.model.dataGrid.paginate.pager.visible = 'auto';
        return this;
    }

    onEditorPreparingFn(e) {
        if (e.parentType == 'dataRow') {
            // const defaultValueChangeEvent = e.editorOptions.onValueChanged;
            // e.editorOptions.onValueChanged = (args) => {
            //     this.detailInstance.modifyDataStatusSet();
            //     setTimeout(() => {
            //         // 将选中的文本值赋值到数据源上,_changedValue是下拉数据中对应的文本值
            //         e.setValue(args.value, args.component._changedValue);
            //     }, 0);
            //     defaultValueChangeEvent(args);
            // };
            switch (e.dataField) {
                case 'ImmuneType':
                    e.editorOptions.dataSource = this.basicSettingODataContext.getBizRemindGroupDataSource({
                        filter: [[
                                    'PID', '=', DataDictionary.ImmuneType
                                ],[
                                    'Status', '=', true
                                ]],
                        select: ['RemindID', 'RemindName'],
                    })
                break;
                default:
                    break;
            }
            var dfOnValueChanged = e.editorOptions.onValueChanged
            e.editorOptions.onValueChanged = (args) => {
                // detaiilInstance是详情组件的实例,这里是单元格编辑之后的工具条按钮状态控制
                this.detailInstance.modifyDataStatusSet();
                // 用setTimeout延迟支持获取选中的文本值
                // setTimeout(() => {
                //     // 将选中的文本值赋值到数据源上,_changedValue是下拉数据中对应的文本值
                //     e.setValue(args.value, args.component._changedValue);
                // }, 0);
                dfOnValueChanged(args);
            };
        }
    }

    addCoustomItem(data){
        console.log(data);
    }

    get columns() {

        //栋舍
        const col_HenhouseID = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.HenhouseID.text, "HenhouseID", "string");
        col_HenhouseID.props.lookup.enabled = true;
        col_HenhouseID.props.lookup.dataSource = this.yhProductionODataContext.getYHFarmerContractHenhouseDetailDataSource();
        col_HenhouseID.props.lookup.valueExpr = 'hHenhouseID';
        col_HenhouseID.props.lookup.displayExpr = 'hHenhouseName';
        col_HenhouseID.props.allowEditing = false;


        //账存
        const col_CounterQuantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.CounterQuantity.text, "CounterQuantity", "number");
        col_CounterQuantity.props.alignment = "right";
        col_CounterQuantity.props.allowEditing = false;
        col_CounterQuantity.props.setCellValue = (newData, value, oldData) => {
            console.log(value);
            (<Array<any>>this.model.dataGrid.props.dataSource).map(row => {
                if(row.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    row.CounterQuantity = value;

                    console.log(row);
                    if(row.DeathCullOuter)
                    {
                        row.UnknownQuantity = value - row.DeathCullOuter;
                    }
                    else
                    {
                        row.UnknownQuantity = value;
                    }
                }
            })
        }

        //不明去向
        const col_UnknownQuantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.UnknownQuantity.text, "UnknownQuantity", "number");
        col_UnknownQuantity.props.alignment = "right";
        col_UnknownQuantity.props.allowEditing = false;
        // col_UnknownQuantity.props.setCellValue = (newData, value, oldData) => {
        //     (<Array<any>>this.model.dataGrid.props.dataSource).map(row => {
        //         if(row.NumericalOrderDetail == oldData.NumericalOrderDetail)
        //         {
        //             if (0<= value && value <= row.CounterQuantity) {
        //                 this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
        //                 row.UnknownQuantity = value;

        //                 if(row.CounterQuantity)
        //                 {
        //                     row.DeathCullOuter = row.CounterQuantity - value;
        //                 }
        //             }
        //             else{
        //                 Notify.warning("请输入不大于账存的正整数")
        //             }
        //         }
        //     })
        // }

        //补登死亡
        const col_DeathCullOuter = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.DeathCullOuter.text, "DeathCullOuter", "number");
        col_DeathCullOuter.props.alignment = "right";
        // var col_DeathCullOuter_pattern = new NxDataGridColumnValidationRule();
        // col_DeathCullOuter_pattern.type = 'pattern';
        // col_DeathCullOuter_pattern.pattern = RegExps.PositiveInteger1;
        // col_DeathCullOuter_pattern.message = this.translator.I18N.YHPoultrySalesDetail.Quantity.patternMessage;
        // col_DeathCullOuter.validationRules.push(col_DeathCullOuter_pattern);
        col_DeathCullOuter.props.setCellValue = (newData, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map(row => {
                if(row.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    this.detailInstance.dataGrid.dataGrid.instance.saveEditData();

                    if (0<= value && value <= row.CounterQuantity) {
                        row.DeathCullOuter = value;
                        if(row.CounterQuantity)
                        {
                            row.UnknownQuantity = row.CounterQuantity - value -row.WeedOuter;
                        }
                    }
                    else{
                        Notify.warning("请输入不大于账存的正整数")
                    }
                }
            })
        }
        //补登淘汰
        const col_WeedOuter = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.WeedOuter.text, "WeedOuter", "number");
        col_WeedOuter.props.alignment = "right";
        col_WeedOuter.props.setCellValue = (newData, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map(row => {
                if(row.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    this.detailInstance.dataGrid.dataGrid.instance.saveEditData();

                    if (0<= value && value <= row.CounterQuantity) {
                        row.WeedOuter = value;
                        if(row.CounterQuantity)
                        {
                            row.UnknownQuantity = row.CounterQuantity - value-row.DeathCullOuter;
                        }
                    }
                    else{
                        Notify.warning("请输入不大于账存的正整数")
                    }
                }
            })
        }
        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.Remarks.text, "DetailRemarks", "string");

        //领苗
        const col_ReceiveQuantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.ReceiveQuantity.text, "ReceiveQuantity", "number");
        col_ReceiveQuantity.props.alignment = "right";
        col_ReceiveQuantity.props.allowEditing = false;

        //记录死亡
        const col_RegDeathCullQuantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.RegDeathCullQuantity.text, "RegDeathCullQuantity", "number");
        col_RegDeathCullQuantity.props.alignment = "right";
        col_RegDeathCullQuantity.props.allowEditing = false;
        //记录淘汰
        const col_RegWeedOutQuantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.RegWeedOutQuantity.text, "RegWeedOutQuantity", "number");
        col_RegWeedOutQuantity.props.alignment = "right";
        col_RegWeedOutQuantity.props.allowEditing = false;

        //转出
        const col_RollOutQuantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.RollOutQuantity.text, "RollOutQuantity", "number");
        col_RollOutQuantity.props.alignment = "right";
        col_RollOutQuantity.props.allowEditing = false;

        //转入
        const col_RollInQuantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.RollInQuantity.text, "RollInQuantity", "number");
        col_RollInQuantity.props.alignment = "right";
        col_RollInQuantity.props.allowEditing = false;

        //盘盈
        const col_TransferSurplus = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.TransferSurplus.text, "TransferSurplus", "number");
        col_TransferSurplus.props.alignment = "right";
        col_TransferSurplus.props.allowEditing = false;

        //盘亏
        const col_TransferLoss = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.TransferLoss.text, "TransferLoss", "number");
        col_TransferLoss.props.alignment = "right";
        col_TransferLoss.props.allowEditing = false;

        //出栏死亡
        const col_DeadQuantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.DeadQuantity.text, "DeadQuantity", "number");
        col_DeadQuantity.props.alignment = "right";
        col_DeadQuantity.props.allowEditing = false;

        //回收
        const col_Quantity = new NxDataGridColumn(this.translator.I18N.YHClearHouseDetail.Quantity.text, "Quantity", "number");
        col_Quantity.props.alignment = "right";
        col_Quantity.props.allowEditing = false;

        return [
            col_HenhouseID,
            col_CounterQuantity,
            col_UnknownQuantity,
            col_DeathCullOuter,
            col_WeedOuter,
            col_Remarks,
            col_ReceiveQuantity,
            col_RegDeathCullQuantity,
            col_RegWeedOutQuantity,
            // col_RollOutQuantity,
            // col_RollInQuantity,
            // col_TransferSurplus,
            // col_TransferLoss,
            // col_DeadQuantity,
            col_Quantity
        ]
    }
    //#endregion

    //#region  表头配置
    init_table_header(): YHClearHouseCreateComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        //建档日期
        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.headVisible = true;
        condition_date.requiredDisable = true;
        condition_date.label = this.translator.I18N.YHClearHouse.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        // condition_date.widget.props.max = new Date();
        condition_date.widget.events.onValueChanged = resetBatchSource.bind(this);

        //养户名称
        const condition_YHFarmerName = new NxConditionItem();
        condition_YHFarmerName.label = this.translator.I18N.YHBatch.YHFarmerName.text;
        condition_YHFarmerName.required = true;
        condition_YHFarmerName.requiredDisable = true;
        condition_YHFarmerName.type = 'SelectBox';
        condition_YHFarmerName.dataField = 'YHFarmerID';
        condition_YHFarmerName.widget = new NxSelectBox();
        condition_YHFarmerName.widget.props.showClearButton = true;
        condition_YHFarmerName.widget.props.dataSource = this.yhBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                ['Status', '=', true]
            ]
        });
        condition_YHFarmerName.widget.props.valueExpr = "YHFarmerID";
        condition_YHFarmerName.widget.props.displayExpr = "YHFarmerName";
        condition_YHFarmerName.widget.events.onValueChanged = resetBatchSource.bind(this);

        async function resetBatchSource(value, preValue){
            this.model.conditionPanel.data.YHBatch = null;

            if(value)
            {
                let isManageToHenhouse = await this.service.getConfiguration();
                let filter: Array<any> = [
                    ['Status', '=', true],
                ];

                if(this.model.conditionPanel.data.DataDate)
                {
                    filter.push(['DataDate', '<=', new Date(this.model.conditionPanel.data.DataDate)]);
                }

                if(this.model.conditionPanel.data.YHFarmerID)
                {
                    filter.push(['YHFarmerID', '=', this.model.conditionPanel.data.YHFarmerID]);
                }

                (<NxSelectBox>condition_YHBatch.widget).props.dataSource = await new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter
                })).load();

                if(!isManageToHenhouse)
                {
                    //排除当前单位当前主表养户已做过清棚单的养户批次
                    let clearHouseDetailSource = this.service.getDetailSource();
                    clearHouseDetailSource.filter([
                        ['NumericalOrder', '<>', this.NumericalOrder || ''],
                    ]);

                    let ClearedBatchList:Array<any> = await clearHouseDetailSource.load().then((res:Array<any>) => res.map(m => m.YHBatch));
                    (<Array<any>>(<NxSelectBox>condition_YHBatch.widget).props.dataSource)
                    = (<Array<any>>(<NxSelectBox>condition_YHBatch.widget).props.dataSource)
                    .filter(m => ClearedBatchList.indexOf(m.YHBatch) == -1);
                }

                if((<NxSelectBox>condition_YHBatch.widget).props.dataSource.length == 1)
                {
                    this.model.conditionPanel.data.YHBatch = (<NxSelectBox>condition_YHBatch.widget).props.dataSource[0].YHBatchID;
                }
            }
            else
            {
                (<NxSelectBox>condition_YHBatch.widget).props.dataSource = [];
            }

            condition_YHBatch.widget.props.readOnly = false;
        }

        //养户批次
        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YhChickenReceive.YHBatch.text;
        condition_YHBatch.required = true;
        condition_YHBatch.requiredDisable = true;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.widget = new NxSelectBox();
        condition_YHBatch.widget.props.dataSource = this.BatchSource;
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';
        condition_YHBatch.widget.props.searchExpr = ['YHBatchName', 'MnemonicCode'];
        condition_YHBatch.widget.events.onValueChanged = async (value, preValue) =>
        {
            this.model.conditionPanel.data.ChickenFarmID = null;
            this.model.conditionPanel.data.WarehouseID = null;
            //清空当前明细
            (<Array<any>>this.model.dataGrid.props.dataSource).forEach((m) => {
                if(m.target != DataStatus.newline)
                {
                    m.target = DataStatus.deleted;
                    this.detailInstance.dataGrid.$deletedData.push(m);
                }
            });
            this.model.dataGrid.props.dataSource = [];

            if(!value)
            {
                return;
            }

            //#region 修改表头
            //养户批次获得养殖场、养殖合同
            let ContractNum = await new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
                filter: ["YHBatchID", '=', value]
            })).load().then((res) => {
                if(res.length > 0)
                {
                    let yhBatch = res[0];
                    this.model.conditionPanel.data['ChickenFarmID'] = yhBatch['ChickenFarmID'] || "0";
                    return yhBatch['YHFarmerContract'];
                }
                return false;
            })
            .catch(() => {
                return "0";
            })

            //养户合同获得养户领苗摘要
            let ChickAbstract = await new DataSource(this.yhProductionODataContext.getYHFarmerContractInfoDataSource({
                filter: ["NumericalOrder", '=', ContractNum]
            })).load().then(res => {
                if(res.length > 0 && res[0]["ChickAbstract"] == DataDictionary.MaterialSupplyPolicyA)
                {
                    let yhContract = res[0];
                    return this.model.conditionPanel.data['ChickAbstract'];
                }
                return false;
            })
            .catch(() => {
                return false;
            })

            //养殖场获得存栏仓库
            let WarehouseID = await new DataSource(this.yhBasicSettingODataContext.getYHChickenFarmRelateDataSource({
                filter: ['ChickenFarmID', '=', this.model.conditionPanel.data['ChickenFarmID']]
            })).load().then(res => {
                if(res.length > 0)
                {
                    let ChickenFarm = res[0]
                    return ChickAbstract ==  DataDictionary.MaterialSupplyPolicyA ? ChickenFarm["WarehouseID"] : "0";
                }
                return false;
            })
            .catch(() => {
                return "0";
            })

            this.model.conditionPanel.data['WarehouseID'] = WarehouseID;
            //#endregion

            //#region 修改表体
            //是否开启了禽养户单据管理到栋
            let isManageToHenhouse = await this.service.getConfiguration();

            if(isManageToHenhouse)
            {
                //查当前(养户-批次-鸡场)其它清棚单中的栋舍
                let clearHouseDetailSource = this.service.getDetailSource();
                clearHouseDetailSource.filter([
                    ['NumericalOrder', '<>', this.NumericalOrder || ''],
                    ['YHFarmerID', '=', this.model.conditionPanel.data.YHFarmerID],
                    ['YHBatch', '=', this.model.conditionPanel.data.YHBatch],
                    ['ChickenFarmID', '=', this.model.conditionPanel.data.ChickenFarmID],
                ]);

                let otherClearHouseID = await clearHouseDetailSource.load().then((res: Array<any>) => {
                    return res.map(m => m.HenhouseID);
                });

                //查养户台账表
                let transferSource = this.service.getChickenTransferData(this.model.conditionPanel.data.YHBatch,this.model.conditionPanel.data.YHFarmerID);
                console.log('otherClearHouse', otherClearHouseID);
                //查养户台账中的栋舍，不包括当前(养户-批次-鸡场)其它清棚单的栋舍，然后合并计算相同栋舍记录
                transferSource.filter((m) => {
                    return (
                        m.YHFarmerID == this.model.conditionPanel.data.YHFarmerID &&
                        new DateTime(m.DataDate.toString()) <= new DateTime(this.model.conditionPanel.data.DataDate || new DateTime) &&
                        m.YHBatchID == this.model.conditionPanel.data.YHBatch &&
                        m.ChickenFarmID == this.model.conditionPanel.data.ChickenFarmID &&
                        // m.BIn == true &&
                        m.NumericalOrder != this.NumericalOrder && //修改状态下，排除当前单据已有记录的干扰
                        otherClearHouseID.indexOf(m.HenhouseID) == -1
                    );
                })

                transferSource.group('HenhouseID');

                // var transferData = await transferSource.load();
                // console.log(transferData,'处理后');

                //更换明细表
                this.model.dataGrid.props.dataSource = (await transferSource.load()).map(m => {

                    let CounterQuantity = 0;
                    let ReceiveQuantity = 0;
                    let RegDeathCullQuantity = 0;
                    let RegWeedOutQuantity = 0;
                    let HsQuantity = 0;
                    m.items.forEach(h => {
                        let Quantity = h.Quantity;  //变动数量

                        if(!h.BIn){
                            Quantity = -Quantity;   //变动方向
                        }

                        CounterQuantity += Quantity;
                        switch(h.BillType)
                        {
                            case '2201131629250003055':   //养户领苗
                                ReceiveQuantity += Math.abs(Quantity);
                                break;
                            case '2201131629250004355':   //养户领苗
                                HsQuantity += Math.abs(Quantity);
                                break;
                            case '2201131629250003455':   //死淘记录
                                if(h.AbstractType=='2212201025170000550'){
                                    RegDeathCullQuantity += Math.abs(Quantity);
                                }
                                if(h.AbstractType=='2212201025170000650'){
                                    RegWeedOutQuantity += Math.abs(Quantity);
                                }
                                break
                            default:
                                break;
                        }

                    });

                    return {
                        NumericalOrderDetail: new DateTime().randomValue.toString(),
                        HenhouseID: m.key,
                        UnknownQuantity: CounterQuantity,
                        DeathCullOuter: 0,
                        WeedOuter: 0,
                        CounterQuantity,
                        ReceiveQuantity,
                        RegDeathCullQuantity,
                        RegWeedOutQuantity,
                        Quantity:HsQuantity,
                        target: DataStatus.newline,
                    };
                });

                if((<Array<any>>this.model.dataGrid.props.dataSource).length <= 0)
                {
                    Notify.warning('该养户批次已全部清棚!');
                }
            }
            else
            {
                //查养户台账表
                let transferSource = this.service.getChickenTransferData(this.model.conditionPanel.data.YHBatch,this.model.conditionPanel.data.YHFarmerID);

                //查养户台账中的栋舍，不包括当前(养户-批次-鸡场)其它清棚单的栋舍
                transferSource.filter((m) => {
                    return (
                        m.YHFarmerID == this.model.conditionPanel.data.YHFarmerID &&
                        new DateTime(m.DataDate.toString()) <= new DateTime(this.model.conditionPanel.data.DataDate || new DateTime) &&
                        m.YHBatchID == this.model.conditionPanel.data.YHBatch &&
                        m.ChickenFarmID == this.model.conditionPanel.data.ChickenFarmID &&
                        m.NumericalOrder != this.NumericalOrder
                        // m.BIn == true &&
                        // otherClearHouseID.indexOf(m.HenhouseID) == -1
                    );
                })

                transferSource.group((m) => {
                    return '0';
                });

                //更换明细表
                this.model.dataGrid.props.dataSource = (await transferSource.load()).map(m => {

                    let CounterQuantity = 0;
                    let ReceiveQuantity = 0;
                    let RegDeathCullQuantity = 0;
                    let RegWeedOutQuantity = 0;
                    let HsQuantity = 0;
                    m.items.forEach(h => {
                        let Quantity = h.Quantity;  //变动数量

                        if(!h.BIn){
                            Quantity = -Quantity;   //变动方向
                        }

                        CounterQuantity += Quantity;

                        switch(h.BillType)
                        {
                            case '2201131629250003055':   //养户领苗
                                ReceiveQuantity += Math.abs(Quantity);
                                break;
                                case '2201131629250004355':   //养户领苗
                                HsQuantity += Math.abs(Quantity);
                                break;
                            case '2201131629250003455':   //死淘记录
                                if(h.AbstractType=='2212201025170000550'){
                                    RegDeathCullQuantity += Math.abs(Quantity);
                                }
                                if(h.AbstractType=='2212201025170000650'){
                                    RegWeedOutQuantity += Math.abs(Quantity);
                                }
                                break
                            default:
                                break;
                        }
                    });

                    return {
                        NumericalOrderDetail: new DateTime().randomValue.toString(),
                        HenhouseID: m.key,
                        UnknownQuantity: CounterQuantity,
                        DeathCullOuter: 0,
                        WeedOuter:0,
                        CounterQuantity,
                        ReceiveQuantity,
                        RegDeathCullQuantity,
                        RegWeedOutQuantity,
                        Quantity:HsQuantity,
                        target: DataStatus.newline,
                    };
                });

                if((<Array<any>>this.model.dataGrid.props.dataSource).length <= 0)
                {
                    this.model.dataGrid.props.dataSource = [{
                        NumericalOrderDetail: new DateTime().randomValue.toString(),
                        HenhouseID: '0',
                        UnknownQuantity: 0,
                        DeathCullOuter: 0,
                        WeedOuter: 0,
                        CounterQuantity: 0,
                        ReceiveQuantity: 0,
                        RegDeathCullQuantity: 0,
                        RegWeedOutQuantity: 0,
                        Quantity: 0,
                        target: DataStatus.newline,
                    }];
                }
            }
            //#endregion
            if((<Array<any>>this.model.dataGrid.props.dataSource).length > 0)
            {
                condition_YHBatch.widget.props.readOnly = true;
            }
        }

        //养殖场
        const condition_ChickenFarmID = new NxConditionItem();
        condition_ChickenFarmID.label = this.translator.I18N.YhChickenReceive.ChickenFarmID.text;
        condition_ChickenFarmID.dataField = 'ChickenFarmID';
        condition_ChickenFarmID.type = 'SelectBox';
        // condition_ChickenFarmID.required = true;
        condition_ChickenFarmID.widget = new NxSelectBox();
        condition_ChickenFarmID.widget.props.dataSource = this.basicSettingODataContext.getBizChickenFarmDataSource();
        condition_ChickenFarmID.widget.props.valueExpr = 'ChickenFarmID';
        condition_ChickenFarmID.widget.props.displayExpr = 'ChickenFarmName';
        // condition_ChickenFarmID.widget.props.disabled = true;
        condition_ChickenFarmID.widget.props.readOnly = true;
        condition_ChickenFarmID.widget.props.showClearButton = false;

        //存栏仓库
        const condition_WarehouseID = new NxConditionItem();
        condition_WarehouseID.label = this.translator.I18N.YhChickenReceive.WarehouseID.text;
        condition_WarehouseID.dataField = 'WarehouseID';
        condition_WarehouseID.type = 'SelectBox';
        // condition_WarehouseID.required = true;
        condition_WarehouseID.widget = new NxSelectBox();
        condition_WarehouseID.widget.props.dataSource = this.basicSettingODataContext.getWareHouseDataSource();
        condition_WarehouseID.widget.props.valueExpr = 'WarehouseID';
        condition_WarehouseID.widget.props.displayExpr = 'WarehouseName';
        condition_WarehouseID.widget.props.readOnly = true;
        condition_WarehouseID.widget.props.showClearButton = false;

        //单据号
        const condition_number = new NxConditionItem();
        condition_number.label = this.translator.I18N.ZqImmuneProcess.Number.text;
        condition_number.type = 'Span';
        condition_number.dataField = 'Number';
        condition_number.headVisible = true;

        this.model.conditionPanel.conditionItems.push(
            condition_date,
            condition_YHFarmerName,
            condition_YHBatch,
            condition_ChickenFarmID,
            condition_WarehouseID,
            condition_number,
        );

        return this;
    }
    //#endregion

    //#region 初始化工具条
    init_toolbar_panel(): YHClearHouseCreateComponent {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;
        this.model.toolbar.moreButton.props.disabled = true;
        this.model.toolbar.getOtherWidgetByKey('headSetting').props.visible = true;
        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        return this
    }
    //#endregion

    //#region 初始化数据源
    initialization() {
        //详情进入编辑页面
        if (this.$option == FormOptions.$modify) {
            setTimeout(() => {
                this.queryDetail()
            }, 500);
        } else {
            setTimeout(() => {
                this.create();
            }, 1000);
        }
        // setTimeout(() => {
        //     this.detailInstance.dataGrid.removeRow = this.removeRow.bind(this);
        // }, 1000);
    }

    private dataValidation(data): boolean {
        const validator = new DataValidator();
        validator.forObjRequire(data, [
            // ['HenhouseID', this.translator.I18N.YHClearHouseDetail.HenhouseID.emptyMessage],
            ['CounterQuantity', this.translator.I18N.YHClearHouseDetail.CounterQuantity.emptyMessage],
        ]);
        return validator.validation;
    }
    //#endregion

    isRepeat(arr) {
        var hash = {}
        for (let i = 0; i < arr.length; i++) {
            if (hash[arr[i].ProcessNo]) {
                return true
            }
            hash[arr[i].ProcessNo] = true
        }
        return false
    }

    //数据整合
    private getSaveData(value) {
        // var isType = this.isRepeat(value.body);
        // if (isType) {
        //     Notify.toast(`请检查数据程序号不能重复`, NotifyType.Error);
        //     return null;
        // }
        const validation = this.dataValidation(value.body);
        if (validation) {
            let saveData = new YHClearHouseModel();
            const date = new DateTime(value.header.DataDate.toString()).toString("yyyy-MM-dd");
            saveData.DataDate = date;

            if (value.header.NumericalOrder) {
                saveData.NumericalOrder = value.header.NumericalOrder || '0';
            }

            saveData.ComboPack = value.header.ComboPack || DataDictionary.ComboPackA;
            saveData.Remarks = value.header.Remarks || '';

            saveData.YHFarmerID = value.header.YHFarmerID;
            saveData.YHBatch = value.header.YHBatch;
            saveData.ChickenFarmID = value.header.ChickenFarmID || "0";
            saveData.WarehouseID = value.header.WarehouseID || "0";

            value.body.map((m) => {
                saveData.Details.push({
                    RecordID: "0",
                    NumericalOrder: m.NumericalOrder ? m.NumericalOrder : "0",
                    NumericalOrderDetail: m.NumericalOrderDetail || "0",
                    GUID: m.GUID || new Guid,
                    HenhouseID: m.HenhouseID || "0",
                    CounterQuantity: m.CounterQuantity,
                    UnknownQuantity: m.UnknownQuantity,
                    DeathCullOuter: m.DeathCullOuter || 0,
                    WeedOuter: m.WeedOuter || 0,
                    ReceiveQuantity: m.ReceiveQuantity || 0,
                    RegDeathCullQuantity: m.RegDeathCullQuantity || 0,
                    RegWeedOutQuantity: m.RegWeedOutQuantity || 0,
                    RollOutQuantity: m.RollOutQuantity || 0,
                    RollInQuantity: m.RollInQuantity || 0,
                    TransferSurplus: m.TransferSurplus || 0,
                    TransferLoss: m.TransferLoss || 0,
                    DeadQuantity: m.DeadQuantity || 0,
                    Quantity: m.Quantity || 0,
                    Remarks: m.DetailRemarks || '',
                    Target: m.target,
                });
            });
            if (this.detailInstance.$open == FormOptions.$modify) {
                saveData.Details.push(...value.deleted);
            }
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }
    save() {
        //
        this.detailInstance.saveChanges().then((value) => {
            this.detailInstance.openCheck(
                () => {
                    const data = this.getSaveData(value);
                    if (data)
                    {
                        this.service.post(data).then((result: Result) => {
                            const response = ResponseSuccess.handle(result);
                            if (response.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                this.detailInstance.saveDataAfterStatus();
                                this.NumericalOrder = result.data.NumericalOrder;
                                //开启审核功能
                                this.model.review.visible = true;
                                this.model.review.numericalOrder = this.NumericalOrder;
                                this.model.dataGrid.type = 'detail';
                                this.detailInstance.$open = FormOptions.$modify;
                                this.queryDetail();
                            }
                            else {
                                // Notify.toast(response.message, NotifyType.Error);
                                // this.detailInstance.saveDataError();
                                this.detailInstance.messageBox.show(response.message);
                                this.detailInstance.saveDataError();
                            }
                        });
                    }
                },
                () => {
                    if (this.detailInstance.reviewValidation()) {
                        this.service.put(this.getSaveData(value)).then((result: Result) => {
                            console.log(result,'请求')
                            const res = ResponseSuccess.handle(result);
                            console.log(res)
                            if (res.status) {
                                Notify.toast('更新成功', NotifyType.Success);
                                //重置状态
                                this.detailInstance.$open = FormOptions.$modify;
                                this.queryDetail();
                                // this.detailInstance.saveDataAfterStatus();
                            } else {
                                this.detailInstance.messageBox.show(res.message);
                                this.detailInstance.saveDataError();
                            }
                        });
                    }
                }
            );
        });
    }

    changeDate(value) {
        if (value) {
            var Param = 'DataDate=' + new DateTime(value).toString('yyyy-MM-dd') + '&';
            // Param += 'groupBy=m.HenhouseID,m.BatchID,m.SexType&';
            this.service
                .byKey(<any>Param)
                .then((res: any) => {
                    this.zqHenhouseSource = res.value;
                    this.zqDataSource = deepCopy(res.value);
                });
        }
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

    create() {
        this.model.conditionPanel.data = {};
        // this.detailInstance.cacheSearchData = {};
        var arr = [];
        (<Array<any>>this.model.dataGrid.props.dataSource) = arr;
        this.model.conditionPanel.data['DataDate'] = new Date();
        this.model.conditionPanel.data.NumericalOrder = '';
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data.Remarks = '';
        this.model.conditionPanel.data.YHFarmerID = '';
        this.model.conditionPanel.data.ChickenFarmID = '';
        this.model.conditionPanel.data.WarehouseID = '';
        this.model.conditionPanel.data.YHBatch = '';
        this.model.dataGrid.type = 'detail';
        this.detailInstance.$open = FormOptions.$create;
        this.model.review.visible = false;

        this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);

        // this.getWarehouse();
        this.changeDate((new DateTime()).toString('yyyy-MM-dd'));
        // setTimeout(() => {
        //     this.detailInstance.createDataStatus(undefined,10);
        // }, 20);

    }

    cancel() {
        if (this.$option == FormOptions.$modify) {
            //编辑
            this.queryDetail();
            this.detailInstance.resetDataStatus();
        } else {
            // 新增
            this.create()
        }
    }

    queryDetail() {
        var Param = `$filter=(NumericalOrder eq '${this.NumericalOrder}')`;

        this.model.conditionPanel.conditionItems.map(m => {
            if(m.dataField == "YHBatch")
            {
                m.widget.props.readOnly = true;
            }
        });

        this.service
            .byKey(<any>Param)
            .then((res: any) => {
                if (res) {
                    let result = res.value;

                    if(!this.model.conditionPanel.data.YHBatch) this.model.conditionPanel.data = deepCopy(result[0]);
                    this.model.conditionPanel.data.NumericalOrder = result[0].NumericalOrder;
                    this.model.conditionPanel.data.Number = result[0].Number;
                    this.model.conditionPanel.data.Remarks = result[0].Remarks;
                    (<DataSource>this.BatchSource).filter([
                        ['YHFarmerID', '=', result[0].YHFarmerID]
                    ]);

                    // this.model.conditionPanel.data = result[0];

                    // this.changeDate((result[0].DataDate).toString('yyyy-MM-dd'));
                    // this.qlwOdataContext.personODataStore
                    // .byKey(value.OwnerID)
                    // .then((val) => {
                    //     this.model.review.ownerName = val.PersonName;
                    // });
                    this.model.dataGrid.props.dataSource = result;
                    (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => (m.target = DataStatus.none));

                    this.detailInstance.cacheSearchData = deepCopy(result[0]);
                    this.detailInstance.cacheBodyData = deepCopy(result);
                    //开启审核功能
                    this.model.review.ownerName = result[0].CreatedOwnerName;
                    this.model.review.visible = true;
                    this.model.review.numericalOrder = this.NumericalOrder;
                    this.model.remarks.disabled = false;

                    setTimeout(() => {
                        this.detailInstance.saveDataAfterStatus();
                    }, 20);
                }
            })
            .catch(e => {
                this.model.conditionPanel.conditionItems.map(m => {
                    if(m.dataField == "YHBatch")
                    {
                        m.widget.props.readOnly = false;
                    }
                });
            });

    }

    onFieldDataChanged(e) {
        if (this.compareDataSource && e.dataField && e.dataField != 'Details') {
            if (this.compareDataSource[e.dataField] != e.value) {
                this.$save = false;
            }
        }
    }

    redirectToAddProduct() {
        this.USER_GUIDE.toSetProduct();
    }
    // onGenerationLineChanged(e) {
    //     var doms = document.getElementsByClassName('dx-field-item-required-mark');
    //     var doms1 = document.getElementsByClassName('dx-box-item');
    //     if(DataDictionary.GenerationLineA==e.value){
    //         doms[3]['style'] = '';
    //         doms[4]['style'] = 'display:none';
    //         doms1[5]['className'] = 'dx-item dx-box-item';
    //         // this.MultilineCrossDataSource= this.basicSettingODataContext.getBizMultilinecrossDataSource({
    //         //     select: ['StrainLineID', 'StrainLineName'],
    //         // })
    //     }
    //     else{
    //         doms[3]['style'] = 'display:none';
    //         doms[4]['style'] = '';
    //         this.formData['StrainLineID']= "0";
    //         // this.MultilineCrossDataSource=[];
    //         doms1[5]['className'] = 'dx-state-disabled dx-item dx-box-item';
    //     }

    //     if(DataDictionary.GenerationLineB==e.value){
    //         doms[5]['style'] = '';
    //     }
    //     else{
    //         doms[5]['style'] = 'display:none';
    //     }
    //     if(this.$option == FormOptions.$modify&&this.initFlag){
    //         this.initFlag = false;
    //         return;
    //     }
    //     if(DataDictionary.GenerationLineD==e.value){
    //         this.formData['PostBreedingID'] = "0";
    //     }
    //     else{
    //         this.formData['PostBreedingID'] = this.formData['BreedingID'];
    //     }
    // }

    onBreedingChanged(e) {
        if (this.$option == FormOptions.$modify && this.initFlag2) {
            this.initFlag2 = false;
            return;
        }
        // 当（世代≠商品代）时，默认等于品种
        // if(DataDictionary.GenerationLineD!=this.formData['GenerationLine']){
        this.model.conditionPanel.data['PostBreedingID'] = e.value;
        // }
    }

    //重写删行
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
    }

    //跳转模板
    jump() {
        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=清棚单`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=清棚单`
                );
            }
        );
    }
    //自定义打印
    getSource(e) {
        if (!this.NumericalOrder) {
            Notify.error('未完成单据不支持打印！');
            return
        }
        if (e.status) {
            var tabid1 = [];
            this.detailInstance.dataGrid.dataGrid.instance.getVisibleRows().map((m: any, index) => {
                var obj = {
                    //记录死亡
                    HenhouseName:m.data.HenHouseName,
                    CounterQuantity: m.data.CounterQuantity,
                    UnknownQuantity: m.data.UnknownQuantity,
                    DeathCullOuter:m.data.DeathCullOuter,
                    WeedOuter:m.data.WeedOuter,
                    ReceiveQuantity:m.data.ReceiveQuantity,
                    RegDeathCullQuantity:m.data.RegDeathCullQuantity,
                    RegWeedOutQuantity:m.data.RegWeedOutQuantity,
                    Quantity: m.data.Quantity,
                    DetailRemarks:m.data.DetailRemarks,
                };
                tabid1.push(obj);
            });
            var tabId0 = {
                //日期
                DataDate: new DateTime(this.model.conditionPanel.data['DataDate']).toString(),
                //养户
                YHFarmerName:  this.model.conditionPanel.data['YHFarmerName'] == undefined ? '': this.model.conditionPanel.data['YHFarmerName'],
                //批次
                YHBatchName:  this.model.conditionPanel.data['YHBatchName'] == undefined ? '': this.model.conditionPanel.data['YHBatchName'],
                //养殖场仓库
                OutWarehouseName:this.model.conditionPanel.data['OutWarehouseName'] == undefined ? '': this.model.conditionPanel.data['OutWarehouseName'],
                //养殖场
                ChickenFarmName:this.model.conditionPanel.data['ChickenFarmName'] == undefined ? '': this.model.conditionPanel.data['ChickenFarmName'],
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
