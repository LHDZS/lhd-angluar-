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
import { NxConditionItem, NxSearchPanel } from 'src/app/components/search-panel/search-panel-extend';
import { NxDataGridSummaryTotal } from 'src/app/components/component-model/data-grid/summary/model';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxDataGridColumnValidationRule } from 'src/app/components/component-model/data-grid/columns/validation-rule/model';
import {
    FormOptions,
    DataDictionary
} from 'src/app/providers/enums';
import { TranslateService } from 'src/app/providers/i18n-translate';

import { RegExps } from 'src/app/providers/regexp';
import { USER_GUIDE_CONTEXT, USER_INFO_CONTEXT } from 'src/app/providers/context';
import { ContractModel, ContractDetailModel } from '../contract.model';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { Notify, NotifyType, MessageBox } from 'src/app/providers/notify';
import { ContractService } from '../contract.service';
// import { DataStatus } from 'src/app/components/editor-grid/util/index';
import { DxDataGridComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { EditorGridComponent } from 'src/app/components/editor-grid';
import { EditorGridUtils } from 'src/app/components/editor-grid';
import { DataValidator, ValidationType } from 'src/app/providers/common/dataValidator';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import Guid from 'devextreme/core/guid';
import { padStart } from 'ng-zorro-antd';
import { environment } from 'src/environments/environment';
import dxSelectBox from 'devextreme/ui/select_box';
import { NxToolbarPanel } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxHeaderSearchPanelComponent } from 'src/app/components/header-search-panel/header-search-panel.component';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';

@Component({
    selector: 'app-contract-create',
    templateUrl: './contract-create.component.html',
    styleUrls: ['./contract-create.component.scss'],
})
export class ContractCreateComponent implements OnInit {
    $option: any;
    
    NumericalOrder: string;

    //消息盒子
    messageBoxVisible: boolean = false;

    messageBoxInfo: Array<any> = [];

    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;

    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;

    //单据状态
    $AllowSave: boolean = true;

    $deleted: boolean = false;
    $loading: boolean = false;

    //数据
    formdata: any = {};

    HtmlText:string = "";

    FarmerDataSource = this.service.getYHFarmerDataSource();

    ConcertPeopleSource: any[] = [];

    //组件模型
    toolBarPanelModel = new NxToolbarPanel('detail');   //工具栏
    @ViewChild("toolbarPanel", { static: false })
    toolbarPanel: NxToolbarPanelComponent;

    headConditionPanel = new NxSearchPanel();   //表头信息栏
    @ViewChild("searchPanel", { static: false })
    test: NxHeaderSearchPanelComponent;

    dataGridModel: NxDataGrid = new NxDataGrid();   //养殖场地信息表
    @ViewChild("dataGrid", { static: false })
    areaDataGrid: NxFormListComponent;

    agreementConditionPanel = new NxSearchPanel();  //物料约定栏

    //养殖合同（文本编辑器工具栏设置）
    HtmlToolItems: any[] = [
        { formatName: "undo"},
        { formatName: "redo"},
        { formatName: "separator"},
        {
            formatName: "size",
            formatValues: ['8pt', '10pt', '12pt', '14pt', '18pt', '24pt', '36pt']
        },
        {
            formatName: "font",
            formatValues: [
                'Arial',
                'Courier New',
                'Georgia',
                'Impact',
                'Lucida Console',
                'Tahoma',
                'Times New Roman',
                'Verdana'
            ]
        },
        { formatName: "separator"},
        { formatName: "bold"},
        { formatName: "italic"},
        { formatName: "strike"},
        { formatName: "underline"},
        { formatName: "separator"},
        { formatName: "alignLeft"},
        { formatName: "alignCenter"},
        { formatName: "alignRight"},
        { formatName: "alignJustify"},
        { formatName: "separator"},
        { formatName: "orderedList"},
        { formatName: "bulletList"},
        { formatName: "separator"},
        {
            formatName: "header",
            formatValues: [false, 1, 2, 3, 4, 5]
        },
        { formatName: "separator"},
        { formatName: "color"},
        { formatName: "background"},
        { formatName: "separator"},
        { formatName: "link"},
        { formatName: "image"},
        { formatName: "separator"},
        { formatName: "clear"},
        { formatName: "codeBlock"},
        { formatName: "blockquote"},
        { formatName: "separator"},
        { formatName: "insertTable"},
        { formatName: "deleteTable"},
        { formatName: "insertRowAbove"},
        { formatName: "insertRowBelow"},
        { formatName: "deleteRow"},
        { formatName: "insertColumnLeft"},
        { formatName: "insertColumnRight"},
        { formatName: "deleteColumn"},
    ]

    htmlText: any = '';

    uploader:NxUploader=new NxUploader();
    permission: PermissionService = new PermissionService();
    uploadUrl: string = environment.nxinfileServerUrl;
    fileList: FileInfo[] = [];

    //养殖地区弹出框
    outVisible: boolean = false;

    raisingFarmDataSource: any = [];
    raisingFarmDataSourceAll: any = [];

    $form: boolean = false;

    outFormData: any = {};

    ChickenFarmSource: any;
    ZoningSource: any;
    selectedRows: any = [];

    @ViewChild("gridRef", { static: false })
    henhouseDataGrid: DxDataGridComponent;



