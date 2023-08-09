import { Component, OnInit, ViewChild } from '@angular/core';
import { batchCompanyProfitModel, detailSourceArr } from '../batchCompanyProfit.model';
import { PrintPageComponent } from 'nxin-print';
import { environment } from 'src/environments/environment';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { groupBy } from 'src/app/providers/groupby';
import { TokenAuthService } from 'src/app/shared/services';
import { DateTime } from 'src/app/providers/common/datetime';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { batchCompanyProfitService } from '../batchCompanyProfit.service';
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';
import { ActivatedRoute } from '@angular/router';
import { DataDictionary, DataDictionarySource, FormOptions } from 'src/app/providers/enums';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { ResponseSuccess, Result } from 'src/app/providers/result';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { QlwODataContext, QlwCustomerContext } from 'src/app/providers/odataContext';
import DataSource from 'devextreme/data/data_source';
import { DxFormComponent, DxDataGridComponent } from 'devextreme-angular';
import { EditorGridComponent } from 'src/app/components/editor-grid';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { EditorReviewRemoteComponent } from 'src/app/components/editor-grid/editor-review-remote/editor-review-remote.component';

@Component({
    selector: 'app-batchCompanyProfit-detail',
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],
})
export class batchCompanyProfitDetailComponent implements OnInit {
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
    // @ViewChild('formListInstance', { static: false })
    // formListInstance: NxFormListComponent;
    @ViewChild('detailGrid', { static: false })
    _detailGrid: DxDataGridComponent;
    mode: 'create' | 'edit';
    dataFormData: any = new batchCompanyProfitModel();
    addFormData: any = {
        DataDate: new Date(),
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
    detailSource: any = [];
    //表体配置
    detailSourceArr: any = detailSourceArr[0].data;
    //打印配置
    /** APPID */
    appId: string = USER_INFO_CONTEXT.menuId;
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
    ReceiveVisible: boolean = false;
    tableHeight: number = 300;
    constructor(
        private route: ActivatedRoute,
        private tokenService: TokenAuthService,
        private _service: batchCompanyProfitService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private qlwOdataContext: QlwODataContext,
        private qlwCustomerContext: QlwCustomerContext
    ) {
        this.tableHeight = window.innerHeight - 360 - 56 - 140;
        this.mode = this.route.snapshot.queryParams.mode || 'create';
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.detailSourceArr = this.DataRecombination();
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
        this.getReviewInfo = this.getReviewInfo.bind(this);
        this.operationReview = this.operationReview.bind(this);
        // 养户
        this.YHFarmerSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [['Status', '=', true]],
        });
        //养户批次
        this.YHBatchSource = this.YHBasicSettingODataContext.getYHBatchDataSource({
            filter: [['SettleFlag', '=', false]],
        });

