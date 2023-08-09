import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ActivatedRoute, Router } from '@angular/router';
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
import { yhBatchModel, yhBatchDetailModel } from '../yhbatch.model';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { Notify, NotifyType, MessageBox } from 'src/app/providers/notify';
import { yhBatchService } from '../yhbatch.service';
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
import { YHBasicSettingODataContext } from 'src/app/providers/odataContext/yh.odataContext';
import { YHProductionODataContext } from 'src/app/providers/odataContext/yhp.odataContext';
import { custom } from 'devextreme/ui/dialog';
import { HomeHelper } from 'src/app/providers/homeHelper';

@Component({
    selector: 'app-yhbatch-create',
    templateUrl: './yhbatch-create.component.html',
    styleUrls: ['./yhbatch-create.component.scss'],
})
export class yhBatchCreateComponent implements OnInit {
    $option: any;

    YHBatchID: string;

    //消息盒子
    messageBoxVisible: boolean = false;

    messageBoxInfo: Array<any> = [];

    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;

    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;

    //单据状态
    $AllowSave: boolean = true;

    $deleted: boolean = false;
    ss : ["BreedingName","MnemonicCode"];
    //数据
    formData: any = {};

    HtmlText:string = "";

    YhFarmerSource = this.yhBasicSettingODataContext.getYHFarmerInfoDataSource({
        filter: [
            ['Status', '=', true]
        ]
    });

    YhFarmerContractSource: any = [];

    ChickenFarmSource: any = [];
    loading: boolean = false;
    BreedingSource = this.basicSettingODataContext.getZqBreedingsetDataSource({
        filter: [
            ['Status', '=', true],
        ]
    });

    ProductSource = this.basicSettingODataContext.getProductDataSource({
        filter: [
            ['iSortPlus', '=', '201711221519051106'],
            ['bUse', '=', true]
        ]
    });

    ChickenTypeSource: any = this.basicSettingODataContext.getBizRemindGroupDataSource({
        filter: [

            [
                'PID', '=', DataDictionary.ChickenType
            ],
            [
                'Status', '=', true
            ]
        ],
        select: ['RemindID', 'RemindName'],
    })

    ChickSourceTypeSource: any = DataDictionarySource.ChickSourceTypeSource;

    ChickSourceDataSource: any = [];

    ChickSourceTypeDisable: boolean = false;

    //组件模型
    toolBarPanelModel = new NxToolbarPanel('detail');   //工具栏
    @ViewChild("toolbarPanel", { static: false })
    toolbarPanel: NxToolbarPanelComponent;

    SerialNoFlag:boolean= true;
    batchTransferSource:any=[];
    showdetail:boolean=false;
    // @ViewChild('editorGrid', { static: false })
    // _editorGrid: EditorGridComponent;
    isReadOnly:boolean=true;
    constructor(
        private route: ActivatedRoute,
        private qlwOdataContext: QlwODataContext,
        private service: yhBatchService,
        private basicSettingODataContext: BasicSettingODataContext,
        private productODataContext: ProductODataContext,
        private yhBasicSettingODataContext: YHBasicSettingODataContext,
        private yhProductionODataContext: YHProductionODataContext,
        private qlwCustomerODataContext: QlwCustomerContext,
        private USER_GUIDE: USER_GUIDE_CONTEXT,
        private translator: TranslateService,
        public changeDetectorRef: ChangeDetectorRef,
        private router: Router,
    ) {
        // this.BatchID = this.route.queryParams['value']['BatchID'];
        this.$option = this.route.queryParams['value']['$option'];
        this.YHBatchID = `${this.route.queryParams['value']['YHBatchID'] || 0}`;

        this.init_toolbar_panel();

        this.initialization();
    }

    //#region 初始化
    ngOnInit(): void {

    }

    get SaveStatus(){
        return this.$AllowSave;
    }

