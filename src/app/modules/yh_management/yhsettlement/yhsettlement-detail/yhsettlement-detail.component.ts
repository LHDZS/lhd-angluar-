import { Component, OnInit, ViewChild } from '@angular/core';
import { yhsettlementModel, 
    yhsettlementDataModel,
     columnSettingArr1, 
     columnSettingArr2, 
     columnSettingArr3, 
     detailSourceArr,
     companiesData,
     productsData
} from '../yhsettlement.model';
import { PrintPageComponent } from 'nxin-print';
import { environment } from 'src/environments/environment';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { groupBy } from 'src/app/providers/groupby';
import { TokenAuthService } from 'src/app/shared/services';
import { DateTime } from 'src/app/providers/common/datetime';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { yhsettlementService } from '../yhsettlement.service'
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';
import { ActivatedRoute } from '@angular/router';
import { DataDictionary, DataDictionarySource, FormOptions } from 'src/app/providers/enums';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { ResponseSuccess, Result } from 'src/app/providers/result';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import {
    QlwODataContext,
    QlwCustomerContext,
    QlwProductContext,
    BasicSettingODataContext,
} from 'src/app/providers/odataContext';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent } from 'devextreme-angular';
import { EditorGridComponent } from 'src/app/components/editor-grid';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { EditorReviewRemoteComponent } from 'src/app/components/editor-grid/editor-review-remote/editor-review-remote.component';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';

@Component({
    selector: 'app-yhsettlement-detail',
    templateUrl: './yhsettlement-detail.component.html',
    styleUrls: ['./yhsettlement-detail.component.scss'],
})
export class yhsettlementDetailComponent implements OnInit {
    @ViewChild('review', { static: false })
    _review: EditorReviewRemoteComponent;
    lang: string = NxTranslateI18N.lang;
    reviewed: boolean = false;
    // 报错
    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;
    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;
    messageBoxVisible: boolean = false;
    messageBoxInfo: string[] = [];
    //表头
    @ViewChild('editorGrid', { static: false })
    _editorGrid: EditorGridComponent;
    mode: 'create' | 'edit';
    dataFormData: any = new yhsettlementModel();
    addFormData: any = {
        DataDate: new Date()
    };
    
