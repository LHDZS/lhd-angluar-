import { Component, OnInit, ViewChild } from '@angular/core';
import { yhmaterialsettingsModel, 
    yhmaterialsettingsDataModel,
    YHFarmerConcertRelateDto,
    headerGridArr
} from '../yhmaterialsettings.model';
import { PrintPageComponent } from 'nxin-print';
import { environment } from 'src/environments/environment';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { groupBy } from 'src/app/providers/groupby';
import { TokenAuthService } from 'src/app/shared/services';
import { DateTime } from 'src/app/providers/common/datetime';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { yhmaterialsettingsService } from '../yhmaterialsettings.service'
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
import { DxDataGridComponent, DxFormComponent } from 'devextreme-angular';
import { EditorGridComponent } from 'src/app/components/editor-grid';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';
import { EditorReviewRemoteComponent } from 'src/app/components/editor-grid/editor-review-remote/editor-review-remote.component';

@Component({
    selector: 'app-yhmaterialsettings-detail',
    templateUrl: './yhmaterialsettings-detail.component.html',
    styleUrls: ['./yhmaterialsettings-detail.component.scss'],
})
export class yhmaterialsettingsDetailComponent implements OnInit {
    /** APPID */
    appId: string=USER_INFO_CONTEXT.menuId;
    /** 用户ID */
    userId = USER_INFO_CONTEXT.userId;
    lang: string = NxTranslateI18N.lang;
    reviewed: boolean = false;
    /** 已提交 */
    submited: boolean = false;
    referenced: boolean = false;
    
    saveStatus: boolean=true;
    selectionModel: "single";
    //附件
    permission: PermissionService = new PermissionService();
    uploadUrl: string = environment.nxinfileServerUrl;
    fileList: FileInfo[] = [];
    uploader:NxUploader=new NxUploader();
    // 报错
    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;
    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;
    messageBoxVisible: boolean = false;
    messageBoxInfo: string[] = [];
    //表头
    @ViewChild('editorGrid', { static: false })
    _editorGrid: EditorGridComponent;
    mode: 'create' | 'edit';
    dataFormData: any = new yhmaterialsettingsModel();
    // 详情明细
    BreedingSource: any;
    ProductSource: any;
    @ViewChild('detailGrid', { static: false })
    _settingGrid: DxDataGridComponent;
    //打印
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    @ViewChild('review', { static: false })
    _review: EditorReviewRemoteComponent;
    ChickenFarmSource: any;
    FarmingPriceSource: any;
    PersonSource: any;
    MaxDataDate: any = new Date();
    menu_id: string;
    environment: any;
    tokenData: any;
    //自定义表头配置参数
    headerGridArr: any = [];
    detailSource: any = [];
    //打印配置
    // 新增弹出框
    @ViewChild('addForm', { static: false })
    addFormInstance: DxFormComponent;
    numericalOrder: string;
    UpdateType: boolean = true;
    //删除
    actionDelVisible: boolean = false;
    ItemIndex: number;
    $addList: boolean = false;
    constructor(
        private route: ActivatedRoute,
        private tokenService: TokenAuthService,
        private _service: yhmaterialsettingsService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private basicSettingODataContext: BasicSettingODataContext,
        private qlwOdataContext: QlwODataContext,
        private qlwCustomerContext: QlwCustomerContext,
    ) {
        // 审核
        this.mode = this.route.snapshot.queryParams.mode || 'create';
        this.dataFormData.NumericalOrder = this.route.snapshot.queryParams.numericalOrder;
        // 上传
        this.permission.refresh(this.tokenService.getTokenData.permissions);
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
        this.getReviewInfo = this.getReviewInfo.bind(this);
        this.operationReview = this.operationReview.bind(this);
        this.init_uploader();

        this.ProductSource = this.basicSettingODataContext.getProductDataSource({
            filter: [
                ['iSortPlus', '=', DataDictionary.iSortA],
                'or',
                ['iSortPlus', '=', DataDictionary.iSortK]
            ],
            // select: ['ProductID', 'ProductName','MnemonicCode'],
        });

        // 品种
        this.BreedingSource = this.basicSettingODataContext.getZqBreedingsetDataSource({
            select: ['BreedingID', 'BreedingName','MnemonicCode'],
        })
        

        if (this.route.queryParams['value']['$open'] == FormOptions.$create) {
            this.onCreate();
        } else {
            this.queryDetail();
            this.jumpData()
        }

        
    }

    async ngOnInit() {
        
    }

