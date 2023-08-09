import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { yhsettlementsettingModel, 
    yhsettlementsettingDataModel,
     columnSettingArr1, 
     columnSettingArr2, 
     columnSettingArr3,
     columnSettingArr4
} from '../yhsettlementsetting.model';
import { PrintPageComponent } from 'nxin-print';
import { environment } from 'src/environments/environment';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { groupBy } from 'src/app/providers/groupby';
import { TokenAuthService } from 'src/app/shared/services';
import { DateTime } from 'src/app/providers/common/datetime';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { yhsettlementsettingService } from '../yhsettlementsetting.service'
import { FormulaComputingComponent } from 'src/app/components/formula-computing/formula-computing.component';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';

@Component({
    selector: 'app-yhsettlementsetting-detail',
    templateUrl: './yhsettlementsetting-detail.component.html',
    styleUrls: ['./yhsettlementsetting-detail.component.scss'],
})
export class yhsettlementsettingDetailComponent implements OnInit {
    permission: PermissionService = new PermissionService();
    mode: 'create' | 'edit';
    dataFormData: any = new yhsettlementsettingModel();
    //打印
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    YHFarmerSource: any;
    YHBatchSource: any;
    ChickenFarmSource: any;
    warehouseSource: any;
    PersonSource: any;
    MaxDataDate: any = new Date();
    menu_id: string;
    environment: any;
    tokenData: any;
    //自定义表头配置参数 网状表格不需设置
    //展开/收起 
    expressionType1: boolean = true;
    expressionType2: boolean = true;
    expressionType3: boolean = true;
    expressionType4: boolean = true;
    //header高度
    labelHeight1: string = 'auto';
    labelHeight2: string = 'auto';
    labelHeight3: string = 'auto';
    labelHeight4: string = 'auto';
    //组件显示/隐藏
    HeaderVisible1: boolean = true;
    HeaderVisible2: boolean = true;
    HeaderVisible3: boolean = true;
    HeaderVisible4: boolean = true;
    itemWidthNum: Number = 1;
    // 自定义配置
    ColumnSettingArr: any = [
        {
            text: 'title1',
            name: 'columnSettingArr1',
        },{
            text: 'title2',
            name: 'columnSettingArr2'
        },{
            text: 'title3',
            name: 'columnSettingArr3'
        }
    ];
    title1: string = '批次信息设置';
    columnSettingArr: any = columnSettingArr1;
    title2: string = '关键指标设置';
    columnSettingArr2: any = columnSettingArr2;
    title3: string = '结算汇总设置';
    columnSettingArr3: any = columnSettingArr3;
    title4: string = '其他设置';
    columnSettingArr4: any = columnSettingArr4;
    detailSource: any = [
        {
            NumericalOrder: 1,
            ProductName: '123123',
            Specification: '件',
            MeasureUnitName: '只',
            UnitPrice: 11,
            OldUnitPrice: 50
        },{
            NumericalOrder: 2,
            ProductName: '123123',
            Specification: '件',
            MeasureUnitName: '只',
            UnitPrice: 11,
            OldUnitPrice: 50
        },{
            NumericalOrder: 3,
            ProductName: '123123',
            Specification: '件',
            MeasureUnitName: '只',
            UnitPrice: 11,
            OldUnitPrice: 50
        },{
            NumericalOrder: 4,
            ProductName: '123123',
            Specification: '件',
            MeasureUnitName: '只',
            UnitPrice: 11,
            OldUnitPrice: 50
        },{
            NumericalOrder: 5,
            ProductName: '123123',
            Specification: '件',
            MeasureUnitName: '只',
            UnitPrice: 11,
            OldUnitPrice: 50
        },{
            NumericalOrder: 6,
            ProductName: '123123',
            Specification: '件',
            MeasureUnitName: '只',
            UnitPrice: 11,
            OldUnitPrice: 50
        },{
            NumericalOrder: 7,
            ProductName: '123123',
            Specification: '件',
            MeasureUnitName: '只',
            UnitPrice: 11,
            OldUnitPrice: 50
        },
    ];
    //打印配置
    columnSettingData:any = new yhsettlementsettingDataModel();
    /** APPID */
    appId: string=USER_INFO_CONTEXT.menuId;
    /** 用户ID */
    userId = USER_INFO_CONTEXT.userId;
    // 
    visible: boolean = false;
    @ViewChild('formulaComputing', { static: false })
    formulaComputing: FormulaComputingComponent;
    settingFieldsValues: any = [];
    FieldsType: string;
    selectData: any;
    FarmingPriceVisible: boolean = false;
    youngMerchandiseData: any = [
        {
            name: '肉禽出栏回收',
            type: false
        },{
            name: '养户领苗单',
            type: false
        },{
            name: '养户领料单',
            type: false
        },{
            name: '药杂领用单',
            type: false
        }
    ]
    constructor(
        private tokenService: TokenAuthService,
        private _service: yhsettlementsettingService,
        public changeDetectorRef: ChangeDetectorRef
    ) {
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
        this.getReviewInfo = this.getReviewInfo.bind(this);
        this.operationReview = this.operationReview.bind(this);
        this.permission.refresh(this.tokenService.getTokenData.permissions);
        // this.permission.$$edit
        console.log(this.permission.$$edit,'是否有编辑权限')
        //在页面初始化的时候监听message事件
        window.parent.addEventListener('message',(obj) => {
            let data = obj.data;
            if (data && data.calculatorParams) {
                //反序列化组件返回值，返回参数详见下表
                let { calculatorParams, closeIframe } = data;
                let calculatorParamsJSON = JSON.parse(calculatorParams);
                this.columnSettingData[this.FieldsType] = calculatorParamsJSON.script;
                if (this.selectData.Expression != calculatorParamsJSON.script && closeIframe) {
                    this.selectData.Expression = calculatorParamsJSON.script;
                    this.sureFormula("");
                } else {
                    this.visible = false;
                    this.changeDetectorRef.detectChanges();
                }
            }
        },false);
        this.init();
    }

