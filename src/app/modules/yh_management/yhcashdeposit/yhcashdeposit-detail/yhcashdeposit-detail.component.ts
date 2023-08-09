import { Component, ComponentFactoryResolver, Input, ViewChild } from '@angular/core';
import { NxFormDetail } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail-extend';
import { NxZlwFormDetailComponent } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { ActivatedRoute } from '@angular/router';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxConditionItem, NxValidationRule } from 'src/app/components/search-panel/search-panel-extend';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import {DataDictionary, DataStatus,FormOptions,} from 'src/app/providers/enums';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { NxDataGridSummaryTotal } from 'src/app/components/component-model/data-grid/summary/model';
import {QlwODataContext,QlwProductContext, YHBasicSettingODataContext} from 'src/app/providers/odataContext';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { NxDataGridColumnValidationRule } from 'src/app/components/component-model/data-grid/columns/validation-rule/model';
import { DateTime } from 'src/app/providers/common/datetime';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import DataSource from 'devextreme/data/data_source';
import { PrintInput } from 'src/app/providers/print';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { ToolbarPanelType } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxDropDownButton, NxDropDownButtonItem, NxDropDownButtonProps } from 'src/app/components/component-model/drop-down-button/model';
import ODataStore from 'devextreme/data/odata/store';
import { YhCashDepositService } from '../yhcashdeposit.service';
import { YhCashDeposit } from '../yhcashdeposit.model';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelComponent } from 'src/app/components/search-panel/search-panel.component';
import { NxReviewComponent } from 'src/app/components/review/review.component';
import { EditorReviewRemoteComponent } from 'src/app/components/editor-grid/editor-review-remote/editor-review-remote.component';
import { NxReview, ReviewStatus } from 'src/app/components/review/review.extend';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { NxNumberBox } from 'src/app/components/component-model/number-box/mode';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { DxDataGridComponent } from 'devextreme-angular';
import { createNgModule } from '@angular/compiler/src/core';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { RegExps } from 'src/app/providers/regexp';
import { PrintPageComponent } from 'nxin-print';
import { TokenAuthService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-yhcashdeposit-detail',
    templateUrl: './yhcashdeposit-detail.component.html',
    styleUrls: ['./yhcashdeposit-detail.component.scss'],
})
export class YhCashDepositDetailComponent {
    @ViewChild('detailInstance', { static: false })
    detailInstance: NxZlwFormDetailComponent;
    model: NxFormDetail = new NxFormDetail();
    @ViewChild('toolbarPanel', { static: false })
    toolbarPanel: NxToolbarPanelComponent;
    @ViewChild('searchPanel', { static: false })
    searchPanel: NxSearchPanelComponent;
    @ViewChild('review', { static: false })
    reviewInstance: NxReviewComponent;
    isReview: boolean = false;
    defaultData: YhCashDeposit = {} as any;
    data: YhCashDeposit = {} as any;
    formData:any= {};
    reviewModel: any = new NxReview();
    lang: string = NxTranslateI18N.lang;
    $option: FormOptions = FormOptions.$modify;
    /**
     * 流水号
     */
    numericalOrder: string='';
    pigFarmData: any[] = [];
    printInput: PrintInput;
    loading:boolean = false;



    searchname:any;
    receiptApplyList: DataSource;
    paymentApplyList: DataSource;

    searchmarket:any;
    searchperson:any;
    searchcheck:any=false;
    checkId:any;
    checkIdYS:any;

    checkHouse:any;


    IsReferenceData:any;

    //引入收款单
    receiptApplyVisible:boolean = false;
    //付款单
    paymentApplyVisible:boolean = false;

    farmerNameDataSource_receiptApply:any;
    farmerNameDataSource_paymentApply:any;
    categoryDataSource:any;
    pigHouseUnitDataSource:any;
    technologicalDataSource:any;
    areaDataSource:any;
    marketDataSource:any;

    labelAttr: any;

    //弹窗框信息
    receiptTitle:any="引入收款单弹出框";
    //弹窗框信息
    paymentTitle:any="引入付款单弹出框";
    //显示隐藏养户查询条件
    showHide:boolean=false;
    //收款选择行
    checkReceiptApplyData:any=[];
    //付款选中行
    checkPaymentApplyData:any=[];
    //查询条件
    //引入收款单时，选择的养户
    ReceiptYHFarmerID:any;
    //引入收款单时，输入的收款单号
    ReceiptNumber:any;
    //引入收款单时，输入的收款摘要
    ReceiptAbstract:any;
    //引入收款单时，输入的金额
    ReceiptAmount:any;
    //引入收款单时，选择的日期
    searchdatereceipt:any[] = [];
    //引入付款单时，选择的日期
    searchdatepayment:any[] = [];
    //引入付款单时，选择的养户
    PaymentYHFarmerID:any;
    //引入付款单时，输入的付款单号
    PaymentNumber:any;
    //引入付款单时，输入的付款摘要
    PaymentAbstract:any;
    //引入付款单时，输入的金额
    PaymentAmount:any;
    //下拉收款数据
    receiptApplyData: any=[];
    //下拉付款数据
    paymentApplyData: any=[];
    //下拉默认数据
    defaultApplyData: any=[];

    YHFarmerIDSearch:any=['YHFarmerName', 'YHPersonName', 'Phone', 'MnemonicCode'];

    showQumber:boolean=false;

    checkIdType:boolean=false;

    operateCell:any=[];