    init_uploader(): yhmaterialsettingsDetailComponent {
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

    onEditorPreparingFn(e) {
        if (e.dataField && e.row.rowType == 'data') {
            const rowIndex = e.row.rowIndex;
            const rowData = e.row.data;
            const _defaultValueChanged = e.editorOptions.onValueChanged;
            e.editorOptions.onValueChanged = (args) => {
                // detaiilInstance是详情组件的实例,这里是单元格编辑之后的工具条按钮状态控制
                if (this.UpdateType) {
                    this.onUpdate();
                }
                // 用setTimeout延迟支持获取选中的文本值
                setTimeout(() => {
                    // 将选中的文本值赋值到数据源上,_changedValue是下拉数据中对应的文本值
                    e.setValue(args.value, args.component._changedValue);
                }, 0);
            };
            if (e.dataField == 'ProductID') {
                e.editorOptions.onValueChanged = _e => {
                    rowData['ProductID'] = _e.value;
                    var iSort = "ProductID="+_e.value;
                    this._service
                        .getProduct(<any>iSort)
                        .then((result: any) => {
                            if (result.value.length > 0) {
                                rowData['MeasureUnitName'] = result.value[0].MeasureUnitName || '';
                                rowData['Specification'] = result.value[0].Specification || '';
                                rowData['Stages'] = result.value[0].Stages || '';
                            }
                        });
                }
            }
            
            
        }
    }

    onRowRemoved(e) {
        console.log('新增了')
    }

    //增加卡片
    addClick(e) {
        let row = new yhmaterialsettingsDataModel();
        let obj = new YHFarmerConcertRelateDto();
        for (let index = 0; index < 6; index++) {
            row.MaterialSettingsExtendDto.push(deepCopy(obj));
        }
        this.headerGridArr.push(row);
        this.onUpdate()
    }
    // 删除卡片
    delClick(e,i) {
        this.actionDelVisible = true;
        this.ItemIndex = i;
        this.onUpdate()
    }
    _deleteonActiRowImpl() {
        this.headerGridArr.splice(this.ItemIndex,1);
        this.actionDelVisible = false;
    }
    // 复制卡片
    copyClick(e,obj) {
        this.headerGridArr.push(deepCopy(obj))
        this.onUpdate()
    }
    onFormValueChanged(e,w) {
        console.log(e,w)
    }
    //增行 弃用
    addItemClick(e,i) {
        let CardNo = this.headerGridArr[i].detailSource.length + 1;
        this.headerGridArr[i].detailSource.push({
            CardNo: CardNo
        })
    }
    //删行 弃用
    delItemClick(e,i) {
        let key = this.headerGridArr[i].detailSource.length - 1;
        this.headerGridArr[i].detailSource.splice(key,1);
    }

    jumpData() {
        if (!this.numericalOrder) {
            return
        }
    }

    queryDetail() {
        this.UpdateType = false;
        this._service.SetDetail(this.numericalOrder).then((res:any) => {
            this.dataFormData = res.data[0];
            this.headerGridArr = res.data[0].Details.map( m => {
                m['BreedingIDArr'] = m.BreedingIDs.split(',');
                m['MaterialSettingsExtendDto'] = m.Extends;
                return m
            });
            
            setTimeout(() => {
                this.onRestore();
                this.UpdateType = true;
            }, 50);
        })
        
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
        console.log(data)
        if (data.IsAdd) {
            // if (this.SubmitStatus == 1) {
                // Notify.warning('请先提交审核');
                // return Promise.resolve({ code: -1 });
            // }
        }
        return this._service.operationReview(data);
    }
    /** 审核状态变更 */
    onReviewOptionChanged(e: { items: any[] }) {
        if (e.items.filter(m => m.reviewed).length > 0) {
            this.submited = true;
            this.reviewed=true;
            setTimeout(() => {
                this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = true;
                this.$addList = true;
                this.onRestore();
            }, 500);
        }else{
            this.reviewed=false;
            this.submited = false;
            this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = false;
            this.$addList = false;
        }
    }

    onChanged() {
        if (this.UpdateType) {
            this.onUpdate()
        }
    }

    private getSaveData() {
        if (this.reviewed) {
            Notify.warning('单据已审核！');
            return null;
        }
        let value = this.dataFormData;
        value.body = this.headerGridArr.map(m => {
            m.BreedingIDs = m.BreedingIDArr.join(',');
            return m
        })
        for (let i = 0; i < value.body.length; i++) {
            const element = value.body[i];
            element['detail'] = [];
            for (let j = 0; j < element.MaterialSettingsExtendDto.length; j++) {
                const row = element.MaterialSettingsExtendDto[j];
                if (row.ProductID && row.ProductID != '0') {
                    if (row.StartDaysOld === '' || row.EndDaysOld === '') {
                        console.log(row)
                        Notify.toast(`第${i+1}个卡片，第${j+1}行日龄不能为空！`, NotifyType.Error);
                        return null
                    }
                    element['detail'].push(row)
                }
            }
            if (element.BreedingIDArr.length > 0 && element.detail.length == 0) {
                Notify.toast('品种非空的卡片，明细表不能都为空！', NotifyType.Error);
                return null
            }
        }
        if (!value.EffectDate) {
            Notify.toast('生效日期不能为空！', NotifyType.Error);
            return null
        }
        let saveData = new yhmaterialsettingsModel();
        const date = new DateTime(value.DataDate.toString()).toString('yyyy-MM-dd');
        const EffectDate = new DateTime(value.EffectDate.toString()).toString('yyyy-MM-dd');
        saveData.DataDate = date;
        saveData.ModifiedDate = value.ModifiedDate || value.DataDate;
        saveData.EffectDate = value.EffectDate ? EffectDate : date;
        saveData.FilesDto = this.fileList || [];
        saveData.Remarks = value.Remarks || '';
        saveData.Number = value.Number || '0';
        saveData.NumericalOrder  = value.NumericalOrder || '0';
        value.body.map((m) => {
            saveData.MaterialSettingsDetailDto.push({
                NumericalOrder: m.NumericalOrder || '0',
                NumericalOrderDetail: m.NumericalOrderDetail || '0',
                BreedingIDs: m.BreedingIDs || "0",
                StartDaysOld: m.StartDaysOld || 0,
                EndDaysOld: m.EndDaysOld || 0,
                FemaleWeight: m.FemaleWeight || 0,
                MaleWeight: m.MaleWeight || 0,
                MixedWeight: m.MixedWeight || 0,
                BreedingIDArr: m.BreedingIDArr || [],
                RecordID: m.RecordID || '',
                MaterialSettingsExtendDto: m.detail.map( row => {
                    row.RecordID = row.RecordID || '0',
                    row.StartDaysOld = row.StartDaysOld || 0,
                    row.EndDaysOld = row.EndDaysOld || 0,
                    row.FemaleWeight = row.FemaleWeight || 0,
                    row.MaleWeight = row.MaleWeight || 0,
                    row.MixedWeight = row.MixedWeight || 0,
                    row.Specification = row.Specification || '0',
                    row.Stages = row.Stages || '0',
                    row.MeasureUnitName = row.MeasureUnitName || '0',
                    row.Remarks = row.Remarks || '',
                    row.NumericalOrder = row.NumericalOrder || '0',
                    row.NumericalOrderDetail = row.NumericalOrderDetail || '0'
                    return row
                })
            });
        });
        return saveData;
    }

    //参考新增
    dataCopyClick() {
        this.numericalOrder = null;
        this.dataFormData.Number = '';
        this.dataFormData.NumericalOrder = '';
        this.dataFormData.EffectDate = '';
        this.$addList = false;
        this.mode = 'create';
        this.reviewed = false;
        this.submited = false;
    }

    /** 新增 */
    onCreate() {
        this.mode = 'create';
        this.reviewed = false;
        this.submited = false;
        this.dataFormData = new yhmaterialsettingsModel();
        this.headerGridArr = [];
        this.$addList = false;
        let row = new yhmaterialsettingsDataModel();
        let obj = new YHFarmerConcertRelateDto();
        for (let index = 0; index < 6; index++) {
            row.MaterialSettingsExtendDto.push(deepCopy(obj));
        }
        this.headerGridArr.push(row);
        this.numericalOrder = null;
        this.UpdateType = true;
        
    }
    /** 保存 */
    onSave() {
        const data = this.getSaveData();
        if (this.mode == 'create') {
            if (data) {
                this._service.post(data).then((res:any) => {
                    const response = ResponseSuccess.handle(res);
                    if (response.status) {
                        Notify.success('保存成功');
                        this.numericalOrder = res.data.NumericalOrder;
                        //开启审核功能
                        this.mode = 'edit';
                        this._editorGrid._remoteReveiw.instance.refresh(this.numericalOrder);
                        this.queryDetail();
                    } else {
                        this.messageBoxVisible = true;
                        if (response.message instanceof Array) {
                            this.messageBoxInfo = response.message;
                        }
                    }
                })
            }
        } else {
            if (data) {
                this._service.put(data).then((res:any) => {
                    const response = ResponseSuccess.handle(res);
                    if (response.status) {
                        Notify.success('保存成功');
                        this.numericalOrder = res.data.NumericalOrder;
                        this.queryDetail();
                    } else {
                        this.messageBoxVisible = true;
                        if (response.message instanceof Array) {
                            this.messageBoxInfo = response.message;
                        }
                    }
                })
            }
        }
    }
    /** 撤销 */
    onCancel() {
        if (this.mode == 'create') {
            this.dataFormData = new yhmaterialsettingsModel();
            this.headerGridArr = headerGridArr;
            this.numericalOrder = null;
            this.UpdateType = true;
        } else {
            this.queryDetail();
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
            if (tabId0.OutRecycleQuantity == 0) {
                tabId0['EachGrossProfit'] = 0;
            } else {
                tabId0['EachGrossProfit'] = (tabId0.GrossProfit / tabId0.OutRecycleQuantity).toFixed(2);
            }

            let tabId1 = [];
            let tabId2 = [];
            let tabId3 = [];

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