        if (this.route.queryParams['value']['$open'] == FormOptions.$create) {
            this.onCreate();
        } else {
            this.queryDetail();
        }
    }

    async ngOnInit() {}

    toggleDefault(id) {
        if (id != 'ChickenReceiveDate' || !this.dataFormData['AllChickenReceiveDate']) {
            return;
        }
        this.ReceiveVisible = !this.ReceiveVisible;
    }

    getYhFarmingPerson(e) {
        //人员
        let page = `?YHFarmerID=${e.YHFarmerID}`;
        this._service.YhFarmingPerson(page).then((res: any) => {
            this.PersonSource = res;
            this.onRestore();
            setTimeout(() => {
                this.UpdateType = true;
            }, 500);
            // if (res.length == 1) {
            //     this.dataFormData.PersonID = res[0].PersonID;
            // }
        });
    }

    queryDetail() {
        console.log('queryDetail');
        this.UpdateType = false;

        this._service.BatchEnterProfitDetail(this.numericalOrder).then((res: any) => {
            this.dataFormData = res.data[0];
            this.detailSource = res.data[0]['dets'];
            this.detailSource.forEach((v, i) => {
                v['id_record'] = i + 1;
            });
        });
    }

    queryBillDetail() {
        if (!this.numericalOrder) {
            return;
        }
        let page = `?NumericalOrder=${this.numericalOrder}&YIndex=${this.YIndex}&XIndex=${this.XIndex}`;
        let name = this.XIndex + '-' + this.YIndex;
        if (this.dataBillDetail[name]) {
            this.detailSource = this.dataBillDetail[name];
            return;
        }
        //次品数量
        this.dataFormData['DefectiveGoodsQuantity'] = 0;
        this._service.BatchEnterProfitBillDetail(page).then((res: any) => {
            this.dataBillDetail[name] = res.data;
            this.detailSource = res.data;
            //次品数量
            for (let i = 0; i < res.data.length; i++) {
                const element = res.data[i];
                if (
                    element.PoultrySalesRank == '2301110928400000250' ||
                    element.PoultrySalesRank == '2301110928400000350'
                ) {
                    this.dataFormData['DefectiveGoodsQuantity'] += element.Quantity;
                }
            }
        });
    }

    DataRecombination() {
        let arr = [];
        for (let index = 0; index < detailSourceArr.length; index++) {
            const element = detailSourceArr[index];
            if (element.XIndex.indexOf(this.XIndex) != -1 && element.YIndex.indexOf(this.YIndex) != -1) {
                arr.push(element);
            }
        }
        return arr;
    }

    onUpdate() {
        setTimeout(() => {
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled = false;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'cancel-btn').disabled = false;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'export-btn').disabled = false;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'delete-btn').disabled = false;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'add-btn').disabled = true;
        }, 200)
    }

    // 初始按钮状态
    onRestore() {
        setTimeout(() => {
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'add-btn').disabled = false;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled = true;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'cancel-btn').disabled = true;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'export-btn').disabled = true;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'delete-btn').disabled = true;
        }, 200)
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
    onReviewOptionChanged(e: { items: any[] }) {
        // let detailDataSource = this._service._detailInfoUtil.getSaveData();
        // let obj = detailDataSource.filter(item => item.target == DataStatus.Edit);
        // if (obj.length != 0) {
        //     this.reviewed=false;
        //     this.submited =false;
        //     Notify.warning('请先保存数据，然后再操作');
        //     return
        // }
        if (e.items && e.items.filter((m) => m.reviewed).length > 0) {
            this.reviewed = true;
            // this.submited =true;
            setTimeout(() => {
                this.onRestore();
            }, 500);
        } else {
            this.reviewed = false;
            // this.submited =false;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'export-btn').disabled = false;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'delete-btn').disabled = false;
        }
    }
    onYHFarmerIDChanged(e) {
        let filter = [
            ['Status', '=', true],
            ['YHFarmerID', '=', e.value],
        ];
        new DataSource(
            this.YHBasicSettingODataContext.getYHBatchDataSource({
                filter: filter,
            })
        )
            .load()
            .then((res: any) => {
                if (res && res.length > 0) {
                    this.YHBatchSource = res;
                    if (res.length == 1) {
                        this.dataFormData['YHBatch'] = res[0].YHBatchID;
                        this.dataFormData['ChickenFarmID'] = res[0].ChickenFarmID;
                    } else {
                        this.dataFormData['YHBatch'] = '0';
                        this.dataFormData['ChickenFarmID'] = '0';
                    }
                } else {
                    this.dataFormData['ChickenFarmID'] = '0';
                    this.YHBatchSource = [];
                }
            });
    }

    onYHBatchChanged(e) {}

    onChanged() {
        if (this.UpdateType) {
            this.onUpdate();
        }
    }

    addConfirm(e) {
        console.log('e: ', e);
        if (!e) {
            this.addVisible = false;
            this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'add-btn').disabled = false;
        } else {
            this.loading = true;
            let validation = this.addFormInstance.instance.validate().isValid;
            if (validation) {
                this._service
                    .post({
                        DataDate: new DateTime(this.addFormData.DataDate).toString('yyyy/MM/dd'),
                        YHFarmerID: this.addFormData.YHFarmerID,
                        YHBatch: this.addFormData.YHBatch,
                        // NumericalOrder: '0',
                    })
                    .then((res: any) => {
                        this.loading = false;
                        const response = ResponseSuccess.handle(res);
                        if (response.status) {
                            Notify.success('保存成功');
                            this.numericalOrder = res.data.NumericalOrder;
                            this.dataBillDetail = {};
                            this.queryDetail();
                            this.addVisible = false;
                            // this._editorGrid._toolbar._buttons.find(
                            //     (m) => m.elementAttr['name'] == 'add-btn'
                            // ).disabled = false;
                            // this._editorGrid._toolbar._buttons.find(
                            //     (m) => m.elementAttr['name'] == 'delete-btn'
                            // ).disabled = false;

                            this.onUpdate();
                        } else {
                            Notify.error(response.message);
                        }
                    });
            } else {
                this.loading = false;
            }
        }
    }

    onFieldDataChanged(e) {
        if (e.dataField == 'YHFarmerID') {
            let filter = [
                ['Status', '=', true],
                ['YHFarmerID', '=', e.value],
            ];
            new DataSource(
                this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                })
            )
                .load()
                .then((res: any) => {
                    if (res && res.length > 0) {
                        this.YHBatchSource = res;
                        if (res.length == 1) {
                            this.addFormData['YHBatch'] = res[0].YHBatchID;
                            this.dataFormData['ChickenFarmID'] = res[0].ChickenFarmID;
                        } else {
                            this.addFormData['YHBatch'] = '0';
                            this.dataFormData['ChickenFarmID'] = '0';
                        }
                    } else {
                        this.dataFormData['ChickenFarmID'] = '0';
                        this.YHBatchSource = [];
                    }
                });
        }
    }
    /** 新增 */
    onCreate() {
        console.log('onCreate');
        this.mode = 'create';
        this.reviewed = false;
        this.addVisible = true;
        // 新增默认禁用按钮
        setTimeout(() => {
            this.onRestore();
        }, 500);

        // this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'export-btn').disabled = true;
    }
    /** 保存 */
    onSave() {
        if (this.reviewed) {
            Notify.warning('单据已审核！');
            return null;
        }
        let obj = this.dataFormData;
        // obj.PersonID = obj.PersonIDs.join(',');
        // obj.DataDate = new DateTime(this.dataFormData.DataDate).toString('yyyy/MM/dd');
        this._service.put(obj).then((res: any) => {
            const response = ResponseSuccess.handle(res);
            if (response.status) {
                Notify.success('修改成功');
                this.mode = 'edit';
                this.numericalOrder = res.data.NumericalOrder;
                this._editorGrid._remoteReveiw.instance.refresh(this.numericalOrder);
                this.queryDetail();
            } else {
                Notify.error(response.message);
            }
        });
    }
    /** 撤销 */
    onCancel() {
        if (this.mode == 'create') {
            console.log(111);
            this.addVisible = false;
            this.dataFormData = new batchCompanyProfitModel();
            // this.numericalOrder = null;
            this.UpdateType = true;
            this.queryDetail();
        } else {
            console.log(222);
            this.addVisible = false;
            this.queryDetail();
        }
    }

    /**
     * 导出表体
     */
    onExport() {
        console.log('export');
        this._detailGrid.export.fileName = `${new DateTime().toString()}`;
        this._detailGrid.instance.exportToExcel(false);
    }

    /** 删除 */
    onDelete() {
        MessageBox.confirm('您确定要删除这张单据吗?').then((confirm) => {
            if (confirm) {
                this._service.delete(this.dataFormData.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.success('删除成功');
                        // this.onCancel(); 123
                        // this.deleted = true;
                        // this._editorGrid.instance.setToolbarStatusAfterDeleted();


                        this.mode = 'create';
                        this.reviewed = false;

                        this.dataFormData = new batchCompanyProfitModel();
                        this.onRestore()
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
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=批次公司利润`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2303201441430000150&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=批次公司利润`
                );
            }
        );
    }

    identityRecordCellTemplate(cellElement, cellInfo) {
        cellElement.innerText =
            parseInt(cellInfo.rowIndex) +
            1 +
            parseInt(cellInfo.component.pageSize()) * parseInt(cellInfo.component.pageIndex());
    }

    getSource(e) {
        if (!this.numericalOrder) {
            Notify.error('未完成单据不支持打印！');
            return;
        }
        if (e.status) {
            // 表头赋值
            const tabId0 = deepCopy(this.dataFormData);

            const tabId1 = this.detailSource._items ? this.detailSource._items : this.detailSource;

            const sources = {
                tabId0: tabId0,
                tabId1: tabId1,
            };

            var direct = false;
            if (e.isDirect) {
                direct = true;
            }

            this._printPage.instance.printGeneration(sources);
        }
    }
}
