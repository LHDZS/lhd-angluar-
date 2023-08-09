import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NxFormDetail } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail-extend';
import { NxZlwFormDetailComponent } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
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
import { YHOutHouseRecycleModel, YHOutHouseRecycleDetailModel } from '../yhouthouserecycle.model';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { Notify, NotifyType, MessageBox } from 'src/app/providers/notify';
import { YHOutHouseRecycleService } from '../yhouthouserecycle.service';
import DataSource from 'devextreme/data/data_source';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { RegExps } from 'src/app/providers/regexp';
import { PrintPageComponent } from 'nxin-print';
import { TokenAuthService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-yhouthouserecycle-create',
    templateUrl: './yhouthouserecycle-create.component.html',
    styleUrls: ['./yhouthouserecycle-create.component.scss'],
})
export class YHOutHouseRecycleComponent implements OnInit {
    @ViewChild('detailInstance', { static: false })
    detailInstance: NxZlwFormDetailComponent;
    model: NxFormDetail = new NxFormDetail();
    numericalOrder: string;

    $option: FormOptions = FormOptions.$modify;

    $save: boolean = true;
    $deleted: boolean = false;
    loading: boolean = false;
    BatchSource: DataSource = new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
        filter: [
            // ['YHFarmerID', '=', ''],
            ["Status", "=", true],
            ["DataDate", "<=", new DateTime()]
        ],
        // paginate: false,
    }));

    HenhouseSource: DataSource;

    NumericalOrder: string;

    isManageToHenhouse: any;

    AbstractTransfer = {
        "2212201025170000150": "2212201025170000750",
        "2212201025170000250": "2212201025170000850",
        "2212201025170000350": "2212201025170000950"
    };
    
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
        private service: YHOutHouseRecycleService,
        private basicSettingODataContext: BasicSettingODataContext,
        private StatusODataContext: StatusODataContext,
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

        this.init_data_grid().init_table_header().init_toolbar_panel();

        this.model.initialization = this.initialization.bind(this);

        this.HenhouseSource = this.service.getTransferData();
    }

    async ngOnInit() {
        this.isManageToHenhouse = await this.service.getConfiguration();

        var col_Henhouse = this.model.dataGrid.columns.find(m => m.props.dataField == "HenhouseID")

        col_Henhouse.props.allowEditing = this.isManageToHenhouse;
        col_Henhouse.props.HeaderRequiredIcon = this.isManageToHenhouse;
        col_Henhouse.props.required = this.isManageToHenhouse;
    }

    ngAfterViewInit(){
        var dfRemoveRow = this.detailInstance.dataGrid.removeRow.bind(this.detailInstance.dataGrid);
        this.detailInstance.dataGrid.removeRow = () => {
            MessageBox.confirm(
                this.translator.I18N.commandOptions.delete.confirm,
                this.translator.I18N.commandOptions.delete.confirmTitle
            ).then((require) => {
                if (require) {
                    dfRemoveRow();
                }
            });
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
    init_data_grid(): YHOutHouseRecycleComponent {
        this.model.dataGrid.stateStoring.storageKey = 'yhClearHouse-create';
        this.model.dataGrid.stateStoring.enabled = true;
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.columns.push(...this.columns);
        this.model.dataGrid.events.onCellClick = this.handleCell.bind(this);
        this.model.dataGrid.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.props.columnAutoWidth = true;
        this.model.dataGrid.commandAddRow.visible = true;
        this.model.dataGrid.events.onCellPrepared = (e) => {
        }
        this.model.dataGrid.summary.enabled = true;
        const summaryItem_total_CageQuantity = new NxDataGridSummaryTotal();
        summaryItem_total_CageQuantity.column = 'CageQuantity';
        summaryItem_total_CageQuantity.summaryType = 'sum';
        summaryItem_total_CageQuantity.valueFormat = '0';
        const summaryItem_total_ElementQuantity = new NxDataGridSummaryTotal();
        summaryItem_total_ElementQuantity.column = 'ElementQuantity';
        summaryItem_total_ElementQuantity.summaryType = 'sum';
        summaryItem_total_ElementQuantity.valueFormat = '0';
        const summaryItem_total_GrossWeight = new NxDataGridSummaryTotal();
        summaryItem_total_GrossWeight.column = 'GrossWeight';
        summaryItem_total_GrossWeight.summaryType = 'sum';
        summaryItem_total_GrossWeight.valueFormat = '4';
        const summaryItem_total_BareWeight = new NxDataGridSummaryTotal();
        summaryItem_total_BareWeight.column = 'BareWeight';
        summaryItem_total_BareWeight.summaryType = 'sum';
        summaryItem_total_BareWeight.valueFormat = '4';
        const summaryItem_total_VehicleWeight = new NxDataGridSummaryTotal();
        summaryItem_total_VehicleWeight.column = 'VehicleWeight';
        summaryItem_total_VehicleWeight.summaryType = 'sum';
        summaryItem_total_VehicleWeight.valueFormat = '4';
        const summaryItem_total_NetWeight = new NxDataGridSummaryTotal();
        summaryItem_total_NetWeight.column = 'NetWeight';
        summaryItem_total_NetWeight.summaryType = 'sum';
        summaryItem_total_NetWeight.valueFormat = '4';
        const summaryItem_total_Quantity = new NxDataGridSummaryTotal();
        summaryItem_total_Quantity.column = 'Quantity';
        summaryItem_total_Quantity.summaryType = 'sum';
        summaryItem_total_Quantity.valueFormat = '0';
        const summaryItem_total_Amount = new NxDataGridSummaryTotal();
        summaryItem_total_Amount.column = 'Amount';
        summaryItem_total_Amount.summaryType = 'sum';
        summaryItem_total_Amount.valueFormat = '2';
        this.model.dataGrid.summary.totalItems = [
            summaryItem_total_CageQuantity,
            summaryItem_total_ElementQuantity,
            summaryItem_total_GrossWeight,
            summaryItem_total_BareWeight,
            summaryItem_total_VehicleWeight,
            summaryItem_total_NetWeight,
            summaryItem_total_Quantity,
            summaryItem_total_Amount
        ];
        this.model.dataGrid.paginate.pager.visible = 'auto';
        this.model.dataGrid.props.columnAutoWidth = true;
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
    }

    get columns() {

        //入库商品代号
        const col_ProductID = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.ProductID.text, "ProductID", "string", "cProductName");
        col_ProductID.props.allowEditing = true;
        col_ProductID.props.HeaderRequiredIcon = true;
        col_ProductID.props.width = 120;
        col_ProductID.props.fixed = true;
        col_ProductID.props.fixedPosition = "left";
        col_ProductID.props.cellTemplate.enabled = true;
        col_ProductID.props.cellTemplate.type = "SelectBox";
        col_ProductID.props.cellTemplate.templateName = "aName"; //设置任意名称，但必须有值
        col_ProductID.props.cellTemplate.widget = new NxSelectBox();
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.dataSource = this.basicSettingODataContext.getProductDataSource({
            filter: [
                ['PoultryStatus', '=', true]
            ]
        });
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.valueExpr = "ProductID";
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.displayExpr = "ProductName";
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchExpr = ['ProductID','ProductName', 'MnemonicCode'];
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchEnabled = true;

        col_ProductID.props.setCellValue = async (newData, value, oldData) => {

            let Product = await new DataSource(this.basicSettingODataContext.getProductDataSource({
                filter: ["ProductID", "=", value]
            })).load().then(res => {
                if(res.length > 0) return res[0];
                return false;
            })

            if(!Product) return;

            (<Array<any>>this.model.dataGrid.props.dataSource).map(async m => {
                if(m.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    m.ProductID = Product.ProductID;
                    m.cProductName = Product.ProductName;
                    m.SexType = Product.SexType;
                    m.PoultrySalesRank = Product.PoultrySalesRank;
                    m.DetailBreedingID = Product.BreedingID;
                    m.MeasureUnit = Product.MeasureUnitName;
                    let UrlParam = 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd')+ '&';
                    UrlParam += 'ProductID=' + value + '&BreedingID='+Product.BreedingID;
                    this.loading = true;
                    await this.service.getGetRqUnitPrice(UrlParam).then( (res:any) => {
                        this.loading = false;
                        if(res&&res.length>0){
                            m['UnitPrice'] = res[0].UnitPrice;
                            m['ProposalUnit'] = res[0].UnitPrice;
                        }
                    });
                }
                this.detailInstance.dataGrid.refresh();
            })
        }

        //公母
        const col_SexType = new NxDataGridColumn("公母", "SexType", "string");
        col_SexType.props.alignment = "center";
        col_SexType.props.allowEditing = false;
        col_SexType.props.lookup.enabled = true;
        col_SexType.props.lookup.dataSource = DataDictionarySource.SexTypeSource;
        col_SexType.props.lookup.valueExpr = 'SexType';
        col_SexType.props.lookup.displayExpr = 'SexTypeName';
        col_SexType.props.fixed = true;
        col_SexType.props.fixedPosition = "left";

        //肉禽等级
        const col_PoultrySalesRank = new NxDataGridColumn("等级", "PoultrySalesRank", "string");
        col_PoultrySalesRank.props.alignment = "center";
        col_PoultrySalesRank.props.allowEditing = false;
        col_PoultrySalesRank.props.lookup.enabled = true;
        col_PoultrySalesRank.props.lookup.dataSource = DataDictionarySource.PoultrySalesRankSource;
        col_PoultrySalesRank.props.lookup.valueExpr = 'value';
        col_PoultrySalesRank.props.lookup.displayExpr = 'name';
        col_PoultrySalesRank.props.fixed = true;
        col_PoultrySalesRank.props.fixedPosition = "left";

        //入库品种
        const col_BreedingID = new NxDataGridColumn("入库品种", "DetailBreedingID", "string");
        col_BreedingID.props.alignment = "center";
        col_BreedingID.props.allowEditing = false;
        col_BreedingID.props.lookup.enabled = true;
        col_BreedingID.props.lookup.dataSource = this.basicSettingODataContext.getZqBreedingsetDataSource();
        col_BreedingID.props.lookup.valueExpr = 'BreedingID';
        col_BreedingID.props.lookup.displayExpr = 'BreedingName';
        col_BreedingID.props.fixed = true;
        col_BreedingID.props.fixedPosition = "left";

        //笼数
        const col_CageQuantity = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.CageQuantity.text, "CageQuantity", "number");
        col_CageQuantity.props.alignment = "right";
        const col_CageQuantity_vali = new NxDataGridColumnValidationRule();
        col_CageQuantity_vali.type = "pattern";
        col_CageQuantity_vali.pattern = RegExps.PositiveInteger1;
        col_CageQuantity_vali.message = "请输入正整数";
        col_CageQuantity.validationRules.push(col_CageQuantity_vali);

        //只数
        const col_ElementQuantity = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.ElementQuantity.text, "ElementQuantity", "number");
        col_ElementQuantity.props.alignment = "right";
        col_ElementQuantity.props.HeaderRequiredIcon = true;
        const col_ElementQuantity_vali = new NxDataGridColumnValidationRule();
        col_ElementQuantity_vali.type = "pattern";
        col_ElementQuantity_vali.pattern = RegExps.PositiveInteger1;
        col_ElementQuantity_vali.message = "请输入正整数";
        col_ElementQuantity.validationRules.push(col_ElementQuantity_vali);
        col_ElementQuantity.props.setCellValue = (newData, value, oldData) => {

            (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                if(m.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    m.ElementQuantity = value;
                    if(!value || value == "0"){
                        m.AverageWeight = 0;
                    }else{
                        var NetWeight = 0;
                        if(m.NetWeight){
                            NetWeight = Number(m.NetWeight);
                        }
                        m.AverageWeight = (NetWeight/Number(value)).toFixed(4);;
                    }
                }
                this.detailInstance.dataGrid.refresh();
            })
        }

        //毛重
        const col_GrossWeight = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.GrossWeight.text, "GrossWeight", "number");
        col_GrossWeight.props.alignment = "right";
        const col_GrossWeight_vali = new NxDataGridColumnValidationRule();
        col_GrossWeight_vali.type = "pattern";
        col_GrossWeight_vali.pattern = RegExps.PositiveNumberFix4;
        col_GrossWeight_vali.message = "请输入四位以内大于零的小数";
        col_GrossWeight.validationRules.push(col_GrossWeight_vali);
        col_GrossWeight.props.setCellValue = (newData, value, oldData) => {

            (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                if(m.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    m.GrossWeight = value;
                    m.NetWeight = (m.GrossWeight - (m.BareWeight ? m.BareWeight : 0) - (m.VehicleWeight ? m.VehicleWeight : 0)).toFixed(4);
                    var ElementQuantity = 0;
                    if(m.ElementQuantity){
                        ElementQuantity = Number(m.ElementQuantity);
                    }
                    if(ElementQuantity == 0){
                        m.AverageWeight = 0;
                    }else{
                        var NetWeight = 0;
                        if(m.NetWeight){
                            NetWeight = Number(m.NetWeight);
                        }
                        m.AverageWeight = (NetWeight/Number(ElementQuantity)).toFixed(4);;
                    }
                    m.Quantity = m.NetWeight;
                    m.Amount = ((m.UnitPrice ? m.UnitPrice : 0) * m.Quantity).toFixed(2);
                    m.Amount = m.Amount.toFixed(2);
                }
                this.detailInstance.dataGrid.refresh();
            })
        }
        col_GrossWeight.props.width = 120;

        //皮重
        const col_BareWeight = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.BareWeight.text, "BareWeight", "number");
        col_BareWeight.props.alignment = "right";
        const col_BareWeight_vali = new NxDataGridColumnValidationRule();
        col_BareWeight_vali.type = "pattern";
        col_BareWeight_vali.pattern = RegExps.PositiveNumberFix4;
        col_BareWeight_vali.message = "请输入四位以内大于零的小数";
        col_BareWeight.validationRules.push(col_BareWeight_vali);
        col_BareWeight.props.setCellValue = (newData, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                if(m.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    m.BareWeight = value;
                    m.NetWeight = ((m.GrossWeight ? m.GrossWeight : 0) - (m.BareWeight ? m.BareWeight : 0) - (m.VehicleWeight ? m.VehicleWeight : 0)).toFixed(4);
                    var ElementQuantity = 0;
                    if(m.ElementQuantity){
                        ElementQuantity = Number(m.ElementQuantity);
                    }
                    if(ElementQuantity == 0){
                        m.AverageWeight = 0;
                    }else{
                        var NetWeight = 0;
                        if(m.NetWeight){
                            NetWeight = Number(m.NetWeight);
                        }
                        m.AverageWeight = (NetWeight/Number(ElementQuantity)).toFixed(4);;
                    }
                    m.Quantity = m.NetWeight;
                    m.Amount = ((m.UnitPrice ? m.UnitPrice : 0) * m.Quantity).toFixed(2);
                    m.Amount = m.Amount.toFixed(2);
                }

                this.detailInstance.dataGrid.refresh();
            })
        }
        col_BareWeight.props.width = 120;

        //车重
        const col_VehicleWeight = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.VehicleWeight.text, "VehicleWeight", "number");
        col_VehicleWeight.props.alignment = "right";
        const col_VehicleWeight_vali = new NxDataGridColumnValidationRule();
        col_VehicleWeight_vali.type = "pattern";
        col_VehicleWeight_vali.pattern = RegExps.PositiveNumberFix4;
        col_VehicleWeight_vali.message = "请输入四位以内大于零的小数";
        col_VehicleWeight.validationRules.push(col_VehicleWeight_vali);
        col_VehicleWeight.props.setCellValue = (newData, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                if(m.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    m.VehicleWeight = value;
                    m.NetWeight = ((m.GrossWeight ? m.GrossWeight : 0) - (m.BareWeight ? m.BareWeight : 0) - (m.VehicleWeight ? m.VehicleWeight : 0)).toFixed(4);
                    var ElementQuantity = 0;
                    if(m.ElementQuantity){
                        ElementQuantity = Number(m.ElementQuantity);
                    }
                    if(ElementQuantity == 0){
                        m.AverageWeight = 0;
                    }else{
                        var NetWeight = 0;
                        if(m.NetWeight){
                            NetWeight = Number(m.NetWeight);
                        }
                        m.AverageWeight = (NetWeight/Number(ElementQuantity)).toFixed(4);;
                    }
                    m.Quantity = m.NetWeight;
                    m.Amount = ((m.UnitPrice ? m.UnitPrice : 0) * m.Quantity).toFixed(2);
                    m.Amount = m.Amount.toFixed(2);
                }
                this.detailInstance.dataGrid.refresh();

            })
        }
        col_VehicleWeight.props.width = 120;


        //净重
        const col_NetWeight = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.NetWeight.text, "NetWeight", "number");
        col_NetWeight.props.alignment = "right";
        col_NetWeight.props.allowEditing = false;
        const col_NetWeight_vali = new NxDataGridColumnValidationRule();
        col_NetWeight_vali.type = "pattern";
        col_NetWeight_vali.pattern = RegExps.PositiveNumberFix4;
        col_NetWeight_vali.message = "请输入四位以内大于零的小数";
        col_NetWeight.validationRules.push(col_NetWeight_vali);
        col_NetWeight.props.width = 120;

        //数量
        const col_Quantity = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.Quantity.text, "Quantity", "number");
        col_Quantity.props.alignment = "right";
        col_Quantity.props.allowEditing = false;
        const col_Quantity_vali = new NxDataGridColumnValidationRule();
        col_Quantity_vali.type = "pattern";
        col_Quantity_vali.pattern = RegExps.PositiveNumberFix4;
        col_Quantity_vali.message = "请输入四位以内大于零的小数";
        col_Quantity.validationRules.push(col_Quantity_vali);
        // col_Quantity.props.setCellValue = (newData, value, oldData) => {
        //     this.detailInstance.dataGrid.refresh();
        //     (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
        //         if(m.NumericalOrderDetail == oldData.NumericalOrderDetail)
        //         {
        //             m.Quantity = value;
        //             m.Amount = (m.UnitPrice ? m.UnitPrice : 0) * m.Quantity;
        //         }

        //     })
        // }

        //计量单位
        const col_MeasureUnit = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.MeasureUnit.text, "MeasureUnit", "string");
        col_MeasureUnit.props.alignment = "center";
        col_MeasureUnit.props.allowEditing = false;
        col_MeasureUnit.props.width = 100;

        const col_AverageWeight = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.AverageWeight.text, "AverageWeight", "number");
        col_AverageWeight.props.alignment = "right";
        col_AverageWeight.props.allowEditing = false;
        col_AverageWeight.props.width = 110;

        //方案单价
        const col_ProposalUnit = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.ProposalUnit.text, "ProposalUnit", "number");
        col_ProposalUnit.props.alignment = "right";
        col_ProposalUnit.props.allowEditing = false;
        const col_ProposalUnit_vali = new NxDataGridColumnValidationRule();
        col_ProposalUnit_vali.type = "pattern";
        col_ProposalUnit_vali.pattern = RegExps.PositiveNumberFix4;
        col_ProposalUnit_vali.message = "请输入四位以内大于零的小数";
        col_ProposalUnit.validationRules.push(col_ProposalUnit_vali);
        col_ProposalUnit.props.width = 100;

        //单价
        const col_UnitPrice = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.UnitPrice.text, "UnitPrice", "number");
        col_UnitPrice.props.alignment = "right";
        const col_UnitPrice_vali = new NxDataGridColumnValidationRule();
        col_UnitPrice_vali.type = "pattern";
        col_UnitPrice_vali.pattern = RegExps.PositiveNumberFix4;
        col_UnitPrice_vali.message = "请输入四位以内大于零的小数";
        col_UnitPrice.validationRules.push(col_UnitPrice_vali);
        col_UnitPrice.props.setCellValue = (newData, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                if(m.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    m.UnitPrice = value.toFixed(4);
                    m.Amount = m.UnitPrice * (m.Quantity ? m.Quantity : 0);
                    m.Amount = m.Amount.toFixed(2);
                }
                this.detailInstance.dataGrid.refresh();

            })
        }

        //金额
        const col_Amount = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.Amount.text, "Amount", "number");
        col_Amount.props.alignment = "right";
        const col_Amount_vali = new NxDataGridColumnValidationRule();
        col_Amount_vali.type = "pattern";
        col_Amount_vali.pattern = RegExps.PositiveNumberFix2;
        col_Amount_vali.message = "请输入两位以内大于零的小数";
        col_Amount.validationRules.push(col_Amount_vali);
        col_Amount.props.setCellValue = (newData, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                if(m.NumericalOrderDetail == oldData.NumericalOrderDetail)
                {
                    m.Amount = value;
                    if(m.Quantity) m.UnitPrice = (m.Amount / m.Quantity).toFixed(4);
                }
                this.detailInstance.dataGrid.refresh();

            })
        }

        //栋舍ID
        const col_HenhouseID = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.HenhouseID.text, "HenhouseID", "string");
        col_HenhouseID.props.alignment = "left";
        col_HenhouseID.props.lookup.enabled = true;
        col_HenhouseID.props.lookup.valueExpr = 'HenhouseID';
        col_HenhouseID.props.lookup.displayExpr = 'HenhouseName';
        col_HenhouseID.props.width = 120;

        //税率
        const col_TaxRate = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.TaxRate.text, "TaxRate", "number");
        col_TaxRate.props.alignment = "right";
        const col_TaxRate_vali = new NxDataGridColumnValidationRule();
        col_TaxRate_vali.type = "pattern";
        col_TaxRate_vali.pattern = RegExps.PositiveNumberFix2;
        col_TaxRate_vali.message = "请输入两位以内大于零的数";
        col_TaxRate.validationRules.push(col_TaxRate_vali);


        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.YHOutHouseRecycleDetail.Remarks.text, "DetailRemarks", "string");

        return [
            col_ProductID,
            col_SexType,
            col_PoultrySalesRank,
            col_BreedingID,
            col_CageQuantity,
            col_ElementQuantity,
            col_GrossWeight,
            col_BareWeight,
            col_VehicleWeight,
            col_NetWeight,
            col_Quantity,
            col_MeasureUnit,
            col_AverageWeight,
            col_ProposalUnit,
            col_UnitPrice,
            col_Amount,
            col_HenhouseID,
            col_TaxRate,
            col_Remarks,
        ]
    }
    //#endregion

    //#region  表头配置
    init_table_header(): YHOutHouseRecycleComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        //建档日期
        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.headVisible = true;
        condition_date.requiredDisable = true;
        condition_date.label = this.translator.I18N.YHOutHouseRecycle.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        condition_date.widget.events.onValueChanged = (value, preValue) => {
            if(this.model.conditionPanel.data.BatchDaysOld)
            {
                //计算日龄
                var YHBatchDate = new DateTime(this.model.conditionPanel.data.BatchDaysOldDate.toString());
                var OutHouseRecycleDate = new DateTime(value.toString());
                this.model.conditionPanel.data.DaysOld = this.model.conditionPanel.data.BatchDaysOld + new DateTime().diff(OutHouseRecycleDate.dateTime, YHBatchDate.dateTime)
            }
        }
        // condition_date.widget.props.max = new Date();

        //存栏仓库
        const condition_WarehouseID = new NxConditionItem();
        condition_WarehouseID.label = this.translator.I18N.YHOutHouseRecycle.InWarehouse.text;
        condition_WarehouseID.dataField = 'InWarehouse';
        condition_WarehouseID.type = 'SelectBox';
        condition_WarehouseID.required = true;
        condition_WarehouseID.widget = new NxSelectBox();
        condition_WarehouseID.widget.props.dataSource = this.basicSettingODataContext.getWareHouseDataSource();
        condition_WarehouseID.widget.props.valueExpr = 'WarehouseID';
        condition_WarehouseID.widget.props.displayExpr = 'WarehouseName';
        // condition_WarehouseID.widget.props.readOnly = true;
        condition_WarehouseID.widget.props.showClearButton = false;

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
        condition_YHFarmerName.widget.props.searchExpr = ["YHFarmerName", "MnemonicCode", "Phone", "YHPersonName"];
        condition_YHFarmerName.widget.events.onValueChanged = (value, preValue) => {
            if (value) {
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly  = false;
                this.BatchSource.filter([
                    ['YHFarmerID', '=', value],
                    ["Status", '=', true],
                    ['TransferDate', '<=', new DateTime(this.model.conditionPanel.data.DataDate || new DateTime().toString())]
                ]);
                this.BatchSource.load().then((res: Array<any>) => {
                    if(!res.find(m => m.YHBatchID == this.model.conditionPanel.data["YHBatch"])){
                        this.model.conditionPanel.data["YHBatch"] = null;
                    }
                    if(res.length == 1)
                    {
                        this.model.conditionPanel.data["YHBatch"] = res[0].YHBatchID;
                    }
                })
                .catch(() => {
                    this.model.conditionPanel.data["YHBatch"] = null;
                });
            }
            else{
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly  = true;
                this.model.conditionPanel.data["YHBatch"] = null;
                this.BatchSource.filter([
                    // ['YHFarmerID', '=', value],
                    ["Status", '=', true],
                    ['DataDate', '<=', new DateTime(this.model.conditionPanel.data.DataDate || new DateTime().toString())]
                ]);
                this.BatchSource.load();
            }
        }

        //养户批次
        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YHOutHouseRecycle.YHBatch.text;
        condition_YHBatch.required = true;
        condition_YHBatch.requiredDisable = true;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.widget = new NxSelectBox();
        condition_YHBatch.widget.props.dataSource = this.BatchSource;
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';
        condition_YHBatch.widget.props.readOnly = true;
        condition_YHBatch.widget.props.placeholder = '请先选养户';
        condition_YHBatch.widget.events.onValueChanged = async (value, preValue) =>  {
            var col_Henhouse = this.model.dataGrid.columns.find(m => m.props.dataField == "HenhouseID");
            if (value) {
                new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
                    filter: ["YHBatchID", '=', value]
                })).load().then(res => {
                    if(res.length > 0){
                        this.model.conditionPanel.data.YHFarmerID = res[0].YHFarmerID;
                        this.model.conditionPanel.data.BreedingID = res[0].BreedingID;

                        //计算日龄
                        this.model.conditionPanel.data.BatchDaysOld = res[0].DaysOld != -1 ? res[0].DaysOld : null;
                        var YHBatchDate = this.model.conditionPanel.data.BatchDaysOldDate = new DateTime(res[0].DaysOldDate ? res[0].DaysOldDate.toString() : new DateTime().toString());
                        var OutHouseRecycleDate = new DateTime(this.model.conditionPanel.data.DataDate || new DateTime().toString());
                        this.model.conditionPanel.data.BatchDaysOld
                        this.model.conditionPanel.data.DaysOld =  this.model.conditionPanel.data.BatchDaysOld ?
                            this.model.conditionPanel.data.BatchDaysOld + new DateTime().diff(OutHouseRecycleDate.dateTime, YHBatchDate.dateTime)
                            : null;

                        this.model.conditionPanel.data.ChickenType = res[0].ChickenType;
                        this.model.conditionPanel.data.BatchProductID = res[0].ProductID;
                        this.model.conditionPanel.data.Abstract = this.AbstractTransfer[res[0].ChickAbstract];
                        this.model.conditionPanel.data.ChickenFarmID = res[0].ChickenFarmID;
                        this.model.conditionPanel.data.OutWarehouse = "0";
                        // this.model.conditionPanel.data.QuoteNumericalOrderDetail = "2201131629250004055";

                        return res[0];
                    }
                }).then(yhBatch => {
                    if(this.model.conditionPanel.data.Abstract == "2212201025170000750"){ //调拨回收
                        new DataSource(this.yhBasicSettingODataContext.getYHChickenFarmRelateDataSource({
                            filter: ['ChickenFarmID', '=', yhBatch.ChickenFarmID]
                        })).load().then(res => {
                            if(res.length > 0)
                            {
                                this.model.conditionPanel.data.OutWarehouse = res[0].WarehouseID;
                            }
                        })
                    }
                })

                this.setHenhouseSourceByYHBatch(this.model.conditionPanel.data.DataDate, value);
            }
            else{
                // this.model.conditionPanel.data.YHFarmerID = null;
                this.model.conditionPanel.data.BreedingID = null;
                this.model.conditionPanel.data.DaysOld = null;
                this.model.conditionPanel.data.ChickenType = null;
                this.model.conditionPanel.data.BatchProductID = null;
                this.model.conditionPanel.data.Abstract = null;
                this.model.conditionPanel.data.ChickenFarmID = null;
                this.model.conditionPanel.data.OutWarehouse = null;
                // this.model.conditionPanel.data.QuoteNumericalOrderDetail = null;
                this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
                (<Array<any>>this.model.dataGrid.props.dataSource).map(m => {
                    m.HenhouseID = null;
                })
                this.detailInstance.dataGrid.refresh();
                col_Henhouse.props.lookup.dataSource = [];
            }
        }

        //批次品种
        const condition_BreedingID = new NxConditionItem();
        condition_BreedingID.label = "批次品种";
        condition_BreedingID.dataField = 'BreedingID';
        condition_BreedingID.type = 'SelectBox';
        // condition_BreedingID.required = true;
        condition_BreedingID.widget = new NxSelectBox();
        condition_BreedingID.widget.props.dataSource = this.basicSettingODataContext.getZqBreedingsetDataSource();
        condition_BreedingID.widget.props.valueExpr = 'BreedingID';
        condition_BreedingID.widget.props.displayExpr = 'BreedingName';
        condition_BreedingID.widget.props.showClearButton = false;
        condition_BreedingID.widget.props.readOnly = true;

        //日龄
        const condition_DaysOld = new NxConditionItem();
        condition_DaysOld.label = "日龄";
        condition_DaysOld.dataField = 'DaysOld';
        condition_DaysOld.type = 'NumberBox';
        condition_DaysOld.widget = new NxNumberBox();
        condition_DaysOld.widget.props.readOnly = true;

        //鸡类型
        const condition_ChickType = new NxConditionItem();
        condition_ChickType.label = "家禽类型";
        condition_ChickType.dataField = "ChickenType";
        condition_ChickType.type = "SelectBox";
        condition_ChickType.widget = new NxSelectBox();
        condition_ChickType.widget.props.dataSource = this.basicSettingODataContext.getBizRemindGroupDataSource({
            filter: [
                [
                    'PID', '=', DataDictionary.ChickenType
                ],
                [
                    'Status', '=', true
                ]
            ],
            select: ['RemindID', 'RemindName'],
        });
        condition_ChickType.widget.props.valueExpr = "RemindID";
        condition_ChickType.widget.props.displayExpr = "RemindName";
        condition_ChickType.widget.props.readOnly = true;

        //批次商品代号
        const condition_Product = new NxConditionItem();
        condition_Product.label = "批次商品代号";
        condition_Product.dataField = "BatchProductID";
        condition_Product.type = "SelectBox";
        condition_Product.widget = new NxSelectBox();
        condition_Product.widget.props.dataSource = this.basicSettingODataContext.getProductDataSource();
        condition_Product.widget.props.valueExpr = "ProductID";
        condition_Product.widget.props.displayExpr = "ProductName";
        condition_Product.widget.props.readOnly = true;

        //摘要
        const condition_Abstract = new NxConditionItem();
        condition_Abstract.label = "摘要";
        condition_Abstract.dataField = "Abstract";
        condition_Abstract.type = "SelectBox";
        condition_Abstract.widget = new NxSelectBox();
        condition_Abstract.widget.props.dataSource = [
            //成本价调拨
            {MaterialSupplyPolicy: '2212201025170000750', MaterialSupplyPolicyName: '调拨回收'},
            //约定价领用
            {MaterialSupplyPolicy: '2212201025170000850', MaterialSupplyPolicyName: '领用回收'},
            //销售
            {MaterialSupplyPolicy: '2212201025170000950', MaterialSupplyPolicyName: '采购'},
        ];
        condition_Abstract.widget.props.valueExpr = "MaterialSupplyPolicy";
        condition_Abstract.widget.props.displayExpr = "MaterialSupplyPolicyName";
        condition_Abstract.widget.props.readOnly = true;

        //养殖场
        const condition_ChickenFarmID = new NxConditionItem();
        condition_ChickenFarmID.label = this.translator.I18N.YHOutHouseRecycle.ChickenFarmID.text;
        condition_ChickenFarmID.dataField = 'ChickenFarmID';
        condition_ChickenFarmID.type = 'SelectBox';
        // condition_ChickenFarmID.required = true;
        condition_ChickenFarmID.widget = new NxSelectBox();
        condition_ChickenFarmID.widget.props.dataSource = this.basicSettingODataContext.getBizChickenFarmDataSource();
        condition_ChickenFarmID.widget.props.valueExpr = 'ChickenFarmID';
        condition_ChickenFarmID.widget.props.displayExpr = 'ChickenFarmName';
        condition_ChickenFarmID.widget.props.showClearButton = false;
        condition_ChickenFarmID.widget.props.readOnly = true;

        //养殖场仓库
        const condition_OutWarehouse = new NxConditionItem();
        condition_OutWarehouse.label = this.translator.I18N.YHOutHouseRecycle.OutWarehouse.text;
        condition_OutWarehouse.dataField = 'OutWarehouse';
        condition_OutWarehouse.type = 'SelectBox';
        // condition_OutWarehouse.required = true;
        condition_OutWarehouse.widget = new NxSelectBox();
        condition_OutWarehouse.widget.props.dataSource = this.basicSettingODataContext.getWareHouseDataSource();
        condition_OutWarehouse.widget.props.valueExpr = 'WarehouseID';
        condition_OutWarehouse.widget.props.displayExpr = 'WarehouseName';
        condition_OutWarehouse.widget.props.showClearButton = false;
        condition_OutWarehouse.widget.props.readOnly = true;

        //单据号
        const condition_number = new NxConditionItem();
        condition_number.label = this.translator.I18N.YHOutHouseRecycle.Number.text;
        condition_number.type = 'Span';
        condition_number.dataField = 'Number';
        condition_number.headVisible = true;
        // condition_number.widget.props.readOnly = true;

        //来源单据
        const condition_QuoteBillType = new NxConditionItem();
        condition_QuoteBillType.label = this.translator.I18N.YHOutHouseRecycle.QuoteNumericalOrderDetail.text;
        condition_QuoteBillType.dataField = 'QuoteBillType';
        condition_QuoteBillType.type = 'SelectBox';
        // condition_QuoteNumericalOrderDetail.required = true;
        condition_QuoteBillType.widget = new NxSelectBox();
        condition_QuoteBillType.widget.props.dataSource = DataDictionarySource.OutHouseRecycleQuote;
        condition_QuoteBillType.widget.props.valueExpr = 'value';
        condition_QuoteBillType.widget.props.displayExpr = 'name';
        condition_QuoteBillType.widget.props.showClearButton = false;
        condition_QuoteBillType.widget.props.readOnly = true;

        //来源单号
        const condition_QuoteNumber = new NxConditionItem();
        condition_QuoteNumber.label = this.translator.I18N.YHOutHouseRecycle.QuoteNumber.text;
        condition_QuoteNumber.type = 'Span';
        condition_QuoteNumber.dataField = 'QuoteNumber';
        condition_QuoteNumber.headVisible = true;

        //是否期初
        const condition_isbegin = new NxConditionItem();
        condition_isbegin.label =  this.translator.I18N.YhChickenReceive.isbegin.text;
        condition_isbegin.required = false;
        condition_isbegin.type = 'SelectBox';
        condition_isbegin.dataField = 'isbegin';
        condition_isbegin.requiredDisable = false;
        condition_isbegin.widget = new NxSelectBox();
        condition_isbegin.widget.props.showClearButton = false;
        condition_isbegin.widget.props.dataSource = this.StatusODataContext.getEggsIsShiftTrayDataSource();
        condition_isbegin.widget.props.valueExpr = 'value';
        condition_isbegin.widget.props.displayExpr = 'name';

        // condition_QuoteNumber.widget.props.readOnly = true;

        this.model.conditionPanel.conditionItems.push(
            condition_date,
            condition_WarehouseID,
            condition_YHFarmerName,
            condition_YHBatch,
            condition_BreedingID,
            condition_DaysOld,
            condition_ChickType,
            condition_Product,
            condition_Abstract,
            condition_ChickenFarmID,
            condition_OutWarehouse,
            condition_isbegin,
            condition_number,
            condition_QuoteBillType,
            condition_QuoteNumber
        );

        return this;
    }

    async setHenhouseSourceByYHBatch(DataDate, YHBatchID){
        var col_Henhouse = this.model.dataGrid.columns.find(m => m.props.dataField == "HenhouseID");
        var rows = <Array<any>>this.model.dataGrid.props.dataSource;

        if(!this.isManageToHenhouse){
            col_Henhouse.props.lookup.dataSource = [
                {"HenhouseID": "0", "HenhouseName": "/"},
                {"HenhouseID": null, "HenhouseName": "/"},
                {"HenhouseID": "", "HenhouseName": "/"},
                {"HenhouseID": undefined, "HenhouseName": "/"}
            ];
            rows.map(m => {
                m.HenhouseID = "0";
            });
            col_Henhouse.props.alignment = "center";
            return;
        }

        this.HenhouseSource.filter([
            ["DataDate", "<=", new DateTime(DataDate.toString() || new DateTime())],
            ["YHBatchID", "=", YHBatchID]
        ]);
        this.HenhouseSource.group((m) => {
            return [m.HenhouseID, m.ProductID]
        });
        col_Henhouse.props.lookup.dataSource = await this.HenhouseSource.load().then((res: Array<any>) => {
            let HenhouseDic = {};
            let result = [];

            res = res.filter((h) => {
                h.Quantity = 0;
                h.HenhouseName = h.items[0].HenhouseName;
                h.items.forEach(t => {
                    if(t.BIn) h.Quantity += t.Quantity;
                    else h.Quantity -= Math.abs(t.Quantity);
                })
                return h.Quantity > 0 && h.HenhouseID && h.HenhouseID != '0';
            });

            res.forEach(h => {
                HenhouseDic[h['key'][0]] = h.HenhouseName;
            });

            for(let HenhouseID in HenhouseDic) {
                if (HenhouseID && HenhouseID != '0') {
                    result.push({HenhouseID, HenhouseName: HenhouseDic[HenhouseID]});
                }
            }
            return result;

        });

        this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
        rows.map(m => {
            if(!(<Array<any>>col_Henhouse.props.lookup.dataSource).find(r => r.HenhouseID == m.HenhouseID)){
                m.HenhouseID = null;
            }
        });
        this.detailInstance.dataGrid.refresh();
    }
    //#endregion

    //#region 初始化工具条
    init_toolbar_panel(): YHOutHouseRecycleComponent {
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
        this.service.getClosedInTheCurrent().then((res)=>{
            if(res){
                // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.visible  = false;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.disabled  = true;
            }else{
                // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.visible  = true;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.disabled  = false;
            }
        })
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

    private dataValidation(data: any[], props: any[]): boolean {
        //初始化
        let isAll = true; //返回值
        let errorMessages = []; //弹出信息
        this.detailInstance.messageBox.clear();

        if (data.length <= 0) {
            errorMessages.push("明细表不能为空！");
            isAll = false;
        }

        //每一行
        for (let rowIndex in data) {
            //每一项
            if (data[rowIndex]) for (let prop of props) {

                let valiData = data[rowIndex];
                let propErrorMsg = this.translator.I18N.YHOutHouseRecycleDetail;
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
        var toValiFieldList = ["ProductID", "ElementQuantity"];
        if(this.isManageToHenhouse)
        {
            toValiFieldList.push('HenhouseID');
        }
        const validation = this.dataValidation(value.body, toValiFieldList);
        if (validation) {
            let saveData = new YHOutHouseRecycleModel();
            const date = new DateTime(value.header.DataDate.toString()).toString("yyyy-MM-dd");
            saveData.DataDate = date;

            if (value.header.NumericalOrder) {
                saveData.NumericalOrder = value.header.NumericalOrder || '0';
            }

            saveData.ComboPack = value.header.ComboPack || DataDictionary.ComboPackA;
            saveData.Remarks = value.header.Remarks || '';

            saveData.YHFarmerID = value.header.YHFarmerID;
            saveData.YHBatch = value.header.YHBatch;
            saveData.InWarehouse = value.header.InWarehouse;
            saveData.Abstract = value.header.Abstract || "0";
            saveData.ChickenFarmID = value.header.ChickenFarmID || "0";
            saveData.OutWarehouse = value.header.OutWarehouse || "0";
            saveData.QuoteBillType = value.header.QuoteBillType || "0";
            saveData.QuoteNumber = value.header.QuoteNumber || "0";
            saveData.QuoteNumericalOrderDetail = value.header.QuoteNumericalOrderDetail || "0";
            saveData.isbegin = value.header.isbegin || false;
            value.body.map((m) => {
                saveData.Details.push({
                    RecordID: "0",
                    NumericalOrder: m.NumericalOrder ? m.NumericalOrder : "0",
                    NumericalOrderDetail: m.NumericalOrderDetail || "0",
                    Remarks: m.DetailRemarks || '',
                    ProductID : m.ProductID,
                    CageQuantity : m.CageQuantity || 0,
                    ElementQuantity : m.ElementQuantity,
                    GrossWeight : m.GrossWeight || 0,
                    BareWeight : m.BareWeight || 0,
                    VehicleWeight : m.VehicleWeight || 0,
                    NetWeight : m.NetWeight || 0,
                    Quantity : m.Quantity || 0,
                    MeasureUnit : m.MeasureUnit || 0,
                    ProposalUnit : m.ProposalUnit || 0,
                    UnitPrice : m.UnitPrice || 0,
                    Amount : m.Amount || 0,
                    HenhouseID : this.isManageToHenhouse ? m.HenhouseID || "0" : "0",
                    TaxRate : m.TaxRate || 0,
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

        this.detailInstance.saveChanges().then((value) => {
            this.detailInstance.openCheck(
                () => {
                    const data = this.getSaveData(value);
                    if (data)
                    {
                        this.service.post(data).then(async (result: Result) => {
                            const response = ResponseSuccess.handle(result);
                            if (response.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                this.NumericalOrder = result.data.NumericalOrder;
                                //开启审核功能
                                this.model.review.visible = true;
                                this.model.review.numericalOrder = this.NumericalOrder;
                                this.model.dataGrid.type = 'detail';
                                this.detailInstance.$open = FormOptions.$modify;
                                await this.queryDetail();
                                // this.detailInstance.saveDataAfterStatus();
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
                        this.service.put(this.getSaveData(value)).then(async (result: Result) => {
                            const res = ResponseSuccess.handle(result);
                            if (res.status) {
                                Notify.toast('更新成功', NotifyType.Success);
                                //重置状态
                                this.detailInstance.$open = FormOptions.$modify;
                                await this.queryDetail();
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
        this.detailInstance.cacheSearchData = {};
        var arr = [];
        (<Array<any>>this.model.dataGrid.props.dataSource) = arr;
        this.detailInstance.createDataStatus(0, 1);
        this.model.conditionPanel.data['DataDate'] = new Date();
        this.model.conditionPanel.data['isbegin'] = false;
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

        setTimeout(() => {
            this.detailInstance.saveDataAfterStatus();
        })
        // this.getWarehouse();
        // this.changeDate((new DateTime()).toString('yyyy-MM-dd'));
        // setTimeout(() => {
        //     this.detailInstance.createDataStatus(undefined,10);
        // }, 20);

    }

    async cancel() {
        if (this.$option == FormOptions.$modify) {
            //编辑
            await this.queryDetail();
            this.detailInstance.resetDataStatus();
        } else {
            // 新增
            this.create()
        }
    }

    async queryDetail() {
        var Param = `$filter=(NumericalOrder eq '${this.NumericalOrder}')`;

        await this.service
            .byKey(<any>Param)
            .then(async (res: any) => {
                if (res) {
                    let result = res.value;
                    result[0].DaysOld = result[0].DaysOld == -1 ? null : result[0].DaysOld;
                    result[0].QuoteNumber = result[0].QuoteNumber == 0 ? null : result[0].QuoteNumber;
                    this.model.conditionPanel.data = deepCopy(result[0]);
                    // this.model.conditionPanel.data.Remarks = result[0].Remarks;
                    (<DataSource>this.BatchSource).filter([
                        ['YHFarmerID', '=', result[0].YHFarmerID],
                        ["Status", "=", true],
                        ["DataDate", "<=", new DateTime(result[0].DataDate.toString() || new DateTime().toString())]
                    ]);
                    this.detailInstance.cacheSearchData = deepCopy(result[0]);
                    // await new DataSource(this.yhBasicSettingODataContext.getYHBatchDataSource({
                    //     filter: ["YHBatchID", '=', result[0].YHBatch]
                    // })).load().then(yhbatch => {
                    //     if(yhbatch.length > 0){
                    //         //计算日龄
                    //         this.model.conditionPanel.data.BatchDaysOld = yhbatch[0].DaysOld != -1 ? yhbatch[0].DaysOld : null;
                    //         var YHBatchDate = this.model.conditionPanel.data.BatchDaysOldDate = new DateTime(yhbatch[0].DaysOldDate || new DateTime().toString());
                    //         var OutHouseRecycleDate = new DateTime(this.model.conditionPanel.data.DataDate || new DateTime().toString());
                    //         this.model.conditionPanel.data.DaysOld =  this.model.conditionPanel.data.BatchDaysOld ?
                    //             this.model.conditionPanel.data.BatchDaysOld + new DateTime().diff(OutHouseRecycleDate.dateTime, YHBatchDate.dateTime)
                    //             : null;
                    //     }
                    // })
                    // this.changeDate((result[0].DataDate).toString('yyyy-MM-dd'));
                    // this.qlwOdataContext.personODataStore
                    // .byKey(value.OwnerID)
                    // .then((val) => {
                    //     this.model.review.ownerName = val.PersonName;
                    // });
                    this.model.dataGrid.props.dataSource = result;
                    await this.setHenhouseSourceByYHBatch(this.model.conditionPanel.data.DataDate, this.model.conditionPanel.data.YHBatch);
                    (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => (m.target = DataStatus.none));


                    this.detailInstance.cacheBodyData = deepCopy(result);
                    //开启审核功能
                    this.model.review.ownerName = result[0].CreatedOwnerName;
                    this.model.review.visible = true;
                    this.model.review.numericalOrder = this.NumericalOrder;
                    // this.model.remarks.disabled = false;
                }
            });
        setTimeout(() => {
            this.detailInstance.saveDataAfterStatus();
        })


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
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=肉禽出栏回收`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=肉禽出栏回收`
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
                    //入库商品代号
                    cProductName: m.data.cProductName,
                    SexTypeName: m.data.SexTypeName,
                    PoultrySalesRankName:m.data.PoultrySalesRankName,
                    CageQuantity:m.data.CageQuantity,
                    ElementQuantity:m.data.ElementQuantity,
                    GrossWeight:m.data.GrossWeight,
                    BareWeight:m.data.BareWeight,
                    VehicleWeight:m.data.VehicleWeight,
                    NetWeight:m.data.NetWeight,
                    UnitPrice:m.data.UnitPrice,
                    Amount:m.data.Amount,
                    HenhouseName:m.data.HenhouseName,
                    TaxRate:m.data.TaxRate,
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
                //摘要
                AbstractName:this.model.conditionPanel.data['AbstractName'] == undefined ? '': this.model.conditionPanel.data['AbstractName'],
                //养殖场仓库
                OutWarehouse:this.model.conditionPanel.data['OutWarehouse'] == undefined ? '': this.model.conditionPanel.data['OutWarehouse'],
                //入库仓库
                InWarehouseName:this.model.conditionPanel.data['InWarehouseName'] == undefined ? '': this.model.conditionPanel.data['InWarehouseName'],
                //来源单据
                QuoteBillType:this.model.conditionPanel.data['QuoteBillType'] == undefined ? '': this.model.conditionPanel.data['QuoteBillType'],
                //来源单号
                QuoteNumber:this.model.conditionPanel.data['QuoteNumber'] == undefined ? '': this.model.conditionPanel.data['QuoteNumber'],
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