    YHFarmerSource: any;
    YHBatchSource: any;
    ChickenFarmSource: any;
    FarmingPriceSource: any;
    PersonSource: any;
    MaxDataDate: any = new Date();
    //打印
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    menu_id: string;
    environment: any;
    tokenData: any;
    //自定义表头配置参数
    //展开/收起
    expressionType1: boolean = true;
    expressionType2: boolean = true;
    expressionType3: boolean = true;
    //header高度
    labelHeight1: string = 'auto';
    labelHeight2: string = 'auto';
    labelHeight3: string = 'auto';
    //组件显示/隐藏
    HeaderVisible1: boolean = true;
    HeaderVisible2: boolean = true;
    HeaderVisible3: boolean = true;
    loading: boolean = false;
    itemWidthNum: Number = 4;
    title1: string = '批次信息';
    columnSettingArr: any = columnSettingArr1;
    title2: string = '关键指标';
    columnSettingArr2: any = columnSettingArr2;
    title3: string = '结算汇总';
    columnSettingArr3: any = columnSettingArr3;
    detailSource: any = [];
    //表体配置
    detailSourceArr: any = detailSourceArr[0].data;
    companiesData: any = companiesData;
    productsData: any = productsData;
    //打印配置
    /** APPID */
    appId: string=USER_INFO_CONTEXT.menuId;
    /** 用户ID */
    userId = USER_INFO_CONTEXT.userId;
    // 新增弹出框
    addVisible: boolean = false;
    @ViewChild('addForm', { static: false })
    addFormInstance: DxFormComponent;
    numericalOrder: string;
    XIndex: Number = 0;
    YIndex: Number = 0;
    UpdateType: boolean = true;
    dataBillDetail: any = {};
    tabId1: any;
    tabId2: any;
    tabId3: any;
    ReceiveVisible: boolean = false;
    //附件
    permission: PermissionService = new PermissionService();
    uploadUrl: string = environment.nxinfileServerUrl;
    fileList: FileInfo[] = [];
    uploader:NxUploader=new NxUploader();
    submited: boolean = false;
    constructor(
        private route: ActivatedRoute,
        private tokenService: TokenAuthService,
        private _service: yhsettlementService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private qlwOdataContext: QlwODataContext,
        private qlwCustomerContext: QlwCustomerContext,
    ) {
        
        this.mode = this.route.snapshot.queryParams.mode || 'create';
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.detailSourceArr = this.DataRecombination();
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
        // 上传
        this.permission.refresh(this.tokenService.getTokenData.permissions);
        this.getReviewInfo = this.getReviewInfo.bind(this);
        this.operationReview = this.operationReview.bind(this);
        this.init_uploader();
        // 养户
        this.YHFarmerSource =  this.YHBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                [ 'Status', '=', true ]
            ]
        })
        //养户批次

        this.YHBatchSource = this.YHBasicSettingODataContext.getYHBatchDataSource({
            filter: [
                ['SettleFlag', '=' , false]
            ]
        });
        

        if (this.route.queryParams['value']['$open'] == FormOptions.$create) {   
            this.onCreate();
        } else {
            this.queryDetail();
            this.queryBillDetail();
            this.jumpData()
        }

        
    }

    async ngOnInit() {

    }

    init_uploader(): yhsettlementDetailComponent {
        this.uploader.visible = true;
        this.uploader.readonly=!this.permission.$$edit || !this.permission.$$add;
        this.uploader.numericalOrder = this.numericalOrder;
        this.uploader.fileListChange = this.fileListChanged.bind(this);

        return this;
    }
    fileListChanged(e) {
        if (!e.isInit && this.UpdateType) {
            this.onUpdate();
        }
        this.fileList = e.Files;

        return this;
    }

    toggleDefault(id) {
        if (id != 'ChickenReceiveDate' || !this.dataFormData['AllChickenReceiveDate']) {
            return
        }
        this.ReceiveVisible = !this.ReceiveVisible;
    }

    getYhFarmingPerson(e) {
        //人员
        let page = `?YHFarmerID=${e.YHFarmerID}`;
        this._service.YhFarmingPerson(page).then((res:any) => {
            this.PersonSource = res;
            this.onRestore();
            setTimeout(() => {
                this.UpdateType = true;
            }, 500);
            // if (res.length == 1) {
            //     this.dataFormData.PersonID = res[0].PersonID;
            // }
        })  
    }

    jumpData() {
        if (!this.numericalOrder) {
            return
        }
        let page = `?NumericalOrder=${this.numericalOrder}&YIndex=${2}&XIndex=${0}`;
        this._service.SettlementBillDetail(page).then((res:any) => {
            this.tabId1 = res.data;
        })

        let page2 = `?NumericalOrder=${this.numericalOrder}&YIndex=${2}&XIndex=${2}`;
        this._service.SettlementBillDetail(page2).then((res:any) => {
            this.tabId2 = res.data;
        })

        let page3 = `?NumericalOrder=${this.numericalOrder}&YIndex=${0}&XIndex=${4}&entertype=2`;
        this._service.SettlementBillDetail(page3).then((res:any) => {
            this.tabId3 = res.data.map( m => {
                if (m.YhSubsidyType == "2302281816150000150") {
                    m['BTAmoun'] = m.AdjustAmount;
                    m['KQAmoun'] = 0;
                } else {
                    m['BTAmoun'] = 0;
                    m['KQAmoun'] = m.AdjustAmount;
                }
                return m
            });
            console.log(this.tabId3,'this.tabId3')
        })
        
    }

    queryDetail() {
        this.UpdateType = false;
        
        this._service.SettlementDetail(this.numericalOrder).then((res:any) => {
            
            this.dataFormData = res.data[0];
            this.dataFormData.PersonIDs = res.data[0].PersonID ? res.data[0].PersonID.split(',') : [];
            if (res.data[0].ChickenReceiveDate.length > 32) {
                this.dataFormData['AllChickenReceiveDate'] = res.data[0].ChickenReceiveDate;
                this.dataFormData.ChickenReceiveDate = res.data[0].ChickenReceiveDate.slice(0,10) + '...';
            }
            this.getYhFarmingPerson(res.data[0]);
            // setTimeout(() => {
            //     this.UpdateType = true;
            // }, 500);
        })
        
    }

    queryBillDetail () {
        if (!this.numericalOrder) {
            return
        }
        let page = `?NumericalOrder=${this.numericalOrder}&YIndex=${this.YIndex}&XIndex=${this.XIndex}`;
        let name = this.XIndex + '-' + this.YIndex;
        if (this.dataBillDetail[name]) {
            this.detailSource = this.dataBillDetail[name];
            return
        }
        //次品数量
        this.dataFormData['DefectiveGoodsQuantity'] = 0;
        this._service.SettlementBillDetail(page).then((res:any) => {
            this.dataBillDetail[name] = res.data;
            this.detailSource = res.data;
            //次品数量
            for (let i = 0; i < res.data.length; i++) {
                const element = res.data[i];
                if (element.PoultrySalesRank == '2301110928400000250' || element.PoultrySalesRank == '2301110928400000350' ) {
                    this.dataFormData['DefectiveGoodsQuantity'] += element.Quantity;
                }
            }
        })
    }

    tabsClick(e) {
        console.log(e,'tabsClick')
        this.XIndex = e.key;
        this.detailSourceArr = this.DataRecombination();
        this.queryBillDetail();
    }

    DataRecombination() {
        let arr = [];
        for (let index = 0; index < detailSourceArr.length; index++) {
            const element = detailSourceArr[index];
            if (element.XIndex.indexOf(this.XIndex) != -1 && element.YIndex.indexOf(this.YIndex) != -1) {
                arr.push(element);
            }
        }
        return arr
    }

    selectItem(e) {
        this.YIndex = e.key;
        this.detailSourceArr = this.DataRecombination();
        this.queryBillDetail();
    }

    onUpdate() {
        this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled = false;
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn').disabled = false;
    }
    
    onRestore() {
        this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled = true;
        this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'cancel-btn').disabled = true;
    }

    /** 获取审核信息 */
    getReviewInfo(data) {
        return this._service.getReviewInfo(data);
    }
    /** 审核操作 */
    operationReview(data) {
        if (data.IsAdd) {
            // if (this.data.SubmitStatus == 1) {
            //     Notify.warning('请先提交审核');
            //     return Promise.resolve({ code: -1 });
            // }
        }
        return this._service.operationReview(data);
    }
    /** 审核状态变更 */
    onReviewOptionChanged(e: { items: any[] , ConfirmStatus?}) {
        // let detailDataSource = this._service._detailInfoUtil.getSaveData();
        // let obj = detailDataSource.filter(item => item.target == DataStatus.Edit);
        // if (obj.length != 0) {
        //     this.reviewed=false;
        //     this.submited =false;
        //     Notify.warning('请先保存数据，然后再操作');
        //     return
        // }
        if (e.items && e.items.filter(m => m.reviewed).length > 0) {
            this.reviewed=true;
            this.submited =true;
            setTimeout(() => {
                this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = true;
                this.onRestore();
            }, 500);
        }else{
            this.reviewed=false;
            this.submited =false;
            this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = false;
            if (e.ConfirmStatus) {
                this.queryDetail();
            }
        }
    }
    
    onYHFarmerIDChanged(e) {
        let filter = [['Status', '=', true],["YHFarmerID",'=',e.value]];
        new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
            filter: filter
        })).load().then((res:any) => {
            if(res&&res.length>0){
                this.YHBatchSource = res;
                if( res.length == 1 ){
                    this.dataFormData['YHBatch'] = res[0].YHBatchID;
                    this.dataFormData['ChickenFarmID'] = res[0].ChickenFarmID;
                }else{
                    this.dataFormData['YHBatch'] = '0';
                    this.dataFormData['ChickenFarmID'] = '0'
                }
            }else{
                this.dataFormData['ChickenFarmID'] = '0';
                this.YHBatchSource = [];
            }
        });
    }

    onYHBatchChanged(e) {

    }

    onChanged() {
        if (this.UpdateType) {
            this.onUpdate()
        }
    }

    onNumChanged(e) {
        if (this.UpdateType) {
            this.dataFormData['FarmingCanProfit'] = this.dataFormData.BatchTotalAmount - e.value;
            this.onUpdate()
        }
    }

    onReacquire() {
        this.loading = true;
        this._service.post({
            "DataDate": new DateTime(this.dataFormData.DataDate).toString('yyyy/MM/dd'),
            "YHFarmerID": this.dataFormData.YHFarmerID,
            "YHBatch": this.dataFormData.YHBatch,
            "FarmingPriceID": this.dataFormData.FarmingPriceID,
            // 'Number': this.dataFormData.Number,
            'NumericalOrder': this.dataFormData.NumericalOrder
        }).then((res:any) => {
            this.loading = false;
            const response = ResponseSuccess.handle(res);
            if (response.status) {
                Notify.success('操作成功');
                this.numericalOrder = res.data.NumericalOrder;
                this.dataBillDetail = {};
                this.queryDetail();
                this.queryBillDetail();
                this.jumpData();
                this.addVisible = false;
                this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'add-btn').disabled = false;
                this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'delete-btn').disabled = false;
            } else {
                Notify.error(response.message)
            }
        })
    }

    delConfirm(e) {
        if (!e) {
            this.addVisible = false;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'add-btn').disabled = false;
        } else {
            this.loading = true;
            let validation = this.addFormInstance.instance.validate().isValid;
            if (validation) {
                this._service.post({
                    "DataDate": new DateTime(this.addFormData.DataDate).toString('yyyy/MM/dd'),
                    "YHFarmerID": this.addFormData.YHFarmerID,
                    "YHBatch": this.addFormData.YHBatch,
                    "FarmingPriceID": this.addFormData.FarmingPriceID,
                    // 'Number': '0',
                    'NumericalOrder': '0'
                }).then((res:any) => {
                    this.loading = false;
                    const response = ResponseSuccess.handle(res);
                    if (response.status) {
                        Notify.success('保存成功');
                        this.numericalOrder = res.data.NumericalOrder;
                        this.dataBillDetail = {};
                        this.queryDetail();
                        this.queryBillDetail();
                        this.jumpData();
                        this.addVisible = false;
                        this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'add-btn').disabled = false;
                        this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'delete-btn').disabled = false;
                    } else {
                        Notify.error(response.message)
                    }
                })
            }else{
                this.loading = false;
            }
        }
    }

    onFieldDataChanged(e) {
        if (e.dataField == 'YHFarmerID') {
            let filter = [['Status', '=', true],["YHFarmerID",'=',e.value]];
            new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
                filter: filter
            })).load().then((res:any) => {
                if(res&&res.length>0){
                    this.YHBatchSource = res;
                    if( res.length == 1 ){
                        this.addFormData['YHBatch'] = res[0].YHBatchID;
                        this.dataFormData['ChickenFarmID'] = res[0].ChickenFarmID;
                    }else{
                        this.addFormData['YHBatch'] = '0';
                        this.dataFormData['ChickenFarmID'] = '0';
                    }
                }else{
                    this.dataFormData['ChickenFarmID'] = '0';
                    this.YHBatchSource = [];
                }
            });
        } else if (e.dataField == 'YHBatch') {
            let DataDate = this.dataFormData['DataDate'];
            this.getFarmingPrice(e.value,DataDate)
        } else if (e.dataField == 'DataDate') {
            let YHBatch = this.dataFormData['YHBatch'];
            this.getFarmingPrice(YHBatch,e.value)
        }
    }
    //养殖价格方案
    getFarmingPrice(YHBatch,DataDate) {
        DataDate = new DateTime(DataDate).toString('yyyy/MM/dd');
        let page = `?YHBatch=${YHBatch}&DataDate=${DataDate}`
        this._service.FarmingPrice(page).then((res:any) => {
            this.FarmingPriceSource = res;
            if (res.length == 1) {
                this.addFormData['FarmingPriceID'] = res[0].FarmingPriceID;
            }
        })
    }

    /** 新增 */
    onCreate() {
        this.mode = 'create';
        this.reviewed = false;
        this.addVisible = true;
    }
    /** 保存 */
    onSave() {
        if (this.reviewed) {
            Notify.warning('单据已审核！');
            return null;
        }
        let obj = this.dataFormData;
        obj.PersonID = obj.PersonIDs.join(',');
        obj.FilesDto = this.fileList || [];
        obj.DataDate = new DateTime(this.dataFormData.DataDate).toString('yyyy/MM/dd');
        this._service.put(obj).then((res:any) => {
            const response = ResponseSuccess.handle(res);
            if (response.status) {
                Notify.success('修改成功');
                this.mode = 'edit';
                this.numericalOrder = res.data.NumericalOrder;
                this.dataBillDetail = {};
                this._editorGrid._remoteReveiw.instance.refresh(this.numericalOrder);
                this.queryDetail();
                this.queryBillDetail();
                this.jumpData();
            } else {
                Notify.error(response.message)
            }
        })
    }
    /** 撤销 */
    onCancel() {
        if (this.mode == 'create') {
            this.addVisible = false;
            this.dataFormData = new yhsettlementModel();
            this.numericalOrder = null;
            this.UpdateType = true;
            this.dataBillDetail = {};
        } else {
            this.addVisible = false;
            this.dataBillDetail = {};
            this.queryDetail();
            this.queryBillDetail();
        }
    }
    /** 删除 */
    onDelete() {
        MessageBox.confirm('您确定要删除这张单据吗?').then(confirm => {
            if (confirm) {
                this._service.delete(this.dataFormData.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.success('删除成功');
                        this.mode = 'create';
                        this.onCancel();
                        // this.deleted = true;
                        // this._editorGrid.instance.setToolbarStatusAfterDeleted();
                    } else {
                        Notify.error('删除失败' + response.message);
                        this.messageBoxVisible = true;
                        // this.saveStatus=true;
                        if (response.message instanceof Array) {
                            this.messageBoxInfo = response.message;
                        }
                    }
                });
            }
        });
    }
    //打印
    //跳转模板
    jump() {
        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=批次结算`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2303201441430000150&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=批次结算`
                );
            }
        );
    }
    getSource(e) {
        if (!this.numericalOrder) {
            Notify.error('未完成单据不支持打印！');
            return
        }
        if (e.status) {
            // 表头赋值
            var tabId0 = deepCopy(this.dataFormData);
            tabId0['DataDate'] = new DateTime(tabId0.DataDate).toString('yyyy/MM/dd');
            // 进苗日期
            let ChickenReceiveDate = this.dataFormData.ChickenReceiveDate.split(',');
            tabId0['ChickenReceiveDate'] = ChickenReceiveDate.length > 2 ? ChickenReceiveDate.splice(0,2) : tabId0.ChickenReceiveDate;
            // 账期月份
            tabId0['AccountMonth'] = new DateTime(tabId0.AccountMonth).toString('yyyy/MM');
            tabId0['ClearHouseDate'] = new DateTime(tabId0.ClearHouseDate).toString('yyyy/MM/dd');
            //苗鸡结算价
            console.log(tabId0.ChickenReceiveAmount/tabId0.ValueQuantity);
            if (tabId0.ValueQuantity == 0) {
                tabId0['ChickenSettlement'] = 0;
            } else {
                tabId0['ChickenSettlement'] = (tabId0.ChickenReceiveAmount/tabId0.ValueQuantity).toFixed(2);
            }
            
            // 死亡率
            if ((tabId0.ValueQuantity + tabId0.ThrowQuantity) == 0) {
                tabId0['MortalityRate'] = 0
            } else {
                tabId0['MortalityRate'] = ((tabId0.DeathQuantity/(tabId0.ValueQuantity + tabId0.ThrowQuantity))*100).toFixed(2);
            }

            // 上市收入
            tabId0['ListingIncome'] = tabId0.OutRecycleAmount;
            //饲养成本
            tabId0['FeedingCost'] = tabId0.ChickenReceiveAmount + tabId0.MaterialReceiveAmount + tabId0.ImmuneReceiveAmount + tabId0.DrugReceiveAmount + tabId0.OtherReceiveAmount;
            //补贴金额
            tabId0['SubsidyAmountSummary'] = tabId0.SubsidyGrossProfit + tabId0.SubsidyAmount;
            //扣款金额
            tabId0['DeductionAmountSummary'] = tabId0.DeductionGrossProfit + tabId0.DeductionAmount;
            //代扣金额
            tabId0['WithholdAmountSummary'] = tabId0.WithholdGrossProfit + tabId0.WithholdAmount;
            //每只毛利
            console.log((tabId0.GrossProfit / tabId0.OutRecycleQuantity))
            if (tabId0.OutRecycleQuantity == 0) {
                tabId0['EachGrossProfit'] = 0;
            } else {
                tabId0['EachGrossProfit'] = (tabId0.GrossProfit / tabId0.OutRecycleQuantity).toFixed(2);
            }

            let tabId1 = this.tabId1;

            let tabId2 = this.tabId2;

            let tabId3 = this.tabId3;

            let sources = {
                tabId0: tabId0,
                tabId1: tabId1,
                tabId2: tabId2,
                tabId3: tabId3
            };

            var direct = false;
            if (e.isDirect) {
                direct = true;
            }
            
            this._printPage.instance.printGeneration(sources);
        }
    }
}