    set SaveStatus(value: boolean){
        if (this.$deleted) value = false;
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
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('create')).props.disabled = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('delete')).props.disabled = true;
        this.showdetail=false;
        this.isReadOnly=false;
        this.formData = {};
        this.SerialNoFlag = true;
        this.formData.DataDate = new DateTime().toString('yyyy-MM-dd');
        this.formData.YHFarmerID = null;
        this.formData.EndDate = null;
        this.formData.ChickenFarmID = null;
        this.YHBatchID = '';
        this.formData.YHBatchName = '';
        this.formData.BreedingID = null;
        this.formData.ProductID = null;
        this.formData.ChickenType = null;

        this.formData.ChickSourceType = null;
        this.formData.ChickSource = null;
        this.formData.DaysOldDate = null;
        this.formData.DaysOld = null;
        this.formData.SerialNo = null;
        this.formData.Remarks = null;
        this.formData.Status = true;

        this.$deleted = true;
        setTimeout(()=>{
            this.$deleted = false;
        }, 1000)
    }

    //修改入口
    modify(){
        
        var params = `$filter=(YHBatchID eq + '${this.YHBatchID}')`

        this.service.getDataSource(this.YHBatchID).load().then((res: any) => {
            this.formData = deepCopy(res[0]);
            this.SerialNoFlag = false;
            if (this.formData.DaysOld == -1){
                this.formData.DaysOld = null;
            }
            if (this.formData.ChickenType == "0"){
                this.formData.ChickenType = null;
            }
            if (this.formData.ChickSourceType == "0"){
                this.formData.ChickSourceType = null;
            }
            if (this.formData.ChickSource == "0"){
                this.formData.ChickSource = null;
            }
        });
        this.service.getBatchTransferData(this.YHBatchID).then((res:any)=>{
            (<NxButton>this.toolBarPanelModel.getWidgetByKey('create')).props.disabled = false;
            (<NxButton>this.toolBarPanelModel.getWidgetByKey('delete')).props.disabled = false;
            if(res && res.length>0){
                var idx = 0;
                res.forEach((row) => {
                    idx++;
                    row.IDENTITY_RECORD = idx;
                });
                this.batchTransferSource = res;
                this.showdetail = true;
                this.isReadOnly = true;
            }else{
                this.showdetail = false;
                this.isReadOnly = false;
            }
        })
        this.SaveStatus = false;
        this.$deleted = true;
        setTimeout(()=>{
            this.$deleted = false;
        }, 2000);
    }

    deletedStatus(){
        this.$option = FormOptions.$create;
        this.$deleted = true;
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
            'YHFarmerContract',
            'ChickenFarmID',
            'YHBatchName',
            'BreedingID',
            'ProductID',
        ];

        let isAll = true;

        let errorMessages = []

        for(let prop of checkList) {
            if(data[prop] == null || data[prop] == undefined || data[prop] == '') {
                isAll = false;
                errorMessages.push(`${this.translator.I18N.YHBatch[prop.replace(/ID$/, 'Name')].text} 未填`)
            }
        }

        if(!isAll) this.messageBox.show(errorMessages);
        return isAll;
    }

    getSaveData(){
        var data = new yhBatchModel();
        data.YHBatchID = this.YHBatchID || "0";

        data.DataDate = this.formData.DataDate;
        data.YHFarmerID = this.formData.YHFarmerID;
        data.YHFarmerContract = this.formData.YHFarmerContract;
        data.ChickenFarmID = this.formData.ChickenFarmID;
        data.YHBatchName = this.formData.YHBatchName;
        data.BreedingID = this.formData.BreedingID;
        data.ProductID = this.formData.ProductID ;
        data.ChickenType = this.formData.ChickenType || "0";
        data.OneMedicineFee = this.formData.OneMedicineFee || 0;
        // data.ChickSourceType = this.formData.ChickSourceType || "0";
        // data.ChickSource = this.formData.ChickSource || "0";
        data.DaysOldDate = this.formData.DaysOldDate;
        if(this.formData.DaysOld == null || this.formData.DaysOld == undefined || this.formData.DaysOld < 0){
            data.DaysOld = -1;
        }
        else{
            data.DaysOld = this.formData.DaysOld;
        }

        data.Remarks = this.formData.Remarks || '';
        data.ComboPack = this.formData.ComboPack || DataDictionary.ComboPackF;
        data.Status = this.formData.Status;
        data.SerialNo = this.formData.SerialNo || 0;
        return data;
    }
    //#endregion

    //#region 工具栏
    init_toolbar_panel(): yhBatchCreateComponent{
        this.toolBarPanelModel.checkInfo.visible = false;
        this.toolBarPanelModel.moreButton.props.visible = false;
        this.toolBarPanelModel.moreButton.props.disabled = true;
        this.toolBarPanelModel.getOtherWidgetByKey('headSetting').props.visible = false;
        // this.toolBarPanelModel.getOtherWidgetByKey('filterRow').props.visible = false;
        this.toolBarPanelModel.getOtherWidgetByKey('print').props.visible = false;
        this.toolBarPanelModel.getOtherWidgetByKey('messageBox').props.visible = true;
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

    butTrue() {
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('create')).props.disabled = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('save')).props.disabled = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('cancel')).props.disabled = true;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('delete')).props.disabled = true;
    }

    butFalse() {
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('create')).props.disabled = false;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('save')).props.disabled = false;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('cancel')).props.disabled = false;
        (<NxButton>this.toolBarPanelModel.getWidgetByKey('delete')).props.disabled = false;
    }

    save(){

        if(!this.checkRequired()) return;
        this.SaveStatus = false;
        // this.loading=true;
        if(this.$option == FormOptions.$create){
            const data = this.getSaveData();
            if (data) {
                this.butTrue();
                this.service.post(data).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                        this.YHBatchID = result.data.YHBatchID;
                        this.saveDataAfterStatus();
                    } else {
                        // Notify.toast(response.message, NotifyType.Error);
                        // this.detailInstance.saveDataError();
                        this.SaveStatus = true;
                        this.messageBox.show(response.message);
                        // this.detailInstance.saveDataError();
                        this.butFalse();
                    }
                    // this.loading=false;
                })
                .catch(()=>{
                    this.SaveStatus = true;
                    // this.loading=false;
                    this.butFalse();
                });
            }
        }
        else {
            const data = this.getSaveData();
            if (data) {
                this.butTrue();
                this.service.put(data).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                        this.YHBatchID = result.data.YHBatchID;
                        this.saveDataAfterStatus();
                    } else {
                        // Notify.toast(response.message, NotifyType.Error);
                        // this.detailInstance.saveDataError();
                        this.SaveStatus = true;
                        this.messageBox.show(response.message);
                        // this.detailInstance.saveDataError();
                        this.butFalse();
                    }
                    // this.loading=false;
                })
                .catch(()=>{
                    this.SaveStatus = true;
                    // this.loading=false;
                    this.butFalse();
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
                this.service.delete(this.YHBatchID).then((result: Result) => {
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
        this.initialization();
    }
    //#endregion

    //#region 表单


    _onValueChanged(e) {
        if (e.value) {
            this.formData.DataDate = new DateTime(e.value.toString()).toString('yyyy-MM-dd');
            this.modifiedStatus();
        }
    }

    onFarmerChange(e){
        if(e.value){
        }
    }

    onFieldDataChanged(e) {
        this.modifiedStatus();
        switch(e.dataField) {
            case 'DaysOldDate':
                break;
            case 'DataDate':
                if(e.value){
                    this.formData[e.dataField] = new DateTime(e.value.toString()).toString('yyyy-MM-dd');
                }
                else {
                    this.formData[e.dataField] = null;
                }
                break;
            case 'YHFarmerID':
                // this.loading = true;
                this.YHFarmerClick(e.value);
                var param = "YHFarmerID="+e.value+"&";
                if(this.YHBatchID){
                    param+="YHBatch="+this.YHBatchID+"&";
                }
                if(this.SerialNoFlag){
                    this.service.getMaxSerialNoByYHFarmerID(param).then((res:any) => {
                        setTimeout(()=>{
                            if(res){
                                this.formData.SerialNo = res[0].SerialNo+1;
                            }
                        }, 200)
                    })
                }
                this.SerialNoFlag=true;
                if(this.formData.YHFarmerID){
                    let filter = [['YHFarmerID', '=', this.formData.YHFarmerID]];
                    if(this.formData.DataDate){
                        filter.push([['BeginDate', '<=', new DateTime(this.formData.DataDate)], 'and', ['EndDate', '>=', new DateTime(this.formData.DataDate)]]);
                    }
                    this.YhFarmerContractSource = new DataSource(this.yhProductionODataContext.getYHFarmerContractInfoDataSource({
                        filter: filter,
                        paginate: false,
                    }))
                    this.YhFarmerContractSource.load().then((res:any) => {
                        setTimeout(()=>{
                            // this.loading = false;
                            if(res.length == 1) {
                                this.formData.YHFarmerContract = res[0].NumericalOrder;
                            }
                            else {
                                let isInSource = false;
                                res.forEach(c => {
                                    if(c.NumericalOrder == this.formData.YHFarmerContract) {
                                        isInSource = true;
                                    }
                                })
                                if(!isInSource){
                                    this.formData.YHFarmerContract = null;
                                }
                            }
                        }, 200)
                    })
                }
                else {
                    this.formData.YHFarmerContract = null;
                    this.YhFarmerContractSource = [];
                }
                break;
            case 'YHFarmerContract': // 养殖合同变化，养殖场数据源随之变化
                if(e.value){
                    this.ChickenFarmSource = new DataSource(this.yhBasicSettingODataContext.getYHChickenFarmRelateDataSource({
                        paginate: false,
                    }));
                    // this.loading = true;

                    new DataSource(this.yhProductionODataContext.getYHFarmerContractHenhouseDetailDataSource({
                        filter: ['NumericalOrder', '=', e.value],
                        paginate: false,
                    })).load().then((res: any) => {

                        let ChickenFarmsOfContract = [];
                        res.forEach(h => {
                            if(ChickenFarmsOfContract.indexOf(h.hChickenFarmID) == -1){
                                ChickenFarmsOfContract.push(h.hChickenFarmID)
                            }
                        })
                        // this.loading = false;
                        return ChickenFarmsOfContract;
                    }).then((ChickenFarmsOfContract: any) => {
                        this.ChickenFarmSource.filter((c) => {
                            return ChickenFarmsOfContract.indexOf(c.ChickenFarmID) != -1 && c.Status
                        });
                        // this.loading = true;
                        this.ChickenFarmSource.load().then((res) => {
                            setTimeout(()=>{
                                if(res.length == 1) {
                                    this.formData.ChickenFarmID = res[0].ChickenFarmID;
                                }
                                else {
                                    let isInSource = false;
                                    res.forEach(c => {
                                        if(c.ChickenFarmID == this.formData.ChickenFarmID) {
                                            isInSource = true;
                                        }
                                    })
                                    if(!isInSource && !this.showdetail){
                                        this.formData.ChickenFarmID = null;
                                    }
                                }
                                // this.loading = false;
                            }, 200)
                        })
                    })
                }
                else {
                    this.formData.ChickenFarmID = null;
                    this.ChickenFarmSource = [];
                }
                break;
            case 'YHBatchName':
                this.formData.YHBatchName = e.value.replace(/\s+$/, '');
                break;
            case 'ChickSourceType':
                if(e.value){
                    if(e.value == DataDictionary.ChickSourceA) {
                        new DataSource(this.qlwCustomerODataContext.getSupplierDataSource({
                            paginate: false,
                        })).load().then(res => {
                            this.ChickSourceDataSource = [];
                            res.map(s => {
                                this.ChickSourceDataSource.push({
                                    value: s.SupplierId,
                                    name: s.SupplierName
                                })
                            })
                        });
                    }
                    else if(e.value == DataDictionary.ChickSourceB){
                        new DataSource(this.yhBasicSettingODataContext.getYHChickenFarmRelateDataSource({
                            paginate: false,
                        })).load().then(res => {
                            this.ChickSourceDataSource = [];
                            res.map(s => {
                                this.ChickSourceDataSource.push({
                                    value: s.ChickenFarmID,
                                    name: s.ChickenFarmName
                                })
                            })
                        });
                    }
                }
                else{
                    this.ChickSourceDataSource = [];
                }
                break;
            case 'ChickSource':
                if(e.value){
                    this.ChickSourceTypeDisable = true;
                }
                else{
                    this.ChickSourceTypeDisable = false;
                }
                break;
            default:
                break;
        }
    }
    YHFarmerClick(e) {
        if(e==null){
            return ;
        }
        var param = "YHFarmerID="+e;
        var title = '该养户还没有养殖合同！';
        this.service.getFarmerContractByYHFarmerID(param).then((res:any)=>{
            var flag = false;
            if(res && res.length>0){
                res.forEach(row => {
                    if(new Date(row.BeginDate)> new Date(this.formData.DataDate) && new Date(row.EndDate)< new Date(this.formData.DataDate)){
                        flag = true;
                    }
                });
                if(flag){
                    title = '该养户合同已过期！'
                }
            }else{
                flag = true;
            }
            if(flag){
                this.confirm(
                    title,
                    '养户批次提示弹出框'
                ).then((require) => {
                    if (require) {
                        HomeHelper.open(
                            {
                                url: `${environment.qqlwUri}/Contract?YHFarmerID=`+e,
                                title: this.translator.I18N.YHFarmerContract.createPageTitle,
                            },
                            () => {
                                this.router.navigate(['/Contract'], {
                                    queryParams: { YHFarmerID: e },
                                });

                            }
                        );
                    }
                });
            }
        })

    }

    confirm(message: string, title: string): Promise<boolean> {
        let customConfirm = custom({
            title: title,
            messageHtml: message,
            buttons: [
                {
                    text: '转到养殖合同', //确认
                    stylingMode: 'contained',
                    type: 'default',
                    onClick: e => {
                        return true;
                    },
                },
                {
                    text: '关闭', //'取消',
                    onClick: e => {
                        return false;
                    },
                },
            ],
        });

        return customConfirm.show();
    }
    get ChickenSourcePlaceHolder(){
        if(this.formData["ChickSourceType"]){
            return '请选择'
        }
        else {
            return '请先选择苗源类型'
        }
    }

    get YHFarmerContractPlaceHolder(){
        if(this.formData["YHFarmerID"]){
            return '请选择'
        }
        else {
            return '请先选择养户'
        }
    }

    get ChickenFarmPlaceHolder(){
        if(this.formData["YHFarmerContract"]){
            return '请选择'
        }
        else {
            return '请先选择养殖合同'
        }
    }
    //#endregion
}