    //打印
    menu_id: string;
    environment: any;
    tokenData: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    constructor(
        private tokenService: TokenAuthService,
        private route: ActivatedRoute,
        private service: YhCashDepositService,
        private qlwOdataContext: QlwODataContext,
        private qlwProduct: QlwProductContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private translator: TranslateService,
        private _statusODataContext: StatusODataContext,
    ) {
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;

        this.loading=true;
        this.numericalOrder = this.route.queryParams['value']['numericalOrder']?this.route.queryParams['value']['numericalOrder']:'';
        this.$option = this.route.queryParams['value']['$option'];
        this.model.initialization = this.initialization.bind(this);
        this.init_data_grid().init_table_header().init_toolbar_panel();

        this.receiptApplyList=  this.service.GetReceivablesList();
        this.paymentApplyList = this.service.GetPaymentList();
        this.service.GetReceivablesList().load().then((res:any)=>{
            this.receiptApplyData = res;
        })
        this.service.GetPaymentList().load().then((res:any)=>{
            this.paymentApplyData = res;
        })
        this.searchdatereceipt=[
           new Date(new Date(new Date().setDate(1)).toLocaleDateString()),
            new Date(new Date(new Date().getTime()).toLocaleDateString())
        ]
        this.searchdatepayment = [
            new Date(new Date(new Date().setDate(1)).toLocaleDateString()),
            new Date(new Date(new Date().getTime()).toLocaleDateString())
        ]
        setTimeout(()=>{
            this.loading = false;
        },100)
    }
    onStartReview() {
        let isDisabled = (<NxButton>this.model.toolbar.getWidgetByKey('save')).props.disabled;
        if (!isDisabled) {
            return false;
        }
        return true;
    }
    ngOnInit() {
        //收款单的养户
        this.yhBasicSettingODataContext.YHFarmer.load().then((res:any)=>{this.farmerNameDataSource_receiptApply = res}),
        //付款单的养户，直接读养户档案。
        this.yhBasicSettingODataContext.YHFarmer.load().then((res:any)=>{this.farmerNameDataSource_paymentApply = res}),
        //付款单接口
        this.receiptApplyList.filter([
            ['DataDate', '>=', this.searchdatereceipt[0]],
            ['DataDate','<=',  this.searchdatereceipt[1]],
        ]);
        this.receiptApplyList.sort( [{ getter: "DataDate", desc: true },{ getter: "Number", desc: true }])
        this.receiptApplyList.load();

        this.paymentApplyList.filter([
            ['DataDate', '>=', this.searchdatepayment[0]],
            ['DataDate','<=',  this.searchdatepayment[1]],
        ]);
        this.paymentApplyList.sort( [{ getter: "DataDate", desc: true },{ getter: "Number", desc: true }])
        this.paymentApplyList.load();
    }
    //#region 初始化表格
    init_data_grid(): YhCashDepositDetailComponent {
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.columns.push();
        this.model.dataGrid.recordDisplay = false;
        this.model.dataGrid.commandRow.visible = false; //禁用删行、增行
        this.model.dataGrid.commandAddRow.visible = false; //禁用增行
        // this.model.dataGrid.visible = false;
        this.model.remarks.visible = false;
        this.model.dataGrid.isCacheColumn=false;
        this.model.dataGrid.props.noDataText="";
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.props.columnAutoWidth = true;
        this.model.dataGrid.paginate.pager.visible = 'auto';
        this.model.dataGrid.summary.enabled = true;

        const summaryItem_total_Quantity = new NxDataGridSummaryTotal();
        summaryItem_total_Quantity.column = 'Quantity';
        summaryItem_total_Quantity.summaryType = 'sum';
        summaryItem_total_Quantity.displayFormat = '{0}';
        this.model.dataGrid.summary.totalItems = [summaryItem_total_Quantity];

        this.model.dataGrid.events.onEditorPreparing = this.editorPreparing.bind(this);
        this.model.dataGrid.events.onCellClick = this.handleCell.bind(this);

        return this;
    }
    handleCell(e) {

    }
    editorPreparing(e) {
        // if (e.parentType == 'dataRow') {
        //     let triggerValueChanged=true;
        //     switch (e.dataField) {

        //         case 'OrderAbstract':
        //             this.orderAbstractPreparing(e);
        //             triggerValueChanged=false;
        //             break;
        //         case 'PigHouseUnitId':
        //             this.pigHouseUnitIdPreparing(e);
        //             triggerValueChanged=false;
        //             break;
        //         case 'OppositeSubject':
        //             this.oppositeSubjectPreparing(e);
        //             // triggerValueChanged=false;
        //             break;
        //         case 'OutPigHouseUnitId':
        //             this.outPigHouseUnitIdPreparing(e);
        //             triggerValueChanged=false;
        //             break;

        //     }
        //     if(triggerValueChanged){
        //         //没有这个，编辑datagrid不会激活保存按钮
        //         e.editorOptions.onValueChanged = (args) => {
        //             if(!args.previousValue&&args.previousValue!=0&&!args.value&&args.value!=0){}
        //             else{
        //                 this.detailInstance.modifyDataStatusSet();
        //                 setTimeout(() => {
        //                     e.setValue(args.value, args.component._changedValue);
        //                 }, 0);
        //             }
        //         };
        //     }
        // }
    }