    constructor(
        private route: ActivatedRoute,
        private qlwOdataContext: QlwODataContext,
        private service: ContractService,
        private basicSettingODataContext: BasicSettingODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private productODataContext: ProductODataContext,
        private USER_GUIDE: USER_GUIDE_CONTEXT,
        private translator: TranslateService,
        public changeDetectorRef: ChangeDetectorRef
    ) {
        // this.BatchID = this.route.queryParams['value']['BatchID'];
        this.$option = this.route.queryParams['value']['$option'];
        this.NumericalOrder = `${this.route.queryParams['value']['NumericalOrder'] || 0}`;
        
        this.init_toolbar_panel().init_head_condition_panel().init_area_grid().init_agreement_condition_panel().init_uploader();
        
        this.initialization();
    }

    //#region 初始化
    ngOnInit(): void {
        
    }

    get SaveStatus(){
        return this.$AllowSave;
    }

    set SaveStatus(value: boolean){
        if (this.$deleted || this.$loading) value = false;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('save')).props.disabled = !value;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('cancel')).props.disabled = !value;
        this.$AllowSave = value;
    }

    /**消息盒子 */
    get messageBox() {
        let _this = this;
        return {
            show(message?) {
                _this.messageBoxVisible = true;

                if (message) {
                    if (message instanceof Array) {
                        _this.messageBoxInfo = message;
                        if (_this.toolbarPanel) {
                            _this.toolbarPanel.model.getOtherWidgetByKey('messageBox').props.text = `${message.length}`;
                        }
                    }
                }
            },
            clear() {
                _this.messageBoxInfo = [];
                if (_this.toolbarPanel) {
                    _this.toolbarPanel.model.getOtherWidgetByKey('messageBox').props.text = `0`;
                }
            },
            hide() {
                _this.messageBoxVisible = false;
            },
            get info(): string[] {
                return _this.messageBoxInfo;
            },
            get infoNums(): number {
                return _this.messageBoxInfo.length;
            },
            get visible(): boolean {
                return _this.messageBoxVisible;
            },
        };
    }

    modifiedStatus() {
        this.SaveStatus = true;
    }

    initialization() {
        setTimeout(()=>{
            if(this.$option==FormOptions.$create){
                this.create();
            }
            else if (this.$option==FormOptions.$modify){
                this.modify();
            }
        }, 1000)
    }

    //新增入口
    create() {
        this.$loading = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('create')).props.disabled = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('delete')).props.disabled = true;
        this.areaDataGrid.$deletedData = [];

        this.formdata = {};
        this.headConditionPanel.data = this.formdata;
        this.agreementConditionPanel.data = this.formdata;
        
        this.formdata.DataDate = "";
        this.formdata.BeginDate = null;
        this.formdata.EndDate = null;
        this.formdata.YHFarmerID = "";
        this.formdata.ContractNo = "";
        this.formdata.Remarks = "";
        this.formdata.ChickAbstract = "";
        this.formdata.DrugAbstract = "";
        this.formdata.FeedAbstract = "";
        this.formdata.ConcertPerson = "";
        this.formdata.ContractDetail = [];
        
        this.FarmerDataSource.filter([
            ['Status', '=', true]
        ]);

        this.dataGridModel.props.dataSource = this.formdata.ContractDetail;

        let recentData = this.service.getDataSource();
        recentData.sort({ selector: "CreatedDate", desc: true });
        recentData.load().then(res => {
            if(res.length > 0){
                this.formdata.ChickAbstract = res[0].ChickAbstract;
                this.formdata.DrugAbstract = res[0].DrugAbstract;
                this.formdata.FeedAbstract = res[0].FeedAbstract
            }
        })

        this.SaveStatus = false;
        setTimeout(()=>{
            this.$loading = false;
        }, 1000)
    }

    //修改入口
    modify(){
        this.$loading = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('create')).props.disabled = false;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('delete')).props.disabled = false;
        var params = `$filter=(NumericalOrder eq + '${this.NumericalOrder}')&$orderby=RecordID`;
        this.areaDataGrid.$deletedData = [];
        
        this.service.byKey(<any>params).then((res: any) => {
            this.formdata = deepCopy(res.value[0]);
            this.formdata.ConcertPerson = this.formdata.ConcertPerson == "0" ? null : this.formdata.ConcertPerson;
            //读取养殖栋舍数据
            this.formdata.ContractDetail = deepCopy(res.value);
            this.formdata.ContractDetail.map(r => {
                r.ChickenFarmID = r.hChickenFarmID;
                r.ZoningID = r.hZoningID;
                r.HenhouseID = r.hHenhouseID;
                r.target = DataStatus.none;
            })
            //设置养户数据源
            this.FarmerDataSource.filter([
                [['Status', '=', true], 'or', ['YHFarmerID', '=', this.formdata.YHFarmerID]]
            ]);
            //设置一致行动人数据源
            this.service.GetFarmerConcertPeople(this.formdata.YHFarmerID).then(res => {
                console.log(res);
                if(res)
                {
                    this.ConcertPeopleSource.push(...(<Array<any>>res).filter(p => {
                        p.id = p.id.toString();
                        return p;
                    }));
                }
            });
            //表单数据绑定
            this.headConditionPanel.data = this.formdata;
            this.agreementConditionPanel.data = this.formdata;
            this.dataGridModel.props.dataSource = this.formdata.ContractDetail;
        });
        this.SaveStatus = false;
        setTimeout(()=>{
            this.$loading = false;
        }, 1000);
    }

    deletedStatus(){
        this.$option = FormOptions.$create;
        this.$deleted = true;
        this.NumericalOrder = '0';
        this.create();
    }

    saveDataAfterStatus() {
        this.$option = FormOptions.$modify;
        this.modify();
    }

    checkRequired() {
        let data = this.getSaveData();
        
        //数据校验列表
        let checkList = [
            'DataDate',
            'YHFarmerID',
            'BeginDate',
            'EndDate',
            'ContractNo',
            'ChickAbstract',
            'FeedAbstract',
            'DrugAbstract'
        ];

        //养殖场地信息
        let areaCheckList = [
            'ChickenFarmID',
            'HenhouseID',
            'StartDate',
            'EndDate'
        ]
        
        let isAll = true;

        let errorMessages = []

        for(let prop of checkList) {
            if(data[prop] == null || data[prop] == undefined || data[prop] == '') {
                isAll = false;
                errorMessages.push(`${this.translator.I18N.YHFarmerContract[prop].text} 未填`)
            }
        }

        let rowIndex = 0;
        for(let row of data.HenhouseDetailDtos){
            rowIndex++;
            for(let prop of areaCheckList) {
                if(row[prop] === null || row[prop] === undefined || row[prop] == '') {
                    isAll = false;
                    errorMessages.push(`养殖场地信息：第 ${rowIndex} 行：${this.translator.I18N.YHFarmerContractHenhouseDetail[prop].text} 未填`);
                }
            }

            if(new DateTime(this.formdata.BeginDate)>new DateTime(row.StartDate.toString()) 
                || new DateTime(this.formdata.EndDate)<new DateTime(row.EndDate.toString())){
                isAll = false;
                errorMessages.push(`养殖场地信息：第 ${rowIndex} 行：开始结束日期超出本合同的有效期间，保存失败！`);
            }
        }

        if(data.HenhouseDetailDtos.filter(r => r.Target != DataStatus.deleted).length <= 0){
            isAll = false;
            errorMessages.push(`请添加养殖场地信息！`)
        }

        if(!isAll) this.messageBox.show(errorMessages);

        return isAll; //isAll;
    }

    getSaveData(){
        var data = new ContractModel();
        data.NumericalOrder = this.NumericalOrder || "0";
        data.DataDate = this.formdata.DataDate;
        data.BeginDate = this.formdata.BeginDate;
        data.EndDate = this.formdata.EndDate;
        data.YHFarmerID = this.formdata.YHFarmerID;
        data.ContractNo = this.formdata.ContractNo;
        data.Remarks = this.formdata.Remarks || "";
        data.DrugAbstract = this.formdata.DrugAbstract;
        data.FeedAbstract = this.formdata.FeedAbstract;
        data.ChickAbstract = this.formdata.ChickAbstract;
        data.ComboPack = this.formdata.ComboPack || DataDictionary.ComboPackA;
        data.ChickenFarmID = this.formdata.ChickenFarmID || USER_INFO_CONTEXT.childId;
        data.ConcertPerson = this.formdata.ConcertPerson || "0";
        data.FilesDto = this.fileList;
        
        let UpdateList = [];
        UpdateList.push(...this.formdata.ContractDetail)
        if(this.$option == FormOptions.$modify) {
            UpdateList.push(...this.areaDataGrid.$deletedData);
        }
        for(let detail of UpdateList){
            var isEmpty:boolean = true;
            for(let prop of Object.keys(detail)){
                if(prop == this.dataGridModel.primaryKey || prop == 'target') continue;

                if(detail[prop] != null && detail[prop] != '' && detail[prop] != undefined){
                    isEmpty = false;
                }
            }

            if(isEmpty) {continue};

            var detailDto = new ContractDetailModel();
            detailDto.NumericalOrder = this.NumericalOrder || "0";
            detailDto.NumericalOrderDetail = detail.NumericalOrderDetail || "0";
            detailDto.ChickenFarmID = detail.ChickenFarmID;
            detailDto.HenhouseID = detail.HenhouseID;
            detailDto.ZoningID = detail.ZoningID;
            detailDto.EnterpriseID = detail.EnterpriseID || USER_INFO_CONTEXT.enterpriseId;
            detailDto.Remarks = detail.hRemarks || '';
            detailDto.Target = detail.target;

            detailDto.StartDate = detail.hStartDate;
            detailDto.EndDate = detail.hEndDate;

            data.HenhouseDetailDtos.push(detailDto);
        }

        return data;
    }
    //#endregion

    //#region 工具栏
    init_toolbar_panel(): ContractCreateComponent{
        this.toolBarPanelModel.checkInfo.visible = false;
        this.toolBarPanelModel.moreButton.props.visible = false;
        this.toolBarPanelModel.moreButton.props.disabled = true;
        this.toolBarPanelModel.getOtherWidgetByKey('headSetting').props.visible = false;
        // this.toolBarPanelModel.getOtherWidgetByKey('filterRow').props.visible = false;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('create')).events.onClick = this.add.bind(this);
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('create')).props.disabled = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('save')).props.disabled = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('cancel')).props.disabled = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('delete')).props.disabled = true;
        (<NxButton>this.toolBarPanelModel.getOtherWidgetByKey('messageBox')).events.onClick = () => {
            this.messageBoxVisible = !this.messageBoxVisible;
        }
        

        return this;
    }

    save(){
        this.areaDataGrid.dataGrid.instance.saveEditData();
        if(!this.checkRequired()) return;

        this.SaveStatus = false;
        
        if(this.$option == FormOptions.$create){
            const data = this.getSaveData();
            if (data) {
                this.service.post(data).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    console.log(response);
                    if (response.status) {
                        Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                        this.NumericalOrder = result.data.NumericalOrder;
                        this.saveDataAfterStatus();
                    } else {
                        // Notify.toast(response.message, NotifyType.Error);
                        // this.detailInstance.saveDataError();
                        this.SaveStatus = true;
                        this.messageBox.show(response.message);
                        // this.detailInstance.saveDataError();
                    }
                })
                .catch(()=>{
                    this.SaveStatus = true;
                });
            }
        }
        else {
            const data = this.getSaveData();
            if (data) {
                this.service.put(data).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    console.log(response);
                    if (response.status) {
                        Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                        this.NumericalOrder = result.data.NumericalOrder;
                        this.saveDataAfterStatus();
                    } else {
                        // Notify.toast(response.message, NotifyType.Error);
                        // this.detailInstance.saveDataError();
                        this.SaveStatus = true;
                        this.messageBox.show(response.message);
                        // this.detailInstance.saveDataError();
                    }
                })
                .catch(()=>{
                    this.SaveStatus = true;
                });
            }
        }
    }

    delete(){
        MessageBox.confirm(
            this.translator.I18N.commandOptions.delete.confirm,
            this.translator.I18N.commandOptions.delete.confirmTitle
        ).then((require) => {
            if (require) {
                this.service.delete(this.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.toast(this.translator.I18N.commandOptions.delete.success, NotifyType.Success);
                        this.deletedStatus();
                    } else {
                        // Notify.toast(response.message, NotifyType.Error);
                        this.messageBox.show(response.message);
                        // this.detailInstance.saveDataError();
                    }
                });
            }
        });
    }

    add(){
        this.$option = FormOptions.$create;
        this.create();
    }

    cancel(){
        this.areaDataGrid.dataGrid.instance.cancelEditData();
        this.initialization();
    }
    //#endregion

    //#region 表头
    init_head_condition_panel(): ContractCreateComponent{
        this.headConditionPanel.default = false;

        //建档日期
        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.headVisible = true;
        condition_date.requiredDisable = true;
        condition_date.label = this.translator.I18N.YHFarmerContract.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        // condition_date.widget.props.max = new Date();

        //养户名称
        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.YHFarmerContract.YHFarmerName.text;
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.required = true;
        condition_YHFarmerID.widget = new NxSelectBox();
        condition_YHFarmerID.widget.props.showClearButton = true;
        condition_YHFarmerID.widget.props.dataSource = this.FarmerDataSource;
        condition_YHFarmerID.widget.props.valueExpr = "YHFarmerID";
        condition_YHFarmerID.widget.props.displayExpr = "YHFarmerName";
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerName', 'YHPersonName', 'Phone', 'MnemonicCode'];
        condition_YHFarmerID.widget.events.onValueChanged = (e) => {
            condition_ConcertPerson.widget.props.disabled = !e;
            this.formdata.ConcertPerson = null;

            if(e)
            {
                this.service.GetFarmerConcertPeople(e).then(res => {
                    if(res)
                    {
                        (<NxSelectBox>condition_ConcertPerson.widget).props.dataSource = (<Array<any>>res).filter(p => {
                            p.id = p.id.toString();
                            return p;
                        });
                    }
                    else
                    {
                        (<NxSelectBox>condition_ConcertPerson.widget).props.dataSource = [];
                    }
                });
                // (<NxSelectBox>condition_ConcertPerson.widget).props.dataSource;
            }
            else
            {
                (<NxSelectBox>condition_ConcertPerson.widget).props.dataSource = [];
            }
        }

        //生效日期
        const condition_beginDate = new NxConditionItem();
        condition_beginDate.required = true;
        condition_beginDate.headVisible = true;
        condition_beginDate.requiredDisable = true;
        condition_beginDate.label = this.translator.I18N.YHFarmerContract.BeginDate.text;
        condition_beginDate.type = 'DateBox';
        condition_beginDate.dataField = 'BeginDate';
        condition_beginDate.widget = new NxDateBox();
        condition_beginDate.widget.props.disabled = false;
        condition_beginDate.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_beginDate.widget.props.type = 'date';
        condition_beginDate.widget.events.onValueChanged = (value) => {
            if(this.formdata.EndDate && value > this.formdata.EndDate){
                this.formdata.EndDate = null
            }
        }

        //截止日期
        const condition_endDate = new NxConditionItem();
        condition_endDate.required = true;
        condition_endDate.headVisible = true;
        condition_endDate.requiredDisable = true;
        condition_endDate.label = this.translator.I18N.YHFarmerContract.EndDate.text;
        condition_endDate.type = 'DateBox';
        condition_endDate.dataField = 'EndDate';
        condition_endDate.widget = new NxDateBox();
        condition_endDate.widget.props.disabled = false;
        condition_endDate.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_endDate.widget.props.type = 'date';
        condition_endDate.widget.events.onValueChanged = (value) => {
            if(this.formdata.BeginDate && value < this.formdata.BeginDate){
                this.formdata.BeginDate = null
            }
        }
        
        //合同编号
        const condition_number = new NxConditionItem();
        condition_number.label = this.translator.I18N.YHFarmerContract.ContractNo.text;
        condition_number.required = true;
        condition_number.requiredDisable = true;
        condition_number.widget = new NxTextBox();
        condition_number.widget.props.placeholder = "合同编号";
        condition_number.type = 'TextBox';
        condition_number.dataField = 'ContractNo';
        condition_number.headVisible = true;
        
        //备注
        const condition_Remarks = new NxConditionItem();
        condition_Remarks.label = this.translator.I18N.YHFarmerContract.Remarks.text;
        condition_Remarks.requiredDisable = true;
        condition_Remarks.widget = new NxTextBox();
        condition_Remarks.type = 'TextBox';
        condition_Remarks.dataField = 'Remarks';
        condition_Remarks.headVisible = true;

        //一致行动人
        const condition_ConcertPerson = new NxConditionItem();
        condition_ConcertPerson.label = this.translator.I18N.YHFarmerContract.ConcertPerson.text;
        condition_ConcertPerson.type = 'SelectBox';
        condition_ConcertPerson.dataField = 'ConcertPerson';
        condition_ConcertPerson.required = false;
        condition_ConcertPerson.widget = new NxSelectBox();
        condition_ConcertPerson.widget.props.showClearButton = true;
        condition_ConcertPerson.widget.props.dataSource = this.ConcertPeopleSource;
        condition_ConcertPerson.widget.props.valueExpr = "id";
        condition_ConcertPerson.widget.props.displayExpr = "name";
        // condition_ConcertPerson.widget.props.searchExpr = ['YHFarmerName', 'YHPersonName', 'Phone'];

        this.headConditionPanel.conditionItems.push(
            condition_date,
            condition_YHFarmerID,
            condition_beginDate,
            condition_endDate,
            condition_number,
            condition_Remarks,
            condition_ConcertPerson
        );

        this.headConditionPanel.conditionItems.map((m) => {
            switch (m.type) {
                case 'TextBox':
                    (<NxTextBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                    break;
                case 'DateBox':
                    (<NxDateBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                    break;
                case 'SelectBox':
                    (<NxSelectBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                case 'RadioGroup':
                    (<NxSelectBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                case 'NumberBox':
                    (<NxNumberBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                    break;
            }
        });
        
        return this;
    }
    //#endregion

    //#region 养殖场地信息(表格)
    init_area_grid(): ContractCreateComponent {
        this.dataGridModel.type = "detail";
        this.dataGridModel.stateStoring.storageKey = 'contract-create';
        this.dataGridModel.stateStoring.enabled = true;
        this.dataGridModel.primaryKey = 'NumericalOrderDetail';
        this.dataGridModel.columns.push(...this.columns);
        this.dataGridModel.events.onCellClick = this.handleCell.bind(this);
        this.dataGridModel.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);
        this.dataGridModel.editing.enabled = true;
        this.dataGridModel.summary.enabled = true;
        this.dataGridModel.editing.allowUpdating = true;
        this.dataGridModel.selection.enabled = false;
        this.dataGridModel.commandColumn.addRowButton.statusCtrl = this.modifiedStatus.bind(this);
        this.dataGridModel.commandColumn.deleteButton.onClick = this.modifiedStatus.bind(this);
        this.dataGridModel.commandAddRow.visible = false;
        this.ChickenFarmSource = this.service.getChickenFarmDataSource();
        this.dataGridModel.commandRow.visible = false;

        

        const summaryItem_total_iCount = new NxDataGridSummaryTotal();
        summaryItem_total_iCount.column = 'iCount';
        summaryItem_total_iCount.summaryType = 'sum';
        summaryItem_total_iCount.valueFormat = '0';
        
        const summaryItem_total_Area = new NxDataGridSummaryTotal();
        summaryItem_total_Area.column = 'AreaSize';
        summaryItem_total_Area.summaryType = 'sum';
        summaryItem_total_Area.valueFormat = '2';

        this.dataGridModel.summary.totalItems = [
            summaryItem_total_iCount,
            summaryItem_total_Area
        ];
        this.dataGridModel.paginate.pager.visible = 'auto';
        return this;
    }

    get columns() {
        
        
        //场
        const col_ChickenFarmID = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContractHenhouseDetail.ChickenFarmID.text,
            'ChickenFarmID',
            'String'
        )
        // col_ImmuneSubjectID.props.width = 230;
        // col_ChickenFarmID.props.alignment = 'center';
        col_ChickenFarmID.props.HeaderRequiredIcon = true;
        col_ChickenFarmID.props.allowEditing = false;
        col_ChickenFarmID.props.lookup.enabled = true;
        col_ChickenFarmID.props.lookup.dataSource = this.basicSettingODataContext.getBizChickenFarmGroupDataSource({
            select: ['ChickenFarmID', 'ChickenFarmName']
        });
        col_ChickenFarmID.props.lookup.valueExpr = 'ChickenFarmID';
        col_ChickenFarmID.props.lookup.displayExpr = 'ChickenFarmName';
        
        //区
        const col_ZoningID = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContractHenhouseDetail.ZoningID.text,
            'ZoningID',
            'String'
        )
        // col_ImmuneSubjectID.props.width = 230;
        // col_ZoningID.props.alignment = 'center';
        col_ZoningID.props.HeaderRequiredIcon = false;
        col_ZoningID.props.allowEditing = false;
        col_ZoningID.props.lookup.enabled = true;
        col_ZoningID.props.lookup.dataSource = this.basicSettingODataContext.getYzcZoningDataSource({
            select: ['ZoningID', 'ZoningName'],
        });
        col_ZoningID.props.lookup.valueExpr = 'ZoningID';
        col_ZoningID.props.lookup.displayExpr = 'ZoningName';
        
        //栋
        const col_HenhouseID = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContractHenhouseDetail.HenhouseID.text,
            'HenhouseID',
            'String'
        )
        // col_ImmuneSubjectID.props.width = 230;
        col_HenhouseID.props.alignment = 'center';
        col_HenhouseID.props.HeaderRequiredIcon = true;
        col_HenhouseID.props.allowEditing = false;
        col_HenhouseID.props.lookup.enabled = true;
        col_HenhouseID.props.lookup.dataSource = this.basicSettingODataContext.getZqHenhouseGroupDataSource({
            select: ['HenHouseID', 'HenHouseName']
        });
        col_HenhouseID.props.lookup.valueExpr = 'HenHouseID';
        col_HenhouseID.props.lookup.displayExpr = 'HenHouseName';
        
        //容量(只)
        const col_iCount = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContractHenhouseDetail.iCount.text,
            'iCount',
            'number'
        )
        // col_DaysWeek.props.width = 60;
        col_iCount.props.alignment = 'right';
        col_iCount.props.allowEditing = false;
        // col_DaysWeek.props.setCellValue = (newData, value, oldData) => {
        //     if (true) {
        //         (<Array<any>>this.dataGridModel.props.dataSource).map((m) => {
        //             if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
        //                 m['DaysWeek'] = value;
        //                 delete m['DaysOld'];
        //             }
        //         });
        //     }
        // };
        
        //面积
        const col_AreaSize = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContractHenhouseDetail.AreaSize.text,
            'AreaSize',
            'number'
        )
        // col_ImmuneSubjectID.props.width = 230;
        col_AreaSize.props.alignment = 'right';
        col_AreaSize.props.allowEditing = false;
        col_AreaSize.props.HeaderRequiredIcon = false;

        const col_AreaID = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContractHenhouseDetail.AreaID.text,
            "AreaID",
            "string",
            'AreaName'
        )
        col_AreaID.props.allowEditing = false;
        

        const col_location = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContractHenhouseDetail.FullAddress.text,
            "FullAddress",
            "string"
        )
        col_location.props.allowEditing = false;
        
        const col_StartDate = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContract.BeginDate.text,
            "hStartDate",
            "date"
        );
        col_StartDate.props.HeaderRequiredIcon = true;
        col_StartDate.props.format = 'yyyy/MM/dd';
        col_StartDate.props.alignment = 'center';
        
        const col_EndDate = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContract.EndDate.text,
            "hEndDate",
            "date"
        );
        col_EndDate.props.HeaderRequiredIcon = true;
        col_EndDate.props.format = 'yyyy/MM/dd';
        col_EndDate.props.alignment = 'center';
        

        const col_Remarks = new NxDataGridColumn(
            this.translator.I18N.YHFarmerContractHenhouseDetail.Remarks.text,
            "hRemarks",
            "string"
        )
        col_location.props.allowEditing = false;


        return [
            col_ChickenFarmID,
            col_ZoningID,
            col_HenhouseID,
            col_iCount,
            col_AreaSize,
            col_StartDate,
            col_EndDate,
            col_Remarks,
            col_AreaID,
            col_location,
        ]
    }

    onPopupHiding() {
        this.outVisible = false;
        this.raisingFarmDataSource = [];
        // this.AutoDataSource = [];
    }

    _onFieldDataChanged(e) {
        
        // if (e.dataField == 'ChickenFarmID') {
        //     if(e.value) {
        //         this.service.GetHenhousesByChickenFarmID(e.value).then((res: any) => {
        //             this.raisingFarmDataSource = [];
        //             var AllHenhouses: Array<any> = res.data[0].Details;  //返回的所有栋舍ID
        //             var Henhouses = []; //当前所有栋舍ID
        //             var dataSource:any = this.dataGridModel.props.dataSource;

        //             dataSource.forEach(row => {
        //                 Henhouses.push(row.HenhouseID)
        //             })

        //             AllHenhouses.forEach(row => {
        //                 if(Henhouses.indexOf(row.HenHouseID) == -1){
        //                     this.raisingFarmDataSource.push(row);
        //                 }
        //             })

        //             this.raisingFarmDataSource.map((r:any) => {
        //                 r.HenhouseID = r.HenHouseID;
        //                 r.HenhouseName = r.HenHouseName;
        //                 r.AreaID = res.data[0].AreaID;
        //                 r.FullAddress = res.data[0].FullAddress;
        //                 this.service.address(Number(res.data[0].AreaID), 1).then((rs: any) => {
        //                     if (rs.data.length) {
        //                         let axis = rs.data[0].fullName;
        //                         r.AreaFullName = axis;
        //                     }
        //                 })
        //             })
        //         })
        //     }
        //     else {
        //         this.raisingFarmDataSource = [];
        //     }
        // }
    }

    search(){
        if (this.outFormData.ChickenFarmID){
            //场区
            this.ZoningSource = this.basicSettingODataContext.getYzcZoningDataSource({
                filter:[['FarmID','=',this.outFormData.ChickenFarmID]],
                select: ['ZoningID', 'ZoningName'],
            });

            this.service.GetHenhousesByChickenFarmID(this.outFormData.ChickenFarmID).then((res: any) => {
                this.raisingFarmDataSource = [];
                var AllHenhouses: Array<any> = res.data[0].Details;  //返回的所有栋舍ID
                var Henhouses = []; //当前所有栋舍ID
                var dataSource:any = this.dataGridModel.props.dataSource;
    
                dataSource.forEach(row => {
                    Henhouses.push(row.HenhouseID)
                })
    
                AllHenhouses.forEach(row => {
                    if(Henhouses.indexOf(row.HenHouseID) == -1){
                        this.raisingFarmDataSource.push(row);
                    }
                });
    
                (<Array<any>>this.raisingFarmDataSource).map((r:any) => {
                    r.HenhouseID = r.HenHouseID;
                    r.HenhouseName = r.HenHouseName;
                    r.AreaID = res.data[0].AreaID;
                    r.FullAddress = res.data[0].FullAddress;
                    r.hStartDate = this.outFormData.StartDate;
                    r.hEndDate = this.outFormData.EndDate;

                    this.service.address(Number(res.data[0].AreaID), 1).then((rs: any) => {
                        if (rs.data.length) {
                            let axis = rs.data[0].fullName;
                            r.AreaFullName = axis;
                        }
                    })
                });

                new DataSource(this.yhProductionODataContext.getYHFarmerContractHenhouseDetailDataSource({
                    filter:[
                        [
                            //日期交叉的合同栋舍
                            [
                                [
                                    ["hStartDate", '>=', new DateTime(this.outFormData.StartDate)],
                                    'and',
                                    ["hStartDate", '<=', new DateTime(this.outFormData.EndDate)]
                                ],
                                'or',
                                [
                                    ["hEndDate", '>=', new DateTime(this.outFormData.StartDate)],
                                    'and',
                                    ["hEndDate", '<=', new DateTime(this.outFormData.EndDate)]
                                ],
                            ],
                            'or',
                            [
                                ["hStartDate", '<', new DateTime(this.outFormData.StartDate)],
                                'and',
                                ["hEndDate", '>', new DateTime(this.outFormData.EndDate)]
                            ],
                        ],
                        'and',
                        ["YHFarmerID", '<>', this.formdata.YHFarmerID]
                    ],
                    paginate: false,
                })).load().then(res => {
                    // console.log('map', res, this.raisingFarmDataSource);
                    res = res.map(h => h.hHenhouseID);
                    this.raisingFarmDataSource = this.raisingFarmDataSource.filter((h)=>{
                        // console.log("indexOf", res.indexOf(h.HenhouseID));
                        return res.indexOf(h.HenhouseID)==-1
                    })
                    if(this.raisingFarmDataSource.length <= 0){
                        Notify.warning("该场在当前生效/结束日期下没有未被使用的栋舍！");
                    }
                })
            })
        }
        else {
            Notify.warning("请选择养殖场！");
            this.raisingFarmDataSource = [];
        }
    }

    addFarm() {
        if(!(this.formdata.BeginDate && this.formdata.EndDate)){
            Notify.warning("先选择生效日期/截止日期！");
            return;
        }
        //栋舍数据源
        this._onFieldDataChanged({
            dataField: 'ChickenFarmID',
            value: this.outFormData.ChickenFarmID
        })
        this.outFormData.StartDate = this.formdata.BeginDate;
        this.outFormData.EndDate = this.formdata.EndDate;
        this.outFormData.ChickenFarmID = null;
        this.outVisible = true;
    }

    getSelection(type) {
        if (type == '3') {
            this.outVisible = false;
            // this.AutoDataSource = [];
            this.raisingFarmDataSource = [];
            return false;
        }
        setTimeout(() => {
            if (type == '2') {
                // this.AutoDataSource = [];
                this.raisingFarmDataSource = [];
                // this.clickAuto();
            }
            if (type == '1') {
                this.outVisible = false;
                // this.AutoDataSource = [];
                this.raisingFarmDataSource = [];
            }
            this.areaDataGrid.dataGrid.instance.saveEditData();
            var selectedRowsData11 = this.henhouseDataGrid.instance.getSelectedRowsData();
            var oldData:any = this.dataGridModel.props.dataSource;
            let newData = [];
            (oldData).forEach((data) => {
                let isAllEmpty = true;
                let props = Object.keys(data).filter(
                    (x) => x != this.dataGridModel.primaryKey && x != 'target'
                ); //过滤主键跟target
                for (const prop of props) {
                    if (data[prop] != null && data[prop] != '' && data[prop] != undefined) {
                        isAllEmpty = false;
                        break;
                    }
                }
                if (!isAllEmpty) {
                    newData.push(data);
                }
            });
            console.log(this.outFormData,'表头数据');
            selectedRowsData11.forEach((f) => {
                var row = deepCopy(f);
                row['ChickenFarmID'] = this.outFormData.ChickenFarmID;
                row['HenhouseID'] = row['HenHouseID'];
                row['hHenhouseName'] = row['HenHouseName'];
                delete row['HenHouseID'];
                row.target = DataStatus.newline;
                newData.push(row);
            });
            this.modifiedStatus();
            this.areaDataGrid.dataGrid.dataSource = newData;
            this.formdata.ContractDetail = newData;
            this.areaDataGrid.dataGrid.instance.refresh();
            // this.detailInstance.modifyDataStatusSet();
            // this.setChickenFarmReadOnly();
        },200)
        
    }

    removeRow() {
        MessageBox.confirm(
            this.translator.I18N.commandOptions.delete.confirm,
            this.translator.I18N.commandOptions.delete.confirmTitle
        ).then((require) => {
            if (require) {
                // this.service.delete(this.NumericalOrder).then((result: Result) => {
                //     const response = ResponseSuccess.handle(result);
                //     if (response.status) {
                //         Notify.toast(this.translator.I18N.commandOptions.delete.success, NotifyType.Success);
                //         this.deletedStatus();
                //     } else {
                //         // Notify.toast(response.message, NotifyType.Error);
                //         this.messageBox.show(response.message);
                //         // this.detailInstance.saveDataError();
                //     }
                // });
                let selectedData;
                if(this.areaDataGrid.selectRowIndex == -1){
                    let index = (<Array<any>>this.dataGridModel.props.dataSource).length - 1;
                    selectedData = (<Array<any>>this.dataGridModel.props.dataSource)[index];
                }
                else{
                    selectedData = (<Array<any>>this.dataGridModel.props.dataSource)[this.areaDataGrid.selectRowIndex];
                }
                
                console.log('selectedData', selectedData);
                if(selectedData.NumericalOrder && selectedData.hHenhouseID){
                    this.service.HenhouseCanDelete(selectedData.NumericalOrder, selectedData.hHenhouseID).then(res => {
                        if(res){
                            // Notify.warning(`该栋已被名称为${res}的养户批次业务使用，无法删除！`);
                            this.messageBox.show([`<span style='color:#F8787D'>${selectedData.hHenhouseName}</span>已被名称为<span style='color:#F8787D'>${res}</span>的养户批次业务使用，无法删除！`]);
                            return
                        }
                        else{
                            this.areaDataGrid.removeRow();
                        }
                    })

                }
                else {
                    this.areaDataGrid.removeRow();
                }
            }
        });
    }

    onEditorPreparingFn(e) {
        if (e.parentType == 'dataRow') {
            var dfOnValueChanged = e.editorOptions.onValueChanged
            e.editorOptions.onValueChanged = (args) => {
                this.modifiedStatus();
                if(e.row.data.target == DataStatus.none) {
                    e.row.data.target = DataStatus.modified;
                }
                dfOnValueChanged(args);
            };
        }
    }

    handleCell() {}
    //#endregion

    //#region 物料供应约定
    init_agreement_condition_panel(): ContractCreateComponent{
        this.agreementConditionPanel.default = false;

        //领苗约定摘要
        const condition_getChicken = new NxConditionItem();
        condition_getChicken.label = this.translator.I18N.YHFarmerContract.ChickAbstract.text;
        condition_getChicken.type = 'SelectBox';
        condition_getChicken.dataField = 'ChickAbstract';
        condition_getChicken.required = true;
        condition_getChicken.widget = new NxSelectBox();
        condition_getChicken.widget.props.placeholder = '请选择使用状态';
        condition_getChicken.widget.props.showClearButton = false;
        condition_getChicken.widget.props.valueExpr = 'IsUse';
        condition_getChicken.widget.props.displayExpr = 'Name';
        condition_getChicken.widget.props.dataSource = DataDictionarySource.MaterialSupplyPolicySource;
        condition_getChicken.widget.props.searchEnabled = false;
        condition_getChicken.widget.props.valueExpr = 'MaterialSupplyPolicy';
        condition_getChicken.widget.props.displayExpr = 'MaterialSupplyPolicyName';

        //领物料约定摘要
        const condition_getFeed = new NxConditionItem();
        condition_getFeed.label = this.translator.I18N.YHFarmerContract.FeedAbstract.text;
        condition_getFeed.type = 'SelectBox';
        condition_getFeed.dataField = 'FeedAbstract';
        condition_getFeed.required = true;
        condition_getFeed.widget = new NxSelectBox();
        condition_getFeed.widget.props.placeholder = '请选择使用状态';
        condition_getFeed.widget.props.showClearButton = false;
        condition_getFeed.widget.props.valueExpr = 'IsUse';
        condition_getFeed.widget.props.displayExpr = 'Name';
        condition_getFeed.widget.props.dataSource = DataDictionarySource.MaterialSupplyPolicySource;
        condition_getFeed.widget.props.searchEnabled = false;
        condition_getFeed.widget.props.valueExpr = 'MaterialSupplyPolicy';
        condition_getFeed.widget.props.displayExpr = 'MaterialSupplyPolicyName';

        //领药约定摘要
        const condition_getMedicine = new NxConditionItem();
        condition_getMedicine.label = this.translator.I18N.YHFarmerContract.DrugAbstract.text;
        condition_getMedicine.type = 'SelectBox';
        condition_getMedicine.dataField = 'DrugAbstract';
        condition_getMedicine.required = true;
        condition_getMedicine.widget = new NxSelectBox();
        condition_getMedicine.widget.props.placeholder = '请选择使用状态';
        condition_getMedicine.widget.props.showClearButton = false;
        condition_getMedicine.widget.props.valueExpr = 'IsUse';
        condition_getMedicine.widget.props.displayExpr = 'Name';
        condition_getMedicine.widget.props.dataSource = DataDictionarySource.MaterialSupplyPolicySource;
        condition_getMedicine.widget.props.searchEnabled = false;
        condition_getMedicine.widget.props.valueExpr = 'MaterialSupplyPolicy';
        condition_getMedicine.widget.props.displayExpr = 'MaterialSupplyPolicyName';

        this.agreementConditionPanel.conditionItems.push(
            condition_getChicken,
            condition_getFeed,
            condition_getMedicine
        );

        this.agreementConditionPanel.conditionItems.map((m) => {
            switch (m.type) {
                case 'TextBox':
                    (<NxTextBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                    break;
                case 'DateBox':
                    (<NxDateBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                    break;
                case 'SelectBox':
                    (<NxSelectBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                case 'RadioGroup':
                    (<NxSelectBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                case 'NumberBox':
                    (<NxNumberBox>m.widget).events.innerOnValueChanged = () => {
                        this.modifiedStatus();
                    };
                    break;
            }
        });
        
        return this;
    }
    //#endregion

    //#region 合同文本
    init_uploader():  ContractCreateComponent{
        this.uploader.visible = true;
        this.uploader.readonly=!this.permission.$$edit || !this.permission.$$add;
        this.uploader.numericalOrder = this.NumericalOrder;
        this.uploader.fileListChange = this.fileListChanged.bind(this);

        return this;
    }

    fileListChanged(e) {
        if (!e.isInit) {
            this.modifiedStatus();;
            // this.detailGridRef.modifyDataStatusSet();
        }
        
        this.fileList = e.Files;
        console.log(e, 'File e', this.fileList);

        return this;
    }

    htmlChanged(e){
        // console.log(e.value);
    }
    //#endregion
}