    async ngOnInit() {

    }

    init() {
        //查询
        this._service.getYHSettlementsetting().then((res:any) => {
            this.settingFieldsValues = res;
            for (let i = 0; i < res.length; i++) {
                const element = res[i];
                this.columnSettingData[element.FieldsType] = element.Expression;
            }
        })
    }

    delConfirm(type) {
        if (type) {
            let arr = [];
            for (let i = 0; i < this.youngMerchandiseData.length; i++) {
                const element = this.youngMerchandiseData[i];
                if (element.type) {
                    arr.push(element.name)
                }
            }
            this.columnSettingData[this.FieldsType] = arr.join(',');
            this.selectData.Expression = arr.join(',');
            this._service.save(this.selectData).then((res:any) => {
                this.FarmingPriceVisible = false
            })
        } else {
            this.FarmingPriceVisible = false
        }
        
    }

    onValueChangedItem(e,row) {
        console.log(e,row)
    }

    clickList(e,type) {
        if (!this.permission.$$edit) {
            Notify.toast('您没有编辑权限！');
            return
        }
        let obj = this.settingFieldsValues.filter(o => o.FieldsType == e.dataField)[0];
        this.FieldsType = obj.FieldsType;
        this.selectData = obj;
        if (type) {
            let arr = obj.Expression.split(',');
            for (let i = 0; i < this.youngMerchandiseData.length; i++) {
                const element = this.youngMerchandiseData[i];
                if (arr.indexOf(element.name) != -1) {
                    element.type = true
                }
            }
            this.FarmingPriceVisible = true;
            return
        }
        this.visible = true;
        setTimeout(() => {
            this.formulaComputing.script = this.columnSettingData[obj.FieldsType];
            this.formulaComputing.fields = obj.FieldsValues || [];
            this.formulaComputing.isGroup = true;
            this.formulaComputing.sureFormula(); 
        }, 0);
    }

    sureFormula(e) {
        this._service.save(this.selectData).then((res:any) => {
            this.visible = false;
            this.changeDetectorRef.detectChanges();
        })
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

    onYHFarmerIDChanged(e) {

    }

    onYHBatchChanged(e) {

    }

    onChanged() {

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
        console.log(e,'???????????')
        // if (!(this.dataFormData.Status == 2) && !(this.dataFormData.Status == 3)) {
        //     Notify.error('未完成单据不支持打印！');
        //     return
        // }
        if (e.status) {
            // 表头赋值
            var tabId0 = this.columnSettingData;
            tabId0['DataDate'] = new DateTime(this.dataFormData.DataDate).toString();
            tabId0['YHFarmerID'] = this.dataFormData.YHFarmerID;
            tabId0['YHBatch'] = this.dataFormData.YHBatch;
            tabId0['PersonID'] = this.dataFormData.PersonID;
            tabId0['AccountMonth'] = this.dataFormData.AccountMonth;
            tabId0['YHFarmerContract'] = this.dataFormData.YHFarmerContract;
            tabId0['SerialNo'] = this.dataFormData.SerialNo;
            tabId0['ChickenFarmID'] = this.dataFormData.ChickenFarmID;
            tabId0['remainingsum'] = this.dataFormData.remainingsum;
            tabId0['FarmingPriceID'] = this.dataFormData.FarmingPriceID;
            tabId0['Number'] = this.dataFormData.Number;
            tabId0['Remarks'] = this.dataFormData.Remarks;

            let tabId1 = [];

            tabId1.push(tabId0)
            let tabId2 = [];

            console.log(tabId1)

            let sources = {
                tabId0: tabId0,
                tabId1: tabId1,
                tabId2: tabId2
            };

            var direct = false;
            if (e.isDirect) {
                direct = true;
            }
            
            this._printPage.instance.printGeneration(sources);
        }
    }
    /** 审核状态变更 */
    onReviewOptionChanged(e: { items: any[] }) {
        // if (e.items.filter(m => m.reviewed).length > 0) {
        //     this.submited = true;
        //     this.reviewed=true;
        //     this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = true;
        // }else{
        //     this.reviewed=false;
        //     this.submited = false;
        //     this._editorGrid._toolbar._buttons.find(m => m.elementAttr['name'] == 'delete-btn').disabled = false;
        // }
    }
}