    get columns() {
        //摘要,  列表页进入编辑页的时候，get接口没有返回摘要名称，如果这里制定了名称字段，就不会显示名称。所以去掉了名称，让组件自己去匹配。 'OrderAbstractName'
        const col_orderAbstract = new NxDataGridColumn('摘要','OrderAbstract','string');
        col_orderAbstract.props.minWidth = 100;
        col_orderAbstract.props.HeaderRequiredIcon = true;
        let productmust = new NxDataGridColumnValidationRule();
        productmust.type = 'required';
        productmust.message = '请选择摘要';
        col_orderAbstract.validationRules = [productmust];
        col_orderAbstract.props.lookup.enabled = true;
        //默认先绑定所有数据，这样列表页进入编辑页，可以显示名称。当点击摘要的时候，会重新根据条件绑定
        // col_orderAbstract.props.lookup.dataSource = this.qlwFinanceContext.getQlwSummaryInfoDataSource({},'');
        col_orderAbstract.props.lookup.valueExpr = 'SettleSummaryID';
        col_orderAbstract.props.lookup.displayExpr = 'SettleSummaryName';
        col_orderAbstract.props.setCellValue= this.setOrderAbstractValue.bind(this);
        //养户栋舍 ,'PigHouseUnitName'
        const col_pigHouseUnitId = new NxDataGridColumn('养户栋舍','PigHouseUnitId','string');
        col_pigHouseUnitId.props.lookup.enabled = true;
        col_pigHouseUnitId.props.minWidth = 100;
        col_pigHouseUnitId.props.HeaderRequiredIcon = true;
        let pigHouseUnitId_must = new NxDataGridColumnValidationRule();
        pigHouseUnitId_must.type = 'required';
        pigHouseUnitId_must.message = '请选择养户栋舍';
        col_pigHouseUnitId.validationRules = [pigHouseUnitId_must];

        col_pigHouseUnitId.props.lookup.valueExpr = 'PigHouseUnitId';
        col_pigHouseUnitId.props.lookup.displayExpr = 'PigHouseUnitName';
        col_pigHouseUnitId.props.setCellValue= this.setPigHouseUnitIdValue.bind(this);


        //资金类型 IsBond
        const col_isBond = new NxDataGridColumn('资金类型', 'IsBond', 'string');
        col_isBond.props.HeaderRequiredIcon = true;
        col_isBond.props.lookup.enabled = true;
        col_isBond.props.lookup.dataSource = [
            { label: '保证金', value: 'true' },
            { label: '非保证金', value: 'false' },
        ];
        col_isBond.props.lookup.displayExpr = 'label';
        col_isBond.props.lookup.valueExpr = 'value';

        const col_isBond_required = new NxDataGridColumnValidationRule();
        col_isBond_required.type = 'required';
        col_isBond_required.message = '请选择资金类型';
        col_isBond.validationRules.push(col_isBond_required);

        //金额  不同类别的范围控制在后端控制，前段暂时不做。
        const col_amount = new NxDataGridColumn('金额','Amount','number');
        col_amount.props.HeaderRequiredIcon = true;
        col_amount.props.minWidth = 100;
        let nummust = new NxDataGridColumnValidationRule();
        nummust.type = 'required';
        nummust.message = '请填写金额';
        const col_weight_range = new NxDataGridColumnValidationRule('range');
        col_weight_range.min = 0.01;
        col_weight_range.max = 999999999.99;
        col_weight_range.message = '请输入0.01-999999999.99之间的数字';
        const col_weight_fixed = new NxDataGridColumnValidationRule('pattern');
        col_weight_fixed.pattern = RegExps.PositiveNumberFix2;
        col_weight_fixed.message =  '请输入0.01-999999999.99之间的数字';
        col_amount.validationRules.push(...[nummust, col_weight_range, col_weight_fixed]);

        //对方科目OppositeSubjectName
        const col_oppositeSubject = new NxDataGridColumn('对方科目','OppositeSubject','string');
        col_oppositeSubject.props.minWidth = 100;
        col_oppositeSubject.props.HeaderRequiredIcon = true;
        let oppositeSubjectmust = new NxDataGridColumnValidationRule('custom',);
        oppositeSubjectmust.message = '请选择对方科目';
        oppositeSubjectmust.ignoreEmptyValue = false
        // oppositeSubjectmust.validationCallback = (e) => {
        //     return !e.column.visible||e.value;//不显示或者有值，验证成功，否则，验证失败
        // }
        col_oppositeSubject.validationRules = [oppositeSubjectmust];
        col_oppositeSubject.props.lookup.enabled = true;
        //当点击下拉框的时候会绑定数据源，这里初始化的时候先绑定一个，是为了    new DateTime(new Date().toString()).toString('yyyy-MM-dd')
        // col_oppositeSubject.props.lookup.dataSource =  this.qlwFinanceContext.getQlwAccosubjectDataSource({
        //     filter: [
        //         //['IsTorF', '=', 1],//资金科目
        //         ['Rank','>',0],
        //         ['IsUse', '=', 1]
        //     ],
        //     select: ['AccoSubjectId', 'AccoSubjectName'],
        // },'');
        col_oppositeSubject.props.lookup.valueExpr = 'AccoSubjectId';
        col_oppositeSubject.props.lookup.displayExpr = 'AccoSubjectName';

        //保证金余额
        const col_bondBalance = new NxDataGridColumn('保证金余额','BondBalance','number');
        col_bondBalance.props.minWidth = 100;
        col_bondBalance.props.allowEditing = false;

        //非保证金余额
        const col_noBondBalance = new NxDataGridColumn('非保证金余额','NoBondBalance','number');
        col_noBondBalance.props.minWidth = 100;
        col_noBondBalance.props.allowEditing = false;
        //col_noBondBalance.props.visible=false;

        // 转出养户
        const col_outYHFarmerID = new NxDataGridColumn('转出养户','OutYHFarmerID','string');
        col_outYHFarmerID.props.minWidth = 100;
        col_outYHFarmerID.props.HeaderRequiredIcon = true;
        let availablemust = new NxDataGridColumnValidationRule('custom');
        availablemust.message = '请选择转出养户';
        availablemust.ignoreEmptyValue = false
        // availablemust.validationCallback = (e) => {
        //     return !e.column.visible||e.value;//不显示或者有值，验证成功，否则，验证失败
        // }
        col_outYHFarmerID.validationRules = [availablemust];

        col_outYHFarmerID.props.lookup.enabled = true;
        col_outYHFarmerID.props.lookup.valueExpr = 'YHFarmerID';
        col_outYHFarmerID.props.lookup.displayExpr = 'YHFarmerName';
        col_outYHFarmerID.props.visible=false;

        //转出栋舍,'OutPigHouseUnitName'
        const col_outPigHouseUnitId = new NxDataGridColumn('转出栋舍','OutPigHouseUnitId','string');
        col_outPigHouseUnitId.props.minWidth = 100;
        col_outPigHouseUnitId.props.HeaderRequiredIcon = true;
        let col_outPigHouseUnitId_must = new NxDataGridColumnValidationRule('custom');
        col_outPigHouseUnitId_must.message = '请选择转出栋舍';
        col_outPigHouseUnitId_must.ignoreEmptyValue = false
        // col_outPigHouseUnitId_must.validationCallback = (e) => {
        //     return !e.column.visible||e.value;//不显示或者有值，验证成功，否则，验证失败
        // }
        col_outPigHouseUnitId.validationRules = [col_outPigHouseUnitId_must];
        col_outPigHouseUnitId.props.lookup.enabled = true;
        //默认是所有养户的栋舍，再下拉框点击事件时，重新根据所选养护绑定数据源
        col_outPigHouseUnitId.props.lookup.valueExpr = 'PigHouseUnitId';
        col_outPigHouseUnitId.props.lookup.displayExpr = 'PigHouseUnitName';
        col_outPigHouseUnitId.props.visible=false;

        //转出资金类型
        const col_outIsBond = new NxDataGridColumn('转出资金类型', 'OutIsBond', 'string');
        col_outIsBond.props.HeaderRequiredIcon = true;
        col_outIsBond.props.lookup.enabled = true;
        col_outIsBond.props.lookup.dataSource = [
            { label: '保证金', value: 'true' },
            { label: '非保证金', value: 'false' },
        ];
        col_outIsBond.props.lookup.displayExpr = 'label';
        col_outIsBond.props.lookup.valueExpr = 'value';
        let col_outIsBond_required = new NxDataGridColumnValidationRule('custom');
        col_outIsBond_required.message = '请选择转出资金类型';
        col_outIsBond_required.ignoreEmptyValue = false
        // col_outIsBond_required.validationCallback = (e) => {
        //     return !e.column.visible||e.value;//不显示或者有值，验证成功，否则，验证失败
        // }
        col_outIsBond.validationRules = [col_outIsBond_required];
        col_outIsBond.props.visible=false;

        // 非保证金余额（转出栋舍）
        const col_outNoBondBalance = new NxDataGridColumn('非保证金余额（转出栋舍）','OutNoBondBalance','number');
        col_outNoBondBalance.props.minWidth = 100;
        col_outNoBondBalance.props.allowEditing = false;
        col_outNoBondBalance.props.visible=false;

        //保证金余额（转出栋舍）
        const col_OutBondBalance = new NxDataGridColumn('保证金余额（转出栋舍）','OutBondBalance','number');
        col_OutBondBalance.props.minWidth = 100;
        col_OutBondBalance.props.allowEditing = false;
        col_OutBondBalance.props.visible=false;

        return [col_orderAbstract,col_pigHouseUnitId,col_isBond,col_amount,col_oppositeSubject,
            col_bondBalance,
            col_noBondBalance,
            col_outYHFarmerID,col_outPigHouseUnitId,col_outIsBond,col_outNoBondBalance,col_OutBondBalance];
    }
    setPigHouseUnitIdValue(newData, value, currentRowData) {
        (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
            if (m.NumericalOrderDetail == currentRowData.NumericalOrderDetail) {

                m['PigHouseUnitId'] = value;
            }
        });
    }


    setOrderAbstractValue(newData, value, currentRowData) {
        (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
            if (m.NumericalOrderDetail == currentRowData.NumericalOrderDetail) {
                m['OrderAbstract'] = value;
            }
        });
    }

    //#endregion

    //#region 初始化工具条
    init_toolbar_panel(): YhCashDepositDetailComponent {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;
        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).events.onClick = this.print.bind(this);
        //隐藏设置
        this.model.toolbar.getOtherWidgetByKey('setting').props.visible=false;

        //引入
        const cancel_introduce = new ToolbarPanelType();
        cancel_introduce.type = 'DropDownButton';
        cancel_introduce.key = 'introduce';
        cancel_introduce.widget = new NxDropDownButton();
        cancel_introduce.widget.props.text ='引入';
        cancel_introduce.widget.props.icon = 'iconfont icona-yinru1';
        (<NxDropDownButtonProps>cancel_introduce.widget.props).splitButton=false;
        cancel_introduce.widget.props.items.push(new NxDropDownButtonItem('收款单', 'receipt-apply', ''));
        cancel_introduce.widget.props.items.push(new NxDropDownButtonItem('付款单', 'payment-apply', ''));
        this.model.toolbar.mainPanel.splice(1,0,cancel_introduce);


        (<NxDropDownButton>this.model.toolbar.getWidgetByKey('introduce')).events.onItemClick=(e)=>{
            if(e.itemData.type=='receipt-apply')
            {
                this.showHide =false;
                this.showQumber =false;
                this.ReceiptYHFarmerID =null;
                this.receiptTitle ="引入收款单弹出框";
                this.searchdatereceipt=[
                     new Date(new Date(new Date().setDate(1)).toLocaleDateString()),
                     new Date(new Date(new Date().getTime()).toLocaleDateString())
                 ]
                this.receiptApplyShow();
            }
            if(e.itemData.type=='payment-apply')
            {
                this.showHide =false;
                this.showQumber =false;
                this.PaymentYHFarmerID =null;
                this.paymentTitle="引入付款单弹出框";
                this.searchdatepayment = [
                    new Date(new Date(new Date().setDate(1)).toLocaleDateString()),
                    new Date(new Date(new Date().getTime()).toLocaleDateString())
                ]
                this.paymentApplyShow();
            }
        }

        return this;
    }
    print(){
        // 创建打印实例
        let printer = new PrintInput();
        // 获取打印数据行文本
        this.detailInstance.dataGrid.dataGrid.instance.getVisibleRows().map((m, index) => {
            const rowElement = this.detailInstance.dataGrid.dataGrid.instance.getRowElement(index);
            printer.rowElementCollection.push(rowElement);
        });
         // 设置打印其他信息
         printer.setOptions({
            title:this.translator.I18N.YHCashDeposit.title,
            enterpriseId:USER_INFO_CONTEXT.enterpriseId,
            pigFarmName:USER_INFO_CONTEXT.chickenFarmName,
            breeder:this.model.review.ownerName,
            dateTime:new DateTime(new Date(this.model.conditionPanel.data['DataDate']).toString()).toString('yyyy-MM-dd'),
            billNumber: this.model.conditionPanel.data['Number'],
            mark: this.model.conditionPanel.data['Remarks'],
            auditerName: this.model.review.reviewName,
            creatorName: this.model.review.ownerName
         });
         var heads=[
             {
                lable: this.translator.I18N.commonColumns.company.text,
                content: USER_INFO_CONTEXT.enterpriseName,
             },
             {
                lable: this.translator.I18N.commonColumns.farm.text,
                content: USER_INFO_CONTEXT.chickenFarmName,
             },
             {
                lable: this.translator.I18N.YHCashDeposit.DataDate.text,
                content:new DateTime(new Date(this.model.conditionPanel.data['DataDate']).toString()).toString('yyyy-MM-dd'),
             },
             {
                lable: this.translator.I18N.commonColumns.number.text,
                content: this.model.conditionPanel.data['Number'],
             },
            ];
         var foots=[
            {
                lable: this.translator.I18N.commonColumns.producer.text,
                content: this.model.review.ownerName,
            },
            {
                lable: this.translator.I18N.commonColumns.auditName.text,
                content: this.model.review.reviewName,
            },

         ];
         var quantity=0;//数量
         if(printer.rows!=null && printer.rows.length>0){
            for (let i = 0; i < printer.rows.length; i++) {
                quantity+=Number(printer.rows[i].c6);
                if((i+1)%9==0 || printer.rows.length-1==i){
                    var array=[];
                this.columns.map((col, index) => {
                    if (col.props.visible) {
                        // 设置标题
                        if(printer.rows.length-1==i){
                            printer.columns.push(col.props.caption);
                        }
                        //按照每页实际打印的数目设置打印合计行
                        var value=null;
                        switch (index) {
                            case 5:
                                value=quantity
                                break;
                        }
                        array.push({
                            index: index,
                            value: value,
                        });
                    }
                })
                printer.SaleSummaryRows.push(array);
                 quantity=0;//数量
                }
            }
         }
         printer.headers = heads;
        printer.footers = foots;
        printer.InvoiceType = 2;
          // 调用接口打印PDF
        // this.odataContext.print(printer);
    }
    create() {
        this.$option=FormOptions.$create;
        this.model.conditionPanel.data = {};
        this.detailInstance.cacheSearchData = {};
        this.numericalOrder=null;//新增后，需要将当前单据号清空，否则后面计算保证金余额的时候，会根据判断有无this.numericalOrder，有的话会排除this.numericalOrder这个单据。
        this.model.conditionPanel.data.NumericalOrder = '';
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data['DataDate'] = new Date();
        this.model.conditionPanel.data['YHFarmerID']=null;
        this.model.conditionPanel.data['AccountType']='';//默认存款
        this.model.conditionPanel.data['QuoteBillType']=null;
        this.model.conditionPanel.data['QuoteNumber']=null;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteBillType')[0].widget.props.disabled=true;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteNumber')[0].widget.props.disabled=true;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='YHFarmerID')[0].widget.props.disabled=false;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='AccountType')[0].widget.props.disabled=false;
        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);
        this.model.review.visible = false;
        //点击删除后，禁用了引入。此时点击新增，要激活引入。
        (<NxButton>this.model.toolbar.getWidgetByKey('introduce')).props.disabled=false;
        setTimeout(() => {
            //datagrid表格显示哪些，不显示哪些是架构部那边控制的，这边根据类别，重置
            // this.changeDataGridColumnVisiableByAccountType(this.model.conditionPanel.data['AccountType'])
            this.detailInstance.createDataStatus();
            this.model.dataGrid.props.dataSource=[];
            this.model.dataGrid.recordDisplay = false;
            this.model.dataGrid.commandRow.visible = false; //禁用删行、增行
            this.model.dataGrid.commandAddRow.visible = false; //禁用增行
        }, 500);
    }
    save() {
        if (!this.model.conditionPanel.data.DataDate) {
            Notify.toast('请选择日期', NotifyType.Error);
            return;
        }
        if (!this.model.conditionPanel.data.YHFarmerID) {
            Notify.toast('请选择养户名称', NotifyType.Error);
            return;
        }
        if (!this.model.conditionPanel.data.AccountType) {
            Notify.toast('请选择收支类型', NotifyType.Error);
            return;
        }
        if ((parseInt(this.model.conditionPanel.data.Amount) == 0)) {
            Notify.toast('金额不能为0', NotifyType.Error);
            return;
        }
        let data = new YhCashDeposit();
        const date = new DateTime(this.model.conditionPanel.data.DataDate.toString()).toString('yyyy-MM-dd');
        data.DataDate = date;
        data.YHFarmerID=this.model.conditionPanel.data.YHFarmerID || '0';
        data.AccountType=this.model.conditionPanel.data.AccountType || '0';
        data.Amount=this.model.conditionPanel.data.Amount || 0;
        data.QuoteBillType=this.model.conditionPanel.data.QuoteBillType || '0';
        data.QuoteNumericalOrder=this.model.conditionPanel.data.QuoteNumericalOrder || '0';
        data.QuoteNumber=this.model.conditionPanel.data.QuoteNumber || '0';
        data.Remarks=this.model.conditionPanel.data.Remarks || '';
        data.ComboPack = DataDictionary.ComboPackA;
        data.Number=this.model.conditionPanel.data.Number || '0';
        data.NumericalOrder=this.model.conditionPanel.data.NumericalOrder || '0';
        if (this.$option == FormOptions.$create) {
            this.detailInstance.loading = true;
            this.service.create(data).then((result: Result) => {
                const response = ResponseSuccess.handle(result);
                this.detailInstance.loading = false;
                if (response.status) {
                    Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                    this.model.conditionPanel.data['NumericalOrder'] = result.data.NumericalOrder;
                    this.numericalOrder = response.data.NumericalOrder;
                    this.$option = FormOptions.$modify;
                    // 保存成功更新对比数据源
                    this.load();
                    setTimeout(() => {
                        this.detailInstance.saveDataAfterStatus();
                    }, 200);
                } else {
                    this.detailInstance.loading = false;
                    this.detailInstance.messageBox.show(response.message);
                    // Notify.toast(response.message, NotifyType.Error);
                }
            });
        }
        if (this.$option == FormOptions.$modify) {
            this.detailInstance.loading = true;
            this.service.update(data).then((result: Result) => {
                const response = ResponseSuccess.handle(result);
                this.detailInstance.loading = false;
                if (response.status) {
                    Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                    // 修改成功更新对比数据源
                    this.numericalOrder = response.data.NumericalOrder;
                    this.load();
                    setTimeout(() => {
                        this.detailInstance.saveDataAfterStatus();
                    }, 200);
                } else {
                    this.detailInstance.loading = false;
                    this.detailInstance.messageBox.show(response.message);
                }
            });
        }
    }
    delete() {
        MessageBox.confirm(
            this.translator.I18N.commandOptions.delete.confirm,
            this.translator.I18N.commandOptions.delete.confirmTitle
        ).then((require) => {
            if (require) {
                this.service.deleteByKey(this.model.conditionPanel.data.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result, this.columnMap);
                    if (response.status) {
                        Notify.toast(this.translator.I18N.commandOptions.delete.success, NotifyType.Success);
                        this.loading = true;
                        this.detailInstance.deletedStatus();
                        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteNumber')[0].widget.props.disabled=true;
                        //删除之后，引入按钮也禁用。当前页面只能点击新增按钮
                        (<NxButton>this.model.toolbar.getWidgetByKey('introduce')).props.disabled=true;
                        setTimeout(()=>{
                            this.loading = false;
                        })
                    } else {
                        this.detailInstance.messageBox.show(response.message);
                    }
                });
            }
        });
    }

    cancel() {
        if (this.detailInstance.$open == FormOptions.$create) {
            this.loading = true;
            this.detailInstance.createDataStatus();
            this.detailInstance.resetDataStatusSet();
            //引入单据时，禁用了下面两个字段。撤销时启用
            this.model.conditionPanel.conditionItems.find(x=>x.dataField=='YHFarmerID').widget.props.disabled=false;
            this.model.conditionPanel.conditionItems.find(x=>x.dataField=='AccountType').widget.props.disabled=false;
            this.model.conditionPanel.conditionItems.find(x=>x.dataField=='CapitalAccount').widget.props.disabled=false;
            this.model.conditionPanel.conditionItems.find(x=>x.dataField=='CapitalSubject').widget.props.disabled=false;

            // 类别虽然变回了回去，但是没有触发change事件，这里手动触发一下
            // this.changeDataGridColumnVisiableByAccountType(this.model.conditionPanel.data['AccountType']);
            setTimeout(() => {
                this.loading = false;
            }, 100);
        } else {
            this.load()
        }
        setTimeout(() => {
            this.detailInstance.resetDataStatus();
        }, 500);

    }
    private dataValidation(data): boolean {
        const validator = new DataValidator();
        validator.forObjRequire(data, [
            // ['OutYHFarmerID','请选择转出养户2']
        ]);
        return validator.validation;
    }
    private getSaveData(value) {
        const validation = this.dataValidation(value.body);
        if (validation) {
            let saveData = new YhCashDeposit();
            Object.assign(saveData, value.header)
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }
    //#endregion

    //#region  表头配置
    init_table_header(): YhCashDepositDetailComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};
        //日期
        const condition_date = new NxConditionItem(this.translator.I18N.YHCashDeposit.DataDate.text,'DataDate','DateBox',true);
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        condition_date.widget.props.max = new Date();

        //养户姓名
        const con_farmName = new NxConditionItem( '养户名称', 'YHFarmerID','SelectBox',true);
        con_farmName.widget = new NxSelectBox();
        con_farmName.widget.props.valueExpr = 'YHFarmerID';
        con_farmName.widget.props.displayExpr = 'YHFarmerName';
        con_farmName.widget.props.dataSource=  this.yhBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                ['Status', '=', true]
            ]
        });
        con_farmName.widget.props.valueExpr = "YHFarmerID";
        con_farmName.widget.props.displayExpr = "YHFarmerName";
        con_farmName.widget.props.searchExpr = ['YHFarmerName', 'YHPersonName', 'Phone', 'MnemonicCode'];

        //类别
        const col_accountType = new NxConditionItem( '收支类型', 'AccountType','SelectBox',true);
        col_accountType.widget = new NxSelectBox();
        col_accountType.widget.props.placeholder = '请选择';
        col_accountType.widget.props.dataSource=  this._statusODataContext.getAccountTypeDataSource();
        col_accountType.widget.props.valueExpr = 'DictId';
        col_accountType.widget.props.displayExpr = 'DictName';
        col_accountType.widget.events.onOpened = e => {
            e.component.option('dataSource',this._statusODataContext.getAccountTypeUnDataSource());
        };
        col_accountType.widget.events.onValueChanged=(data)=>{
            if(data){
                if(data=="2201131702170001555"){
                    this.model.conditionPanel.data['QuoteBillType'] = '2201131629250003655';
                    this.model.conditionPanel.conditionItems.find(x=>x.dataField=='QuoteBillType').widget.props.disabled=true;
                    this.model.conditionPanel.conditionItems.find(x=>x.dataField=='QuoteNumber').widget.props.disabled=false;
                }else if(data=="2201131702170001655"){
                    this.model.conditionPanel.data['QuoteBillType'] = '2201131629250003755';
                    this.model.conditionPanel.conditionItems.find(x=>x.dataField=='QuoteBillType').widget.props.disabled=true;
                    this.model.conditionPanel.conditionItems.find(x=>x.dataField=='QuoteNumber').widget.props.disabled=false;
                }else{
                    this.model.conditionPanel.data['QuoteBillType']='';
                    this.model.conditionPanel.data['QuoteNumber']='';
                    this.model.conditionPanel.data['QuoteNumericalOrder']='0';
                    this.model.conditionPanel.conditionItems.find(x=>x.dataField=='QuoteBillType').widget.props.disabled=true;
                    this.model.conditionPanel.conditionItems.find(x=>x.dataField=='QuoteNumber').widget.props.disabled=true;
                }
            }
        }



        const col_amount = new NxConditionItem( '金额', 'Amount','NumberBox',true);
        col_amount.widget = new NxNumberBox();
        const col_amount_range = new NxValidationRule();
        col_amount_range.type='range',
        col_amount_range.min = 0;
        col_amount_range.message = this.translator.I18N.ZqPoultrySales.Weight.rangeMessage;
        const col_amount_fixed = new NxDataGridColumnValidationRule('pattern');
        col_amount_fixed.pattern = RegExps.PositiveNumberFix2;
        col_amount_fixed.message = this.translator.I18N.YHCashDeposit.Amount.patternMessage;
        col_amount.validationRules.push(...[col_amount_range,col_amount_fixed]);

        //单据号
        const condition_number = new NxConditionItem();
        condition_number.label = this.translator.I18N.commonColumns.number.text;
        condition_number.type = 'Span';
        condition_number.dataField = 'Number';

        // 关联单据类型
        const condition_quoteBillType = new NxConditionItem('关联单据','QuoteBillType','SelectBox',false);
        condition_quoteBillType.widget = new NxSelectBox();
        condition_quoteBillType.widget.props.dataSource= this._statusODataContext.getQuoteBillTypeDataSource();
        condition_quoteBillType.widget.props.disabled=false;
        condition_quoteBillType.widget.props.placeholder = '请选择';
        condition_quoteBillType.widget.props.valueExpr = "DictId";
        condition_quoteBillType.widget.props.displayExpr = "DictName";
        condition_quoteBillType.widget.events.onOpened = e => {
            e.component.option('dataSource',this._statusODataContext.getQuoteBillTypeUnDataSource());
        };

        // 关联单据号  未关联单据号的时候，后台返回0.这个可以优化一下。！！！
        const condition_quoteNumber = new NxConditionItem('关联单号','QuoteNumber','TextBox',false);
        condition_quoteNumber.widget = new NxTextBox();
        condition_quoteNumber.widget.props.readOnly = true;
        condition_quoteNumber.widget.props.disabled=false;
        condition_quoteNumber.widget.props.showClearButton=true;
        condition_quoteNumber.widget.events.onClick = this.onChanged.bind(this);
        condition_quoteNumber.widget.props.placeholder = "点击选择";
        condition_quoteNumber.btnicon="iconfont iconclose add-button";
        condition_quoteNumber.btntitle="清空关联单号";
        condition_quoteNumber.btnOperation = (e) => {
            this.deleteOperation();
        }
        // condition_quoteNumber.widget.events.onValueChanged=(data)=>{
        //     if(data){
        //         this.model.conditionPanel.data['QuoteNumericalOrder']=data;
        //         this.model.conditionPanel.conditionItems.find(x=>x.dataField=='DataDate').widget.props.disabled=true;
        //         this.model.conditionPanel.conditionItems.find(x=>x.dataField=='YHFarmerID').widget.props.disabled=true;
        //         this.model.conditionPanel.conditionItems.find(x=>x.dataField=='AccountType').widget.props.disabled=true;
        //         this.model.conditionPanel.conditionItems.find(x=>x.dataField=='QuoteBillType').widget.props.disabled=true;
        //         this.model.conditionPanel.conditionItems.find(x=>x.dataField=='Amount').widget.props.disabled=true;
        //     }else{
        //         this.model.conditionPanel.data['QuoteNumericalOrder']='0';
        //         this.model.conditionPanel.conditionItems.find(x=>x.dataField=='DataDate').widget.props.disabled=false;
        //         this.model.conditionPanel.conditionItems.find(x=>x.dataField=='YHFarmerID').widget.props.disabled=false;
        //         this.model.conditionPanel.conditionItems.find(x=>x.dataField=='AccountType').widget.props.disabled=false;
        //         this.model.conditionPanel.conditionItems.find(x=>x.dataField=='Amount').widget.props.disabled=false;
        //     }
        // }
        // 备注
        const col_remarks = new NxConditionItem( '备注', 'Remarks','TextBox',false);
        col_remarks.widget = new NxTextBox();

        this.model.conditionPanel.conditionItems.push(condition_date,con_farmName,col_accountType,col_amount,
            condition_quoteBillType,condition_quoteNumber,col_remarks,condition_number);
        return this;
    }
    //#endregion
    onChanged() {
        this.receiptTitle="关联收款单弹出框";
        this.paymentTitle="关联付款单弹出框";
        //弹窗框信息
        var datadate = new Date(this.model.conditionPanel.data['DataDate']);
        this.searchdatereceipt=[
            new Date(datadate),
            new Date(datadate)
         ]
        this.searchdatepayment = [
            new Date(datadate),
            new Date(datadate)
        ]
        if(this.model.conditionPanel.data['QuoteBillType']=='2201131629250003655')
        {
            this.showQumber =true;
            this.ReceiptYHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            this.receiptApplyShow();
        }
        if(this.model.conditionPanel.data['QuoteBillType']=='2201131629250003755')
        {
            this.showQumber =true;
            this.PaymentYHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            this.paymentApplyShow();
        }
        this.showHide =true;
    }
    deleteOperation(){
        this.model.dataGrid.props.dataSource=[];
        this.model.conditionPanel.data['QuoteNumericalOrder'] = null;
        this.model.conditionPanel.data['QuoteNumber'] = null;
        this.model.conditionPanel.data['QuoteBillType'] = null;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='DataDate')[0].widget.props.disabled=false;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='YHFarmerID')[0].widget.props.disabled=false;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='AccountType')[0].widget.props.disabled=false;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='Amount')[0].widget.props.disabled=false;
    }
    //#region 初始化数据源
    initialization(e: NxZlwFormDetailComponent) {

        e.isRightReview = true; //禁用右键
        if (this.route.queryParams['value']['$open'] == FormOptions.$modify) {
            this.load();
        } else {
            this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteBillType')[0].widget.props.disabled=true;
            this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteNumber')[0].widget.props.disabled=true;
            setTimeout(() => {
                this.model.conditionPanel.data = {};
                this.detailInstance.cacheSearchData = {};
                e.model.conditionPanel.data['DataDate'] = new Date();
                //初始化的时候给一个值，这样是为了第一次选择的时候就能触发valuechange事件。
                e.model.conditionPanel.data['YHFarmerID']='';
                e.model.conditionPanel.data['QuoteBillType']='';
                e.model.conditionPanel.data['QuoteNumber']='';
                e.model.conditionPanel.data['QuoteNumericalOrder']='';
                e.model.conditionPanel.data['AccountType']='';
                e.model.conditionPanel.data['Remarks'] = '';
                e.cacheSearchData = deepCopy(e.model.conditionPanel.data);
                e.cacheSearchData = {
                    DataDate: new Date(),
                };
            }, 500);
        }
    }
    //#endregion

    // 列名映射（支持错误码动态列名称）
    get columnMap() {
        let result = this.columns.map((m) => {
            return {
                caption: m.props.caption,
                dataField: m.props.dataField,
            };
        });
        result.push(
            {caption:this.translator.I18N.dataGridOptions.remarks.text ,dataField:'Remarks'},
            { caption: this.translator.I18N.YHCashDeposit.DataDate.text, dataField: 'DataDate' },
            { caption: '养户姓名', dataField: 'YHFarmerID' },
            { caption: '类别', dataField: 'AccountType' },
            { caption: '关联单据号', dataField: 'QuoteNumber' },
            { caption: '资金账户', dataField: 'CapitalAccount' },
            { caption: '资金科目', dataField: 'CapitalSubject' },
            { caption: '关联单据类型', dataField: 'QuoteBillType' },
            { caption: this.translator.I18N.commonColumns.numericalOrder.text, dataField: 'NumericalOrder' },
            { caption: this.translator.I18N.commonColumns.number.text, dataField: 'Number' }

        );
        return result;
    }

    onPopupHiding(){
        this.checkId = '';
        this.checkReceiptApplyData=[];
        this.checkPaymentApplyData=[];
    }

    receiptApplyShow(){
        this.receiptApplyVisible=true;
        this.checkReceiptApplyData=[];
        this.checkPaymentApplyData=[];
        this.searchReceiptApply();
    }
    paymentApplyShow(){
        this.paymentApplyVisible=true;
        this.checkReceiptApplyData=[];
        this.checkPaymentApplyData=[];
        this.searchPaymentApply();
    }
    onCancel(){

        this.paymentApplyVisible = false;
        this.receiptApplyVisible = false;
        this.checkId = ''
    }

    onReceiptApplySure(){
        if(this.checkReceiptApplyData.length==0){
            Notify.toast('请选择一条明细！', NotifyType.Error);
            return false;
        }
        let data = this.farmerNameDataSource_receiptApply.filter(c=>c.YHFarmerID==this.checkReceiptApplyData.YHFarmerID ||c.CustomerID==this.checkReceiptApplyData.YHFarmerID||c.SupplierID==this.checkReceiptApplyData.YHFarmerID)
        if(data.length==0){
            Notify.toast('该交款单位不是养户！', NotifyType.Error);
            return false;
        }
        if(this.showQumber){
            this.onReceiptDateConfirm();
        }else{
            this.onReceiptApplyOk();
        }
        // this.checkId = ''
        // this.loading = true;
        // this.receiptApplyVisible = false;
        // // this.model.conditionPanel.data['DataDate'] = this.checkReceiptApplyData.DataDate;
        // this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='DataDate')[0].widget.props.disabled=true;
        // this.model.conditionPanel.data['YHFarmerID'] = this.checkReceiptApplyData.YHFarmerID;
        // this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='YHFarmerID')[0].widget.props.disabled=true;
        // this.model.conditionPanel.data['AccountType'] = '2201131702170001555'//收款
        // this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='AccountType')[0].widget.props.disabled=true;
        // this.model.conditionPanel.data['QuoteBillType'] =  '2201131629250003655';//收款单
        // this.model.conditionPanel.data['QuoteNumber'] = this.checkReceiptApplyData.Number;//关联单据号
        // if(this.showQumber){
        //     this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteNumber')[0].widget.props.disabled=false;
        // }else{
        //     this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteNumber')[0].widget.props.disabled=false;
        // }
        // // this.model.conditionPanel.data['Amount'] = this.checkReceiptApplyData.Amount;//金额
        // this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='Amount')[0].widget.props.disabled=true;
        // this.model.conditionPanel.data['QuoteNumericalOrder'] = this.checkReceiptApplyData.NumericalOrder;//关联单据流水号
        // this.model.conditionPanel.data['Remarks'] = this.checkReceiptApplyData.Remarks;//备注
        // setTimeout(() => {
        //     this.loading = false
        // }, 100);
    }
    onReceiptDateConfirm(){
        if(new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd') != new DateTime(this.checkReceiptApplyData.DataDate).toString('yyyy-MM-dd')){
            MessageBox.confirm(
                "收款日期和当前保证金收支日期不符，您确定覆盖吗？",
                '提示'
            ).then((require) => {
                if(require){
                    this.onReceiptAmountConfirm();
                }
            })
        }else{
            this.onReceiptAmountConfirm();
        }
    }
    onReceiptAmountConfirm(){
        if(this.model.conditionPanel.data['Amount'] != this.checkReceiptApplyData.Amount){
            MessageBox.confirm(
                "收款单金额和当前保证金收支金额不符，您确定覆盖吗？",
                '提示'
            ).then((require) => {
                if(require){
                    this.onReceiptApplyOk();
                }
            })
        }else{
            this.onReceiptApplyOk();
        }
    }
    onReceiptApplyOk(){
        this.checkId = ''
        this.loading = true;
        this.receiptApplyVisible = false;
        this.model.conditionPanel.data['DataDate'] = this.checkReceiptApplyData.DataDate;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='DataDate')[0].widget.props.disabled=true;
        this.model.conditionPanel.data['YHFarmerID'] = this.checkReceiptApplyData.YHFarmerID;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='YHFarmerID')[0].widget.props.disabled=true;
        this.model.conditionPanel.data['AccountType'] = '2201131702170001555'//收款
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='AccountType')[0].widget.props.disabled=true;
        this.model.conditionPanel.data['QuoteBillType'] =  '2201131629250003655';//收款单
        this.model.conditionPanel.data['QuoteNumber'] = this.checkReceiptApplyData.Number;//关联单据号
        if(this.showQumber){
            this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteNumber')[0].widget.props.disabled=false;
        }else{
            this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteNumber')[0].widget.props.disabled=false;
        }
        this.model.conditionPanel.data['Amount'] = this.checkReceiptApplyData.Amount;//金额
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='Amount')[0].widget.props.disabled=true;
        this.model.conditionPanel.data['QuoteNumericalOrder'] = this.checkReceiptApplyData.NumericalOrder;//关联单据流水号
        this.model.conditionPanel.data['Remarks'] = this.checkReceiptApplyData.Remarks;//备注
        setTimeout(() => {
            this.loading = false
        }, 100);
    }
    onPaymentApplySure(){

        if(this.checkPaymentApplyData.length==0){
            Notify.toast('请选择一条明细！', NotifyType.Error);
            return false;
        }
        let data = this.farmerNameDataSource_paymentApply.filter(c=>c.YHFarmerID==this.checkPaymentApplyData.YHFarmerID ||c.CustomerID==this.checkPaymentApplyData.YHFarmerID||c.SupplierID==this.checkPaymentApplyData.YHFarmerID)
        if(data.length==0){
            Notify.toast('该收款单位不是养户！', NotifyType.Error);
            return false;
        }
        if(this.showQumber){
            this.onPaymentDateConfirm();
        }else{
            this.onPaymentApplyOk();
        }
    }
    onPaymentDateConfirm(){
        if(new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd') != new DateTime(this.checkPaymentApplyData.DataDate).toString('yyyy-MM-dd')){
            MessageBox.confirm(
                "付款日期和当前保证金收支日期不符，您确定覆盖吗？",
                '提示'
            ).then((require) => {
                if(require){
                    this.onPaymentAmountConfirm();
                }
            })
        }else{
            this.onPaymentAmountConfirm();
        }
    }
    onPaymentAmountConfirm(){
        if(this.model.conditionPanel.data['Amount'] != this.checkPaymentApplyData.Amount){
            MessageBox.confirm(
                "付款单金额和当前保证金收支金额不符，您确定覆盖吗？",
                '提示'
            ).then((require) => {
                if(require){
                    this.onPaymentApplyOk();
                }
            })
        }else{
            this.onPaymentApplyOk();
        }
    }
    onPaymentApplyOk(){
        this.checkId = ''
        this.loading = true;
        this.paymentApplyVisible = false;
        this.model.conditionPanel.data['DataDate'] = this.checkPaymentApplyData.DataDate;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='DataDate')[0].widget.props.disabled=true;
        this.model.conditionPanel.data['YHFarmerID'] = this.checkPaymentApplyData.YHFarmerID;
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='YHFarmerID')[0].widget.props.disabled=true;
        this.model.conditionPanel.data['AccountType'] = '2201131702170001655'//收款
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='AccountType')[0].widget.props.disabled=true;
        this.model.conditionPanel.data['QuoteBillType'] =  '2201131629250003755';//收款单
        this.model.conditionPanel.data['QuoteNumber'] = this.checkPaymentApplyData.Number;//关联单据号
        if(this.showQumber){
            this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteNumber')[0].widget.props.disabled=false;
        }else{
            this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteNumber')[0].widget.props.disabled=false;
        }
        this.model.conditionPanel.data['Amount'] = this.checkPaymentApplyData.Amount;//金额
        this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='Amount')[0].widget.props.disabled=true;
        this.model.conditionPanel.data['QuoteNumericalOrder'] = this.checkPaymentApplyData.NumericalOrder;//关联单据流水号
        this.model.conditionPanel.data['Remarks'] = this.checkPaymentApplyData.Remarks;//备注
        setTimeout(() => {
            this.loading = false
        }, 100);
    }
    checkPaymentApply(e){
        if(this.checkId==e.row.data.NumericalOrder){
            this.checkId = '';
            this.checkReceiptApplyData=[];
            this.checkPaymentApplyData=[];
        }else{
            this.checkId= e.row.data.NumericalOrder;
            this.checkPaymentApplyData=e.row.data;
            this.checkReceiptApplyData=[];
        }
    }
    checkReceiptApply(e){
        if(this.checkId==e.row.data.NumericalOrder){
            this.checkId = '';
            this.checkReceiptApplyData=[];
            this.checkPaymentApplyData=[];
        }else{
            this.checkId= e.row.data.NumericalOrder;
            this.checkReceiptApplyData=e.row.data;
            this.checkPaymentApplyData=[];
        }
    }
    searchReceiptApply(){
        let filter = []
        if (this.searchdatereceipt[0] && this.searchdatereceipt[1]) {
            filter.push([
                ['DataDate', '>=', new Date(new Date(this.searchdatereceipt[0]).toLocaleDateString())],
                'and',
                [
                    'DataDate',
                    '<=',
                    new Date(new Date(new Date(this.searchdatereceipt[1]).getTime()).toLocaleDateString()),
                ],
            ]);
        } else {
            if (this.searchdatereceipt[0]) {
                filter.push(['DataDate', '>=', new Date(new Date(this.searchdatereceipt[0]).toLocaleDateString())]);
            }
            if (this.searchdatereceipt[1]) {
                filter.push([
                    'DataDate',
                    '<=',
                    new Date(new Date(new Date(this.searchdatereceipt[1]).getTime()).toLocaleDateString()),
                ]);
            }
        }
        if(this.ReceiptYHFarmerID){
            let data = this.farmerNameDataSource_receiptApply.filter(c=>c.YHFarmerID==this.ReceiptYHFarmerID);
            if(data){
                // filter.push(['YHFarmerID', '=', this.ReceiptYHFarmerID],'or',['YHFarmerID', '=', data[0].CustomerID],'or',['YHFarmerID', '=', data[0].SupplierID]);
                filter.push(['YHFarmerID', '=', this.ReceiptYHFarmerID]);
            }
        }
        if(this.ReceiptNumber){
            filter.push(['Number', 'contains', this.ReceiptNumber]);
        }
        if(this.ReceiptAbstract){
            filter.push(['ReceiptAbstractName', 'contains', this.ReceiptAbstract]);
        }
        if(this.ReceiptAmount){
            filter.push(['Amount', '=', this.ReceiptAmount]);
        }
        if(filter.length > 0){
            this.receiptApplyList.filter(filter)
        }else{
            this.receiptApplyList.filter('')
        }
        this.receiptApplyList.reload();
    }
    searchPaymentApply(){
        let filter = []
        if (this.searchdatepayment[0] && this.searchdatepayment[1]) {
            filter.push([
                ['DataDate', '>=', new Date(new Date(this.searchdatepayment[0]).toLocaleDateString())],
                'and',
                [
                    'DataDate',
                    '<=',
                    new Date(new Date(new Date(this.searchdatepayment[1]).getTime()).toLocaleDateString()),
                ],
            ]);
        } else {
            if (this.searchdatepayment[0]) {
                filter.push(['DataDate', '>=', new Date(new Date(this.searchdatepayment[0]).toLocaleDateString())]);
            }
            if (this.searchdatepayment[1]) {
                filter.push([
                    'DataDate',
                    '<=',
                    new Date(new Date(new Date(this.searchdatepayment[1]).getTime()).toLocaleDateString()),
                ]);
            }
        }
        if(this.PaymentYHFarmerID){
            let data = this.farmerNameDataSource_paymentApply.filter(c=>c.YHFarmerID==this.PaymentYHFarmerID);
            if(data){
                // filter.push(['YHFarmerID', '=', this.PaymentYHFarmerID],'or',['YHFarmerID', '=', data[0].CustomerID],'or',['YHFarmerID', '=', data[0].SupplierID]);
                filter.push(['YHFarmerID', '=', this.PaymentYHFarmerID]);
            }
        }
        if(this.PaymentNumber){
            filter.push(['Number', 'contains', this.PaymentNumber]);
        }
        if(this.PaymentAbstract){
            filter.push(['ReceiptAbstractName', 'contains', this.PaymentAbstract]);
        }
        if(this.PaymentAmount){
            filter.push(['Amount', '=', this.PaymentAmount]);
        }

        if(filter.length > 0){
            this.paymentApplyList.filter(filter)

        }else{
            this.paymentApplyList.filter('')
        }
        this.paymentApplyList.reload()
    }

    load(){
        this.service
        .getCustomDataSourceById(this.numericalOrder)
        .load()
        .then((value: Array<any>) => {
            this.loading=true;
            value.map((m)=>{
                m.target = DataStatus.none
            })
            this.model.dataGrid.props.dataSource = [];
            this.model.conditionPanel.data = value[0];
            this.model.review.visible = true;
            this.model.review.numericalOrder = this.numericalOrder;
            this.model.review.ownerName = value[0].CreatedOwnerName;
            this.detailInstance.$open = FormOptions.$modify;
            this.model.conditionPanel.data['QuoteNumber'] = value[0].QuoteNumber;
            setTimeout(() => {
                //如果引入其他单据，要禁用下面两个字段
                if(this.model.conditionPanel.data['QuoteNumber']){
                    this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='YHFarmerID')[0].widget.props.disabled=true;
                    this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteBillType')[0].widget.props.disabled=true;
                    this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='AccountType')[0].widget.props.disabled=true;
                    this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='Amount')[0].widget.props.disabled=true;
                }
                // //一旦保存，类别就不可以修改了
                // this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='AccountType')[0].widget.props.disabled=true;
                // this.model.conditionPanel.conditionItems.filter(x=>x.dataField=='QuoteBillType')[0].widget.props.disabled=true;
                if(this.model.conditionPanel.data['AccountType'] == '2201131702170000655'){
                    (<NxButton>this.model.toolbar.getWidgetByKey('delete')).props.disabled = true;
                }
                this.detailInstance.cacheSearchData = deepCopy(value[0]);
                this.loading=false;
            }, 100);
        })
    }

    //跳转模板
    jump() {
        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=保证金收支`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=保证金收支`
                );
            }
        );
    }
    //自定义打印
    getSource(e) {
        if (e.status) {
            var tabId0 = {
                //日期
                DataDate: new DateTime(this.model.conditionPanel.data['DataDate']).toString(),
                //养户
                YHFarmerName:  this.model.conditionPanel.data['YHFarmerName'] == undefined ? '': this.model.conditionPanel.data['YHFarmerName'],
                //批次
                YHBatchName:  this.model.conditionPanel.data['YHBatchName'] == undefined ? '': this.model.conditionPanel.data['YHBatchName'],
                //收支类型
                AccountTypeName:this.model.conditionPanel.data['AccountTypeName'] == undefined ? '': this.model.conditionPanel.data['AccountTypeName'],
                //金额
                Amount:this.model.conditionPanel.data['Amount'] == undefined ? '': this.model.conditionPanel.data['Amount'],
                //关联单号
                QuoteNumber:this.model.conditionPanel.data['QuoteNumber'] == undefined ? '': this.model.conditionPanel.data['QuoteNumber'],
                //关联单据
                QuoteBillType:this.model.conditionPanel.data['QuoteBillType'] == undefined ? '': this.model.conditionPanel.data['QuoteBillType'],
                //单位
                EnterpriseName:USER_INFO_CONTEXT.enterpriseName,
                // 单据号
                Number:this.model.conditionPanel.data['Number'] == undefined ? '': this.model.conditionPanel.data['Number'],
                // 说明
                Remarks:this.model.conditionPanel.data['Remarks'] == undefined ? '': this.model.conditionPanel.data['Remarks'],
                // 制单人
                creatorName: this.model.review.ownerName || '',
                // 审核人
                auditerName: this.model.review.reviewName || '',
            };
            let sources = {
                tabId0: tabId0
            };
            var direct =false;
            if (e.isDirect) {
                direct = true;
            }
            this._printPage.instance.printGeneration(sources, false, false, null, { isDirect: direct,});
        }
    }
}
