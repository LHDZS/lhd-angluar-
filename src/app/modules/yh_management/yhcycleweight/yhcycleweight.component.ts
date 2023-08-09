import { Component, OnInit, ViewChild } from '@angular/core';
import { YhCycleWeightService } from './yhcycleweight.service';
import { DxDataGridComponent } from 'devextreme-angular';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { DataDictionary } from 'src/app/providers/enums';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { YhCycleWeightModel, gridRefColumns} from './yhcycleweight.model';
import { DataStatus, EditorGridComponent, EditorToolbarComponent } from 'src/app/components/editor-grid';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { Distinct } from 'src/app/providers/distinct';
import { formatDate } from 'src/app/providers/formatDate';
import { groupBy } from 'src/app/providers/groupby';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';
import {
    QlwODataContext,
    QlwCustomerContext,
    QlwProductContext,
    BasicSettingODataContext,
} from 'src/app/providers/odataContext';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
// 搜索列表
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxSearchPanel, NxConditionItem } from 'src/app/components/header-search-panel/header-search-panel-extend';
import { NxToolbarPanel, ColumnSetting } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
// 详情
import { DxFormComponent } from 'devextreme-angular';
import { DateTime } from 'src/app/providers/common/datetime';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { PrintPageComponent } from 'nxin-print';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { TokenAuthService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { RegExps } from 'src/app/providers/regexp';

import {$WebSocket} from 'angular2-websocket/angular2-websocket'
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { ActivatedRoute, Router } from '@angular/router';
import { funcUrlDel } from 'src/app/providers/common/funcUrlDel';

@Component({
    selector: 'yhcycleweight',
    templateUrl: './yhcycleweight.component.html',
    styleUrls: ['./yhcycleweight.component.scss'],
    providers: [YhCycleWeightService],
})
export class YhCycleWeightComponent implements OnInit {
    // 报错
    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;
    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;
    messageBoxVisible: boolean = false;
    messageBoxInfo: string[] = [];
    @ViewChild('rangePicker', { static: false })
    rangePickerInstance;
    // 搜索列表
    headerFormData: any = {
        DataDate: []
    };
    StateTypeSource: any;
    YHFarmerSource: any;
    CustomerSource: any;
    totalValue: Number = 0;
    detailDataSource: any = [
        // {
        //     status:'进行中',
        //     NumericalOrder: '1'
        // }
    ];
    colorStatusArr: any = {
        0:{color:'#F56C6C'},
        1:{color:'#E6A23C'},
        2:{color:'#67C23A'},
        3:{color:'#67C23A'},
        4:{color:'#67C23A'}
    };
    StatusNames:any = {
        0:'作废',
        1:'进行中',
        2:'已完成',
        3:'已结算',
        4:'订单完成'
    };
    // 内容详情
    @ViewChild('editorGrid', { static: false })
    _editorGrid: EditorGridComponent;
    employee: any;
    //打印
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    menu_id: string;
    environment: any;
    tokenData: any;
    //毛重表单
    roughForm: any = {
        GrossWeight: '',
        Quantity: null,
        CageQuantity: '',
    };
    roughDetailDataSource: any;
    @ViewChild('roughDetailGrid', { static: false })
    _roughDetailGrid: DxDataGridComponent;
    roughDetailSelectedRows: any;
    ModeSource: any = [
        {name:'自动',value:1},{name:'手动',value:0}
    ];
    TypeSource: any = [
        {name:'作废',value:0},{name:'正常',value:1}
    ];
    totalValueNames: any = {
        'BareWeight': 0,
        'CageQuantity': 0
    };
    rightTotalValueNames: any = {
        'GrossWeight': 0,
        'CageQuantity': 0,
        'Quantity': 0,
        'VehicleWeight': 0
    };
    //皮重表单
    tareForm: any = {
        BareWeight: '',
        CageQuantity: ''
    };
    tareDetailDataSource: any;
    @ViewChild('tareDetailGrid', { static: false })
    _tareDetailGrid: DxDataGridComponent;
    tareDetailSelectedRows: any;
    // 表头数据
    $savBtn: boolean = true;
    CustomerID: string = '';
    MaxDataDate: any = new Date();
    mode: 'create' | 'edit';
    isManageToHenhouse: any;
    YHBatchSource: any;
    ChickenFarmSource: any;
    HenHouseSource: any;
    PersonSource: any;
    warehouseSource: any;
    detailSource: any[];
    ProductSource: any;
    HenhouseSourceParam: any;
    AbstractSource: any;
    TicketedPointSource: any;
    //详情表头
    UpdateType: boolean = false;
    NumericalOrder: string = null;
    dataFormData: any = new YhCycleWeightModel();
    companies: any = [{
        ID: 1,
        RecycleType: '2201131629250004155',
        CompanyName: '回收销售',
        Abstract: DataDictionary.SalesTypeA
    },{
        ID: 2,
        RecycleType: '2201131629250004255',
        CompanyName: '过磅回收入库',
        Abstract: '0'
    },{
        ID: 3,
        RecycleType: '2201131629250004555',
        CompanyName: '过磅销售出库',
        Abstract: DataDictionary.SalesTypeA
    }];
    tabID:number = 1;
    loading: boolean = false;
    //预防多次点击
    submited: boolean = false;
    time: any;
    ranNum: string = '0';
    //
    @ViewChild('tareform', { static: false })
    tareFormInstance: DxFormComponent;
    @ViewChild('roughform', { static: false })
    roughFormInstance: DxFormComponent;
    limitCharacterFix2 = RegExps.APositiveNumberFix2;
    limitCharacter = RegExps.IntNumber2;
    limitnumber = RegExps.PositiveInteger1;
    // 弹框
    @ViewChild('completeGrigRef', { static: false })
    completeGrigRef: DxDataGridComponent;
    importVisible: boolean = false;
    importFormData: any = {};
    importSourceFilter: any;
    importSelectedRows: any;
    completeVisible: boolean = false;
    completeFormData: any = {
        WeightStatus: false
    };
    completeSourceFilter: any;
    completeSelectedRows: any;
    SalesPeriodNames: any = [
        {value:1, name:'上午'},{value:2, name:'下午'}
    ]
    WeightStatusSource: any = [
        {value:false, name:'待确认'},{value:true, name:'已确认'}
    ];
    @ViewChild('VehicleForm', { static: false })
    VehicleFormInstance: DxFormComponent;
    saveVisible: Boolean = false;
    saveVisibleType: string;
    VehicleSaveDisabled: Boolean = false;
    VehicleFormData: any = {};
    VehicleVisible: boolean = false;
    RecycleType: any = '2201131629250004155';
    PersonID: string;

    @ViewChild('editorToolbar', { static: false })
    _editorToolbar: EditorToolbarComponent;
    //弹出框表格数据存储
    storageKey: string = 'yhcycleweight-list-grid';
    gridRefColumns: any = gridRefColumns;

    headerItems: any = [{}];
    focusedRowKey: any;
    autoNavigateToFocusedRow: boolean = true;
    focusedRowEnabled: boolean = false;
    keyExpr: string;
    constructor(
        private service: YhCycleWeightService,
        private BasicOdataContext: BasicSettingODataContext,
        private statusOdataContext: StatusODataContext,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private qlwOdataContext: QlwODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private tokenService: TokenAuthService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        //带参数跳转打开
        this.NumericalOrder = this.route.queryParams['value']['NumericalOrder'];
        

        var ws = new $WebSocket(environment.WeightWsEndpoint);
        //建立链接
        ws.onOpen(function () {
            ws.send('发送的消息内容').subscribe(
            (msg) => {
               //连接成功此处打印成功的提示
                   console.log("next", msg.data);
               },
               (msg) => {
                  //连接失败则打印此信息
                    console.log("error", msg);
                },
                () => {
                    //不管有没有连接成功必须执行到此处
                     console.log("complete");
                    // 可在此处关闭连接，由你websocket实现的具体功能决定
                    // ws.close(false);    // close
                    // ws.close(true);    // close immediately
                }
            );
        });
        //监听窗口关闭事件，当窗口关闭时，主动去关闭websocket连接，防止连接还没断开就关闭窗口，server端会抛异常。
        window.onbeforeunload = function () {
            ws.close();
        };
        //接受服务器请求
        ws.onMessage(
            (msg: MessageEvent) => {
                let data = msg.data;
                if(/.*[\u4e00-\u9fa5]+.*$/.test(data)) {
                    this.ranNum = '0.00';
                } else {
                    this.ranNum = data;
                }
            },
            { autoApply: false }
        );
        //链接断开
        // ws.onClose(function () {
        //     this.ranNum = '0.00';
        //     console.log('链接关闭')
        // });
        this.onValueChangedEvent = this.onValueChangedEvent.bind(this);

        // //弹出框表格数据存储
        this.customStateStoringSave = this.customStateStoringSave.bind(this);
        this.customStateStoringLoad = this.customStateStoringLoad.bind(this);

        // 合计自定义计算
        this.calculateSummary = this.calculateSummary.bind(this);
        this.rightCalculateSummary = this.rightCalculateSummary.bind(this);

        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;

        this.headerFormData.DataDate=[
           new Date(new Date(new Date().getTime()).toLocaleDateString()),
           new Date(new Date(new Date().getTime()).toLocaleDateString())
        ]
        this.StateTypeSource = this.statusOdataContext.getWeighType()
        // 养户
        this.YHFarmerSource =  this.YHBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                [ 'Status', '=', true ]
            ]
        })
        // 客户
        this.CustomerSource = this.qlwCustomerContext.getCustomerDataSource();

        //摘要
        this.AbstractSource = this.statusOdataContext.getSalesTypeDataSource();

        //核算单元
        // this.TicketedPointSource = this.qlwOdataContext.getAccountagencyODataDataSource({
        //     select: ['TicketedPointId', 'TicketedPointName'],
        // });
        new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load()
        .then((res:any) => {
            if(res&&res.length>0){
                this.TicketedPointSource = res;
            }else{
                this.TicketedPointSource = [];
            }
            if (this.NumericalOrder) return
            this.getLastTicketedPoint();
        });

        // let filter = [['Status', '=', true]];
        // new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
        //     filter: filter
        // })).load().then((res:any) => {
        //     if(res&&res.length>0){
        //         this.YHBatchSource = res;
        //     }else{
        //         this.YHBatchSource = [];
        //     }
        // });
        //栋舍
        this.HenhouseSourceParam = this.service.getTransferData();

        //是否开启了禽养户单据管理到栋
        this.service.getConfiguration().then((res:any) => {
            this.isManageToHenhouse = res;
        })

        // 养殖场
        // this.ChickenFarmSource = this.BasicOdataContext.getBizChickenFarmDataSource({
        //     select: ['ChickenFarmID', 'ChickenFarmName'],
        // });
        this.BasicOdataContext.bizChickenFarm.load().then((res:any) => {
            this.ChickenFarmSource = res;
        })


        // new DataSource(this.qlwOdataContext.getQlWPersonOData()).load().then(res => {
        //     this.PersonSource = res;
        //     let obj = res.filter(m => m.UserID == USER_INFO_CONTEXT.userId )
        //     this.dataFormData.PersonID = obj[0].PersonID;
        // })

        //仓库
        this.BasicOdataContext.warehouseODataStore.load().then((res:any) => {
            this.warehouseSource = res;
        })

        //养户批次
        // this.YHBatchSource = this.YHBasicSettingODataContext.getYHBatchDataSource();

        //商品代号
        this.YHBasicSettingODataContext.BizProductPoultryManage.load().then(res => {
            this.ProductSource = res.filter(m => m.PoultryStatus == true);
        })
        
        // 车重取值
        this.getWeightAxios();  
    }

    ngOnInit() {
        //人员
        this.qlwOdataContext.personODataStore.load().then((res:any) => {
            this.PersonSource = res;
            let obj = res.filter(m => m.UserID == USER_INFO_CONTEXT.userId )
            this.dataFormData.PersonID = obj[0].PersonID;
            this.headerFormData.PersonID = obj[0].PersonID;
            this.PersonID = obj[0].PersonID;

            if (!this.NumericalOrder) {
                this.getListAxios();
            } else {
                this.acquireAxios(this.NumericalOrder,true);
            }
            // else {
            //     let e = this.companies[this.tabID - 1]
            //     this.TitleClick(e);
            // }
            
        })
        this.tareDetailDataSource = this.service.getTareDataSource();
        this.service._tareInfoUtil.init([]);
        this.roughDetailDataSource = this.service.getRoughDataSource();
        this.service._roughInfoUtil.init([]);
    }

    //弹出框表格数据存储 
    customStateStoringSave(e) {
        this._editorToolbar.customStateStoringSave(e,'gridRefColumns', this.storageKey);
    }

    customStateStoringLoad(e) {
        this._editorToolbar.customStateStoringLoad('gridRefColumns', this.storageKey);
    }

    // calss 类控制
    classType(item) {
        let str = []
        if (item.HeaderRequiredIcon) {
            str.push('required')
        }
        if (item.allowEditing === false) {
            // str.push('disabled')
        }
        return str.join(' ')
    }

    tabIDjudge(item) {
        if (item.dataField == 'CustomerName' && this.tabID == 2) {
            return false
        }
        if (item.dataField == 'YHFarmerName' && this.tabID == 3) {
            return false
        }
        if (item.dataField == 'YHBatchName' && this.tabID == 3) {
            return false
        }
        if (item.dataField == 'BreedingName' && this.tabID == 3) {
            return false
        }
        if (item.dataField == 'ProductName' && this.tabID == 3) {
            return false
        }
        return true
    }

    //tab切换
    TitleClick(e) {
        this.ranNum = '0';
        this.tabID = e.ID;
        this.dataFormData.RecycleType = e.RecycleType;
        this.dataFormData.Abstract = e.Abstract;
        this.RecycleType = e.RecycleType;
        this.NumericalOrder = null;
        this.resetSearch();
        if (e.ID == '1' && !this.isManageToHenhouse) {
            this.headerItems = [{}]
        } else {
            this.headerItems = []
        }
        let type = this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled;
        if (!type) {
            this.saveVisibleType = 'tab';
            this.saveVisible = true;
        } else {
            this.empty()
        }
    }
    // 状态色值
    StatusColor(status) {
        return this.colorStatusArr[status]
    }
    // 取车重存值
    getWeightAxios() {
        this.service.getWeight().then((res:any) => {
            if (res) {
                this.roughForm.VehicleWeight = res.VehicleWeight || '';
            }

        })
    }
    // 获取最近核算单元||获取最近仓库
    getLastTicketedPoint() {
        this.loading = true;
        this.service.GetLastTicketedPoint(this.RecycleType).then((res:any) => {
            if (res[0] && res[0].WarehouseID && res[0].WarehouseID != '0') {
                this.dataFormData.WarehouseID = res[0].WarehouseID;
            }
            if (res[0] && res[0].TicketedPointID && res[0].TicketedPointID != '0') {
                this.dataFormData.TicketedPointID = res[0].TicketedPointID;
            } else if (this.TicketedPointSource.length == 1) {
                this.dataFormData.TicketedPointID = this.TicketedPointSource[0].TicketedPointId
            } else {
                this.dataFormData.TicketedPointID = '0'
            }

            setTimeout(() => {
                this.loading = false;
                this.UpdateType = true;
            }, 500);
        })
    }
    // 查询列表
    getListAxios(type?) {
        var filterArr =  [];
        if (this.headerFormData.DataDate.length > 0) {
            filterArr.push(`((DataDate ge ${new DateTime(this.headerFormData.DataDate[0].toString()).toString('yyyy-MM-dd')}) and (DataDate le ${new DateTime(this.headerFormData.DataDate[1].toString()).toString('yyyy-MM-dd')}))`)
        }
        if (this.headerFormData.Status) {
            filterArr.push(`(Status eq ${this.headerFormData.Status})`)
        }
        if (this.headerFormData.CustomerID) {
            filterArr.push(`(CustomerID eq '${this.headerFormData.CustomerID}')`)
        }
        if (this.headerFormData.YHFarmerID) {
            filterArr.push(`(YHFarmerID eq '${this.headerFormData.YHFarmerID}')`)
        }
        if (this.headerFormData.PersonID) {
            filterArr.push(`(PersonID eq '${this.headerFormData.PersonID}')`)
        }

        filterArr.push(`(RecycleType eq '${this.RecycleType}')`)

        let filterSrc = filterArr.join(' and ');
        let filter = '';
        if (filterSrc.length != 0) {
            filter += '$filter=';
            filter += filterSrc;
        }
        this.service.getList(filter).then((res:any) => {
            this.keyExpr = 'NumericalOrder';
            this.focusedRowEnabled = true;
            if (type) {
                this.autoNavigateToFocusedRow = true;
                this.focusedRowKey = this.NumericalOrder;
            }
            this.detailDataSource = res.value.map(m => {
                m.CreatedDate = formatDate(m.CreatedDate,'yyyy/MM/dd hh:mm:ss');
                m.ModifiedDate = formatDate(m.ModifiedDate,'yyyy/MM/dd hh:mm:ss');
                m.WeightFinishTime = m.WeightFinishTime ? formatDate(m.WeightFinishTime,'yyyy/MM/dd hh:mm:ss') : '';
                m['StatusName'] = this.StatusNames[m.Status]
                return m
            });

            
        })
    }
    //列表事件
    onFieldDataChanged(e) {
    }
    // 单击列表
    onfocusedrowchanged(e) {
        console.log(e,this.saveVisible);
        let type = this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled;
        this.autoNavigateToFocusedRow = true;
        this.NumericalOrder = e.row.key;
        this.focusedRowKey = e.row.key;
        if (!type) {
            this.saveVisibleType = 'dbl';
            this.saveVisible = true;
        } else {
            this.acquireAxios(e.row.key);
        }
    }
    // 重置
    resetSearch() {
        this.focusedRowKey = '';
        this.autoNavigateToFocusedRow = false;
        this.headerFormData= {
            DataDate:[new Date(new Date(new Date().getTime()).toLocaleDateString()), new Date(new Date(new Date().getTime()).toLocaleDateString())],
            PersonID: this.PersonID
        }
        this.getListAxios()
    }
    // 查询
    querySearch() {
        this.getListAxios()
    }
    //详情事件
    // 栋舍选择前
    onHenhouseOpened(e) {
        if (this.dataFormData['YHBatch'] && this.dataFormData['YHBatch'] != '0') {
            this.getHenhouseByParamAxios(this.dataFormData['YHBatch'])
        }
    }
    //表单更新
    onChanged(e) {
        this.onUpdate(e);
    }
    //客户选择
    onCustomerChanged(e) {
        if (!this.UpdateType) return;
        if (this.CustomerID != e.value) {
            this.CustomerID = e.value;
            this.dataFormData.NumericalOrderRef = '0';
        }
        this.onUpdate('客户选择');
    };
    //日期选择
    onDataDateChanged(e) {
        if (!this.UpdateType) return;
        if (!this.dataFormData.YHFarmerID) return;
        this.GetGeTramsferBatch(new DateTime(e.value).toString(),this.dataFormData.YHFarmerID,'');
        this.onUpdate('日期选择');
    }
    //养户选择
    onYHFarmerIDChanged(e) {
        if (!this.UpdateType) return;
        this.dataFormData['YHBatch'] = '0';
        this.dataFormData['ChickenFarmID'] = '0';
        this.GetGeTramsferBatch(new DateTime(this.dataFormData.DataDate).toString(),e.value,'');
        this.onUpdate('养护选择');
    }
    GetGeTramsferBatch(DataDate,YHFarmerID,YHBatch) {
        this.service.getGeTramsferBatch(DataDate,YHFarmerID,YHBatch).then((res:any) => {
            this.YHBatchSource = res;
            if (!this.UpdateType) return;
            if(res&&res.length>0){
                if(res.length == 1){
                    this.dataFormData['YHBatch'] = res[0].YHBatchID;
                    this.dataFormData['ChickenFarmID'] = res[0].ChickenFarmID;
                    this.getHenhouseByParamAxios(res[0].YHBatchID);
                }
            }else{
                this.dataFormData['YHBatch'] = '0';
                this.dataFormData['ChickenFarmID'] = '0';
                this.YHBatchSource = [];
                this.HenHouseSource = [];
            }
        })
    }
    // 养户批次选择
    onYHBatchChanged(e) {
        if (!this.UpdateType) return;
        const selectedItem = e.component.option('selectedItem');
        if (selectedItem) {
            this.dataFormData['ChickenFarmID'] = selectedItem.ChickenFarmID || '0';
            // this.dataFormData['ChickenFarmName'] = selectedItem.ChickenFarmName || '0';
        }
        this.getHenhouseByParamAxios(e.value);
        this.onUpdate('批次选择');
    }
    //栋舍请求
    getHenhouseByParamAxios(value) {
        if (this.isManageToHenhouse) {
            //查当前(养户-批次)中的栋舍
            this.HenhouseSourceParam.filter([
                ["DataDate", "<=", new DateTime(this.dataFormData.DataDate.toString() || new DateTime())],
                ["YHBatchID", "=", value]
            ]);
            this.HenhouseSourceParam.group((m) => {
                return [m.HenhouseID, m.ProductID]
            });

            this.HenhouseSourceParam.load().then((res:any) => {
                // console.log(res)
                let HenhouseDic = {};
                let result = [];

                res = res.filter((h) => {
                    h.Quantity = 0;
                    h.HenhouseName = h.items[0].HenhouseName || '';
                    h.items.forEach(t => {
                        if(t.BIn) h.Quantity += t.Quantity;
                        else h.Quantity -= t.Quantity;
                    })
                    return h.Quantity > 0;
                });

                res.forEach(h => {
                    HenhouseDic[h['key'][0]] = h.HenhouseName || '';
                });

                for(let HenhouseID in HenhouseDic) {
                    if (HenhouseID && HenhouseID != '0') {
                        result.push({HenhouseID, HenhouseName: HenhouseDic[HenhouseID]});
                    }
                }

                if (result.length > 0) {
                    this.HenHouseSource = result;
                    if (result.length == 1) {
                        this.dataFormData['HenhouseID'] = result[0].HenhouseID;
                    }
                } else {
                    this.dataFormData['HenhouseID'] = '0';
                    this.HenHouseSource = [];
                }

            })
            // this.service.getHenhouseByParam(value).then((res:any) => {
            //     console.log(res,'栋舍')
            //     if (res && res.length > 0) {
            //         this.HenHouseSource = res;
            //         if (res.length == 1) {
            //             this.dataFormData['HenhouseID'] = res[0].HenhouseID;
            //         }
            //     } else {
            //         this.dataFormData['ChickenFarmID'] = '';
            //         this.dataFormData['ChickenFarmName'] = '';
            //         this.HenHouseSource = [];
            //     }
            // })
        }
    }
    //皮重 称重
    tareWeigClick(e) {
        let validation = this.tareFormInstance.instance.validate().isValid;
        if (!validation) {
            return
        }
        if (!this.tareForm.CageQuantity) {
            Notify.toast('请录入笼数信息！', NotifyType.Error);
            return
        }
        if (this.tareForm.CageQuantity <= 0) {
            Notify.toast('笼数必须大于0，请重新录入！', NotifyType.Error);
            return
        }
        this.tareForm.BareWeight = this.ranNum;
        if (this.tareForm.BareWeight <= 0) {
            Notify.toast('皮重必须大于0，请重新称重！', NotifyType.Error);
            return
        }
        this.totalValueNames = {
            'BareWeight': 0,
            'CageQuantity': 0
        };
        this.tareForm.Mode = 1;
        this.tareForm.Type = 1;
        this._tareAddRowImpl()
    }
    // 增加
    tareAddClick(e) {
        let validation = this.tareFormInstance.instance.validate().isValid;
        if (!validation) {
            return
        }
        if (!this.tareForm.CageQuantity || !this.tareForm.BareWeight) {
            Notify.toast('请录入正确皮重、笼数信息！', NotifyType.Error);
            return
        }
        if (this.tareForm.CageQuantity <= 0 || this.tareForm.BareWeight <= 0) {
            Notify.toast('皮重、笼数必须大于0！', NotifyType.Error);
            return
        }
        this.totalValueNames = {
            'BareWeight': 0,
            'CageQuantity': 0
        };
        this.tareForm.Mode = 0;
        this.tareForm.Type = 1;
        this._tareAddRowImpl()
    }
    // 取消 作废
    tareCancelClick(e) {
        // console.log(this._tareDetailGrid,'123123123');
        // console.log(this.tareDetailSelectedRows,'tareDetailSelectedRows')
        let _deleteKeys: any[] = this._tareDetailGrid.instance.getSelectedRowKeys();
        // console.log(_deleteKeys,'选择数据');
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        this.totalValueNames = {
            'BareWeight': 0,
            'CageQuantity': 0
        };
        let items = this.tareDetailDataSource._items;
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (_deleteKeys.indexOf(element.NumericalOrderDetail) != -1) {
                element.Type = element.Type ? 0 : 1;
            }
            element.BareWeight = element.BareWeight ? Number(element.BareWeight) : 0;
            element.CageQuantity = element.CageQuantity ? Number(element.CageQuantity) : 0;
        }
        this._tareDetailGrid.instance.refresh();
        this.submited = true;
        setTimeout(() => {
            this.UpdateType = false;
            this.saveVisibleType = '';
            this.onSave(false);
        }, 500);

    }
    _tareAddRowImpl() {
        let _data = { Target: DataStatus.New };
        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this._tareDetailGrid.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this._tareDetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
        _data['CageQuantity'] = Math.abs(this.tareForm.CageQuantity);
        _data['BareWeight'] = Number(this.tareForm.BareWeight);
        _data['Mode'] = this.tareForm.Mode;
        _data['Type'] = this.tareForm.Type;
        _data['NumericalOrderDetail'] = randomKey;
        console.log(_data);
        const dataSource = <DataSource>this._tareDetailGrid.dataSource;
        const customStore = dataSource.store() as CustomStore;
        customStore.load().then((data) => {
            data.unshift(_data); // 将新行插入到数据源的开头
            customStore.push([{ type: 'insert', data: _data }]);
            this._tareDetailGrid.instance.refresh();
            this.submited = true;
            setTimeout(() => {
                this.UpdateType = false;
                this.saveVisibleType = '';
                this.onSave(false);
            }, 500);
        });
    }

    /** 删行 */
    _tareDeleteRowImpl() {
        let _deleteKeys: any[] = this._tareDetailGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        ((<DataSource>this._tareDetailGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this._tareDetailGrid.instance.refresh();
        });
    }
    //毛重 称重
    roughWeightClick(e) {
        let validation = this.roughFormInstance.instance.validate().isValid;
        if (!validation) {
            return
        }
        console.log(this.roughForm,'this.roughForm');
        if (!this.roughForm.ProductID || !this.roughForm.CageQuantity ) {
            Notify.toast('请录入商品代号、笼数等信息！', NotifyType.Error);
            return
        }
        if (this.roughForm.Quantity == null || this.roughForm.Quantity == undefined || this.roughForm.Quantity === '') {
            Notify.toast('只数不能为空！', NotifyType.Error);
            return
        }
        if (this.roughForm.CageQuantity <= 0) {
            Notify.toast('笼数必须大于0，请重新录入！', NotifyType.Error);
            return
        }

        let ranNum = Number(this.ranNum)
        this.roughForm.GrossWeight = ranNum;

        if (this.roughForm.GrossWeight <= 0) {
            Notify.toast('毛重必须大于0，请重新称重！', NotifyType.Error);
            return
        }
        this.rightTotalValueNames = {
            'GrossWeight': 0,
            'CageQuantity': 0,
            'Quantity': 0,
            'VehicleWeight': 0
        };
        this.roughForm.Mode = 1;
        this.roughForm.Type = 1;
        this._roughAddRowImpl()
    }
    // 增加
    roughAddClick(e) {
        let validation = this.roughFormInstance.instance.validate().isValid;
        if (!validation) {
            return
        }
        if (!this.roughForm.ProductID || !this.roughForm.CageQuantity || !this.roughForm.GrossWeight) {
            Notify.toast('请录入正确信息！', NotifyType.Error);
            return
        }
        console.log(this.roughForm,'??????????',this.roughForm.Quantity == null || this.roughForm.Quantity == undefined || this.roughForm.Quantity === '')
        if (this.roughForm.Quantity == null || this.roughForm.Quantity == undefined || this.roughForm.Quantity === '') {
            Notify.toast('只数不能为空！', NotifyType.Error);
            return
        }
        if (this.roughForm.CageQuantity <= 0 || this.roughForm.GrossWeight <= 0 ) {
            Notify.toast('不得小于等于0，请录入正确信息！', NotifyType.Error);
            return
        }
        this.rightTotalValueNames = {
            'GrossWeight': 0,
            'CageQuantity': 0,
            'Quantity': 0,
            'VehicleWeight': 0
        };
        this.roughForm.Mode = 0;
        this.roughForm.Type = 1;
        this._roughAddRowImpl()
    }
    // 取消 作废
    roughCancelClick(e) {
        let _deleteKeys: any[] = this._roughDetailGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        this.rightTotalValueNames = {
            'GrossWeight': 0,
            'CageQuantity': 0,
            'Quantity': 0,
            'VehicleWeight': 0
        };
        let items = this.roughDetailDataSource._items;
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (_deleteKeys.indexOf(element.NumericalOrderDetail) != -1) {
                element.Type = element.Type ? 0 : 1;
            }
            element.GrossWeight = element.GrossWeight ? Number(element.GrossWeight) : 0;
            element.CageQuantity = element.CageQuantity ? Number(element.CageQuantity) : 0;
            element.Quantity = element.Quantity ? Number(element.Quantity) : 0;
            element.VehicleWeight = element.VehicleWeight ? Number(element.VehicleWeight) : 0;
        }
        this._roughDetailGrid.instance.refresh();
        this.submited = true;
        setTimeout(() => {
            this.UpdateType = false;
            this.saveVisibleType = '';
            this.onSave(false);
        }, 500);
    }
    _roughAddRowImpl() {
        let _data = { Target: DataStatus.New };
        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this._roughDetailGrid.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this._roughDetailGrid.dataSource).store() as CustomStore).key()] = randomKey;
        _data['ProductID'] = this.roughForm.ProductID;
        _data['CageQuantity'] = this.roughForm.CageQuantity;
        _data['GrossWeight'] = this.roughForm.GrossWeight;
        _data['Quantity'] = this.roughForm.Quantity;
        _data['VehicleWeight'] = this.roughForm.VehicleWeight || 0;
        _data['Mode'] = this.roughForm.Mode;
        _data['Type'] = this.roughForm.Type;
        _data['Remarks'] = this.roughForm.Remarks;
        // _data['NumericalOrderDetail'] = randomKey;
        const dataSource = <DataSource>this._roughDetailGrid.dataSource;
        const customStore = dataSource.store() as CustomStore;

        customStore.load().then((data) => {
            data.unshift(_data); // 将新行插入到数据源的开头
            customStore.push([{ type: 'insert', data: _data }]);
            this._roughDetailGrid.instance.refresh();
            this.submited = true;
            setTimeout(() => {
                this.UpdateType = false;
                this.saveVisibleType = '';
                this.onSave(false);
            }, 500);
        });
    }

    /** 删行 */
    _roughDeleteRowImpl() {
        let _deleteKeys: any[] = this._roughDetailGrid.instance.getSelectedRowKeys();
        if (!_deleteKeys || _deleteKeys.length == 0) {
            Notify.error('请选择数据！');
            return false;
        }
        ((<DataSource>this._roughDetailGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this._roughDetailGrid.instance.refresh();
        });
    }
    // 合计汇总 计算逻辑 待完善
    calculateSummary(options) {
        if (options.value && options.value[options.name] && options.value.Type == 1) {
            this.totalValueNames[options.name] += Number(options.value[options.name]);
        }
        options.totalValue = this.totalValueNames[options.name];
    }
    rightCalculateSummary(options) {
        if (options.value && options.value[options.name] && options.value.Type == 1) {
            this.rightTotalValueNames[options.name] += Number(options.value[options.name]);
        }
        // console.log(options);
        // console.log(options.totalValue);
        options.totalValue = this.rightTotalValueNames[options.name];
    }
    // 车重
    VehicleAdd(e) {
        // console.log(e);
        this.VehicleVisible = true;
    }
    // 编辑表体
    onFormValueChanged(e,_e) {
        const rowData = _e.row.data;
        if (rowData.Target == 0) {
            rowData.Target = 2
        }
        if (rowData.BareWeight) {
            this.totalValueNames = {
                'BareWeight': 0,
                'CageQuantity': 0
            };
            this.onUpdate('编辑表体');
            this._tareDetailGrid.instance.refresh();
        } else {
            this.rightTotalValueNames = {
                'GrossWeight': 0,
                'CageQuantity': 0,
                'Quantity': 0,
                'VehicleWeight': 0
            };
            this.onUpdate('编辑表体');
            this._roughDetailGrid.instance.refresh();
        }
    }
    //引入
    onIntroduce() {
        this.importFormData.ReqDeliveryDate = this.dataFormData.DataDate;
        this.importVisible = true;
        this.getPoultryAxios();
        // if (this.time) {
        //     clearInterval(this.time._id);
        //     this.time = null;
        // } else {
        //     this.weighSte()
        // }
    }
    getPoultryAxios() {
        var filterArr =  [];

        if (this.importFormData.ReqDeliveryDate) {
            filterArr.push(`(ReqDeliveryDate eq ${new DateTime(this.importFormData.ReqDeliveryDate.toString()).toString('yyyy-MM-dd')})`)
        }
        if (this.importFormData.SalesPeriod) {
            filterArr.push(`(SalesPeriod eq ${this.importFormData.SalesPeriod})`)
        }
        if (this.importFormData.CustomerID) {
            filterArr.push(`(CustomerID eq '${this.importFormData.CustomerID}')`)
        }

        let filterSrc = filterArr.join(' and ');
        let filter = '';
        if (filterSrc.length != 0) {
            filter += '$filter=';
            filter += filterSrc;
        }
        this.service.getPoultrySalesOrder(filter).then((res:any) => {
            
            this.importSourceFilter = res.value.map(m => {
                m['SalesPeriodName'] = m.SalesPeriod == 1 ? '上午' : m.SalesPeriod == 2?'下午':'';
                return m
            })

        })
    }
    //sadasd
    //请求详情
    acquireAxios(NumericalOrder,type?) {
        this.UpdateType = false;
        this.loading = true;
        this.service.acquire(NumericalOrder).then((res:any) => {
            // this.mode = 'edit';
            let value = res.data[0];
            this.GetGeTramsferBatch(new DateTime(value.DataDate).toString(),value.YHFarmerID,value.YHBatch);
            this.getHenhouseByParamAxios(value.YHBatch);
            this.totalValueNames = {
                'BareWeight': 0,
                'CageQuantity': 0
            };
            this.rightTotalValueNames = {
                'GrossWeight': 0,
                'CageQuantity': 0,
                'Quantity': 0,
                'VehicleWeight': 0
            };
            this.getWeightAxios()
            this.dataFormData = deepCopy(value);
            this.CustomerID = value.CustomerID;
            this.tareDetailDataSource = this.service.getTareDataSource();
            var YhRecycleWeightBareDetailDto = value.YhRecycleWeightBareDetailDto.map(m => {
                m['Target'] = DataStatus.None;
                return m
            })
            this.service._tareInfoUtil.init(YhRecycleWeightBareDetailDto);
            this.tareForm = YhRecycleWeightBareDetailDto.length > 0 ? deepCopy(YhRecycleWeightBareDetailDto[0]) : {};
            this.tareForm['BareWeight'] = '';
            this.roughDetailDataSource = this.service.getRoughDataSource();
            var YhRecycleWeightGrossDetailDto = value.YhRecycleWeightGrossDetailDto.map(m => {
                m['Target'] = DataStatus.None;
                return m
            })
            this.service._roughInfoUtil.init(YhRecycleWeightGrossDetailDto);
            this.roughForm = YhRecycleWeightGrossDetailDto.length > 0 ? deepCopy(YhRecycleWeightGrossDetailDto[0]) : {};
            this.roughForm['GrossWeight'] = '';
            if (type) {
                //清除url参数 不刷新页面
                // let newUrl = funcUrlDel('NumericalOrder');
                // history.pushState('',document.title,newUrl);
                // this.keyExpr = 'NumericalOrder';
                // this.focusedRowEnabled = true;
                let e = this.companies.filter(m => m.RecycleType == value.RecycleType)[0];
                this.tabID = e.ID;
                this.dataFormData.RecycleType = e.RecycleType;
                this.dataFormData.Abstract = e.Abstract;
                this.RecycleType = e.RecycleType;
                this.headerFormData.DataDate=[
                    new Date(new Date(value.DataDate).toLocaleDateString()),
                    new Date(new Date(value.DataDate).toLocaleDateString())
                ];
                this.headerFormData.PersonID = value.PersonID;

                this.getListAxios(true);
            }
            console.log('请求详情完成');
            setTimeout(() => {
                this.UpdateType = value.Status == 1;
                
                this.$savBtn = true;
                this.loading = false;
            }, 500);
        }) 
    }
    //保存
    onSave(type) {
        // if (!type) {
        //     this.loading = true;
        // }
        let data = this.dataFormData;
        data['RecycleType'] = this.RecycleType;
        data.YhRecycleWeightBareDetailDto = this.tareDetailDataSource._items;
        data.YhRecycleWeightGrossDetailDto = this.roughDetailDataSource._items;
        const date = new DateTime(data.DataDate.toString()).toString('yyyy-MM-dd');
        data.DataDate = date;
        this.service.store(data).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            this.submited = false;
            if (response.status) {
                if (type) {
                    this.NumericalOrder = result.data.NumericalOrder;
                    this.acquireAxios(result.data.NumericalOrder)
                } else {
                    if (this.saveVisibleType == 'add' || this.saveVisibleType == 'tab' ) {
                        this.loading = false;
                        this.empty();
                        this.saveVisibleType = '';
                    } else if (this.saveVisibleType == 'dbl') {
                        this.importSelectedRows = [];
                        this.acquireAxios(this.NumericalOrder);
                        this.saveVisibleType = '';
                    } else {
                        // this.loading = false;
                        this.$savBtn = true;
                        this.NumericalOrder = result.data.NumericalOrder;
                        this.focusedRowKey = this.NumericalOrder;
                        this.autoNavigateToFocusedRow = true;
                        this.totalValueNames = {
                            'BareWeight': 0,
                            'CageQuantity': 0
                        };
                        this.rightTotalValueNames = {
                            'GrossWeight': 0,
                            'CageQuantity': 0,
                            'Quantity': 0,
                            'VehicleWeight': 0
                        };
                        this.roughForm.GrossWeight = '';
                        this.tareForm.BareWeight = '';
                        this.getWeightAxios();
                        let value = result.data.data;
                        this.dataFormData = deepCopy(value.YhRecycleWeightDto);
                        this.CustomerID = value.YhRecycleWeightDto.CustomerID;
                        this.tareDetailDataSource = this.service.getTareDataSource();
                        var YhRecycleWeightBareDetailDto = value.YhRecycleWeightBareDetailDto.map(m => {
                            m['Target'] = DataStatus.None;
                            return m
                        })
                        this.service._tareInfoUtil.init(YhRecycleWeightBareDetailDto);
                        this.roughDetailDataSource = this.service.getRoughDataSource();
                        var YhRecycleWeightGrossDetailDto = value.YhRecycleWeightGrossDetailDto.map(m => {
                            m['Target'] = DataStatus.None;
                            return m
                        })
                        this.service._roughInfoUtil.init(YhRecycleWeightGrossDetailDto);

                        //左侧列表查询
                        this.headerFormData.DataDate=[
                            new Date(new Date(value.YhRecycleWeightDto.DataDate).toLocaleDateString()),
                            new Date(new Date(value.YhRecycleWeightDto.DataDate).toLocaleDateString())
                        ];
                        this.headerFormData.PersonID = value.YhRecycleWeightDto.PersonID;
                        setTimeout(() => {
                            console.log('保存')
                            this.UpdateType = true;
                        }, 500);
                    }
                }
                this.getListAxios();
                
            } else {
                this.messageBoxVisible = true;
                // this.saveStatus=true;
                if (response.message instanceof Array) {
                    this.messageBoxInfo = response.message;
                }
            }
        })
    }

    //新增
    onAdd() {
        let type = this._editorGrid._toolbar._buttons.find((m) => m.elementAttr['name'] == 'save-btn').disabled;
        if (!type) {
            this.saveVisibleType = 'add';
            this.saveVisible = true;
            return
        }
        this.empty()
    }
    //清空
    empty() {
        this.UpdateType = false;
        // this.mode = 'create';
        this.YHBatchSource = [];
        this.NumericalOrder = '';
        this.focusedRowKey = '';
        this.autoNavigateToFocusedRow = false;
        this.rightTotalValueNames = {
            'GrossWeight': 0,
            'CageQuantity': 0,
            'Quantity': 0,
            'VehicleWeight': 0
        };
        this.totalValueNames = {
            'BareWeight': 0,
            'CageQuantity': 0
        };
        this.importFormData = {};
        this.importSelectedRows = [];
        this.roughForm = {};
        this.tareForm = {};
        this.$savBtn = true;
        this.submited = false;
        this.getWeightAxios();
        this.dataFormData = new YhCycleWeightModel();
        let obj = this.PersonSource.filter(m => m.UserID == USER_INFO_CONTEXT.userId )
        this.dataFormData.PersonID = obj[0].PersonID;
        this.tareDetailDataSource = this.service.getTareDataSource();
        this.service._tareInfoUtil.init([]);
        this.roughDetailDataSource = this.service.getRoughDataSource();
        this.service._roughInfoUtil.init([]);
        this.getLastTicketedPoint();
    }
    //编辑
    onUpdate(e) {
        console.log(e)
        if (this.UpdateType) {
            this.$savBtn = false;
        }
        // this.submited = false;
    }
    private dataValidation(data): boolean {
        let tareDeta = this.tareDetailDataSource._items;
        if (data.length <= 0) {
            Notify.error('毛重明细不能为空!');
            return false
        }
        var flag = true;
        var RCageQuantity = 0;
        var LCageQuantity = 0;
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            if (!element.GrossWeight || element.GrossWeight == 0) {
                Notify.error(`第${i}行毛重不能为空!`);
                return false
            }
            // if (!element.Quantity) {
            //     Notify.error(`第${i}行只数不能为空!`);
            //     return false
            // }
            if (element.Type == 1) {
                RCageQuantity += element.CageQuantity;
            }

            if (element.CageQuantity && tareDeta.length == 0) {
                flag = false;
            }
        }

        if (!flag) {
            Notify.error(`有笼数，皮重明细不能为空!`);
            return false
        }

        for (let i = 0; i < tareDeta.length; i++) {
            const element2 = tareDeta[i];
            if (element2.Type == 1) {
                LCageQuantity += element2.CageQuantity;
            }
        }
        console.log(RCageQuantity,LCageQuantity)
        if (RCageQuantity != LCageQuantity) {
            Notify.error(`皮重、毛重笼数须相等!`);
            return false
        }

        return true;
    }
    // 校验
    private getSaveData(value) {
        // const validation = this.dataValidation(value.body);
        if ((!value.CustomerID || value.CustomerID == '0') && this.tabID != 2) {
            Notify.error('客户必填!');
            return false
        }
        if ((!value.YHFarmerID || value.YHFarmerID == '0') && this.tabID != 3) {
            Notify.error('养户必填!');
            return false
        }
        if ((!value.YHBatch || value.YHBatch == '0') && this.tabID != 3) {
            Notify.error('养护批次必填!');
            return false
        }
        if ((!value.ChickenFarmID || value.ChickenFarmID == '0') && this.tabID != 3) {
            Notify.error('养殖场必填！');
            return false
        }
        if (!value.TicketedPointID || value.TicketedPointID == '0' && this.tabID != 2) {
            Notify.error('核算单元必填!');
            return false
        }
        if (!value.WarehouseID || value.WarehouseID == '0') {
            Notify.error('仓库必填!');
            return false
        }
        if (this.isManageToHenhouse && (!value.HenhouseID || value.HenhouseID == '0') && this.tabID != 3) {
            Notify.error('栋舍必填!');
            return false
        }
        const body = this.dataValidation(this.roughDetailDataSource._items);
        if (!body) {
            return false
        }
        return true;
    }
    //单据完成
    onComplete() {
        const type = this.getSaveData(this.dataFormData);
        if (type) {
            this.loading = true;
            console.log(this.dataFormData)
            let data = this.dataFormData;
            data['RecycleType'] = this.RecycleType;
            data.YhRecycleWeightBareDetailDto = this.tareDetailDataSource._items;
            data.YhRecycleWeightGrossDetailDto = this.roughDetailDataSource._items;
            this.service.postComplete(data).then((result: Result) => {
                const response = ResponseSuccess.handle(result);
                this.loading = false;
                if (response.status) {
                    Notify.success('单据已完成!');
                    this.acquireAxios(result.data.NumericalOrder);
                    this.getListAxios();
                } else {
                    this.messageBoxVisible = true;
                    // this.saveStatus=true;
                    if (response.message instanceof Array) {
                        this.messageBoxInfo = response.message;
                    }
                }
            })
        }
    }
    //作废
    onDelete() {
        this.loading = true;
        this.service.postDelete({'NumericalOrder': this.dataFormData.NumericalOrder}).then((res:any) => {
            Notify.success('单据已作废!');
            this.loading = false;
            this.acquireAxios(this.dataFormData.NumericalOrder)
            this.getListAxios();
        })
    }
    //取消作废/完成
    onCancel() {
        this.loading = true;
        this.service.postCancel({'NumericalOrder': this.dataFormData.NumericalOrder}).then((res:any) => {
            Notify.success('取消操作成功!');
            this.loading = false;
            this.acquireAxios(this.dataFormData.NumericalOrder)
            this.getListAxios();
        })
    }
    //单据结算
     onClearing(status) {
        this.loading = true;
        if (status == 2) {
            // 结算
            this.service.postSettlement({'NumericalOrder': this.dataFormData.NumericalOrder}).then(async (result:any) => {
                const response = ResponseSuccess.handle(result);
                if (response.status) {
                    Notify.success('单据已结算!');
                    await this.acquireAxios(this.dataFormData.NumericalOrder)
                    this.getListAxios();
                } else {
                    this.messageBoxVisible = true;
                    if (response.message instanceof Array) {
                        this.messageBoxInfo = response.message;
                    }
                    this.loading = false;
                }
            })
        } else {
            // 取消
            this.service.postUnSettlement({'NumericalOrder': this.dataFormData.NumericalOrder}).then(async (result:any) => {
                const response = ResponseSuccess.handle(result);
                
                if (response.status) {
                    Notify.success('已取消结算!');
                    await this.acquireAxios(this.dataFormData.NumericalOrder)
                    this.getListAxios();
                } else {
                    this.messageBoxVisible = true;
                    if (response.message instanceof Array) {
                        this.messageBoxInfo = response.message;
                    }
                    this.loading = false;
                }
            })
        }
    }
    //客户订单完成
    onOrderCom() {
        this.completeFormData = {
            WeightStatus: false
        };
        if (this.dataFormData.NumberRef && this.dataFormData.NumberRef != '0') {
            this.completeFormData.WeightStatus = undefined;
            this.completeFormData.Number = this.dataFormData.NumberRef;
        }
        this.comSearch();
        this.completeVisible = true;
    }
    getComplete(e) {
        var selectedRowsData11 = this.completeGrigRef.instance.getSelectedRowsData();
        if (e == 1) {
            for (let i = 0; i < selectedRowsData11.length; i++) {
                const element = selectedRowsData11[i];
                // if (element.WeightStatus) {
                //     Notify.error('以过磅订单!');
                //     return
                // }
            }
            this.service.postFinish({NumericalOrder:this.completeSelectedRows}).then((res:any) => {
                if (res.code == 0) {
                    this.getRecycleWeightAxios()
                    this.completeSelectedRows = [];
                }

            })
        } else {
            this.completeVisible = false;
        }
    }
    comSearch() {
        this.getRecycleWeightAxios()
    }
    comReset() {
        this.completeFormData = {};
        this.getRecycleWeightAxios()
    }
    getRecycleWeightAxios() {
        var filterArr =  [];
        console.log(this.completeFormData)
        if (this.completeFormData.ReqDeliveryDate) {
            filterArr.push(`(ReqDeliveryDate eq ${new DateTime(this.completeFormData.ReqDeliveryDate.toString()).toString('yyyy-MM-dd')})`)
        }
        if (this.completeFormData.SalesPeriod) {
            filterArr.push(`(SalesPeriod eq ${this.completeFormData.SalesPeriod})`)
        }
        if (this.completeFormData.CustomerID) {
            filterArr.push(`(CustomerID eq '${this.completeFormData.CustomerID}')`)
        }
        if (this.completeFormData.WeightStatus != undefined) {
            filterArr.push(`(WeightStatus eq ${this.completeFormData.WeightStatus})`)
        }
        if (this.completeFormData.Number) {
            filterArr.push(`(Number eq '${this.completeFormData.Number}')`)
        }

        let filterSrc = filterArr.join(' and ');
        let filter = '';
        if (filterSrc.length != 0) {
            filter += '$filter=';
            filter += filterSrc;
        }
        this.service.getRecycleWeightList(filter).then((res:any) => {
            // console.log(res)
            this.completeSourceFilter = res.value.map(m => {
                m['SalesPeriodName'] = m.SalesPeriod == 1 ? '上午' : m.SalesPeriod == 2?'下午':'';
                return m
            })
        })
    }
    //打印
    //跳转模板
    jump() {
        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=回收过磅`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=回收过磅`
                );
            }
        );
    }
    getSource(e) {
        if (!(this.dataFormData.Status == 2) && !(this.dataFormData.Status == 3)) {
            Notify.error('未完成单据不支持打印！');
            return
        }
        if (e.status) {
            let tareDetailDataSource = this.tareDetailDataSource._items.filter(m=>m.Type==1);
            let roughDetailDataSource = this.roughDetailDataSource._items.filter(m=>m.Type==1);
            // 平均笼重
            var CageKG = null;
            var BareWeightTotalKg = 0;
            var CageQuantityTotalKg = 0;
            for (let j = 0; j < tareDetailDataSource.length; j++) {
                const item = tareDetailDataSource[j];
                BareWeightTotalKg += item.BareWeight;
                CageQuantityTotalKg += item.CageQuantity;
            }
            CageKG = (BareWeightTotalKg/CageQuantityTotalKg).toFixed(4);

            // 表头赋值
            var tabId0 = {
                DataDate: new DateTime(this.dataFormData.DataDate).toString(),
                CustomerName: this.dataFormData.CustomerName || '',
                YHFarmerName: this.dataFormData.YHFarmerName || '',
                Number: this.dataFormData.Number || '',
                WeightFinishTime: this.dataFormData.WeightFinishTime ? new DateTime(this.dataFormData.WeightFinishTime).toString() : '',
                CreatedOwnerName: this.dataFormData.CreatedOwnerName || '',
                CageKG: (CageKG && CageKG != 'NaN') ? CageKG + 'KG' : '0'
            };


            // 表体1赋值
            var tabid1 = [];
            let DateLength = tareDetailDataSource.length >= roughDetailDataSource.length ? tareDetailDataSource.length : roughDetailDataSource.length;
            for (let i = 0; i < DateLength; i++) {
                const element = tareDetailDataSource[i] || {};
                const element2 = tareDetailDataSource[i + 1] || {};
                const element3 = roughDetailDataSource[i] || {};
                const element4 = roughDetailDataSource[i + 1] || {};
                if (i%2 != 1) {
                    let netWeight = (element3.GrossWeight - ((element3.CageQuantity*CageKG) + (element3.VehicleWeight || 0))).toFixed(2);
                    let netWeight2 = (element4.GrossWeight - ((element4.CageQuantity*CageKG) + (element4.VehicleWeight || 0))).toFixed(2);
                    let obj = {
                        BareWeight: element.BareWeight || '',
                        CageQuantity: element.CageQuantity || '',
                        BareWeight2: element2.BareWeight || '',
                        CageQuantity2: element2.CageQuantity || '',
                        ProductName: element3.ProductName || '',
                        GrossWeight: element3.GrossWeight || '',
                        CageQuantity3: element3.CageQuantity || '',
                        Quantity: element3.Quantity || '',
                        VehicleWeight: element3.VehicleWeight || '',
                        netWeight: netWeight == 'NaN' ? '' : netWeight,
                        ProductName2: element4.ProductName || '',
                        GrossWeight2: element4.GrossWeight || '',
                        CageQuantity4: element4.CageQuantity || '',
                        Quantity2: element4.Quantity || '',
                        VehicleWeight2: element4.VehicleWeight || '',
                        netWeight2: netWeight2 == 'NaN' ? '' : netWeight2,
                    }
                    tabid1.push(obj);
                }
            }

            // 表体2赋值
            var tabId2 = [];
            //其他平均
            var totalAmount=0;
            var roughIntegration = groupBy(roughDetailDataSource, (link) => {
                return link.ProductID
            })
            for (let k = 0; k < roughIntegration.length; k++) {
                const items = roughDetailDataSource[k];

            }
            tabId2 = roughIntegration.map(m => {
                let BareWeightTotal = 0;
                let GrossWeightTotal = 0;
                let CageQuantityTotal = 0;
                let VehicleWeightTotal = 0;
                let QuantityTotal = 0;
                let netWeightTotal = 0;
                let eachCage = 0;
                let averageKg = 0;
                m.forEach(h => {
                    GrossWeightTotal += h.GrossWeight;
                    CageQuantityTotal += h.CageQuantity;
                    VehicleWeightTotal += h.VehicleWeight || 0;
                    QuantityTotal += h.Quantity;
                });
                BareWeightTotal = CageQuantityTotal*CageKG;
                netWeightTotal = GrossWeightTotal - (BareWeightTotal + VehicleWeightTotal);
                eachCage = QuantityTotal / CageQuantityTotal;
                averageKg = netWeightTotal / QuantityTotal;

                return {
                    ProductName: m[0].ProductName,
                    eachCage: eachCage.toFixed(2),
                    averageKg: averageKg.toFixed(2),
                    BareWeightTotal: BareWeightTotal.toFixed(2),
                    GrossWeightTotal: GrossWeightTotal.toFixed(2),
                    CageQuantityTotal,
                    VehicleWeightTotal: VehicleWeightTotal.toFixed(2),
                    QuantityTotal,
                    netWeightTotal: netWeightTotal.toFixed(2)
                };
            });
            console.log(tabId2,'tabId2');

            let sources = {
                tabId0: tabId0,
                tabId1: tabid1,
                tabId2: tabId2
            };

            var direct =false;
            if (e.isDirect) {
                direct = true;
            }

            this._printPage.instance.printGeneration(sources,false, false, null, { isDirect: direct,});
        }
    }
    onEditorPreparingFn(e) {
        if (e.dataField && e.row.rowType == 'data') {
            const rowData = e.row.data;
        }
    }
    impSearch() {
        this.getPoultryAxios();
    }
    impReset() {
        this.importFormData = {};
        this.getPoultryAxios();
    }
    getSelection(e) {
        if (e == 1) {
            if (this.importSelectedRows.length > 1) {
                Notify.error('只能选择一条数据！');
                return
            }
            this.UpdateType = false;
            this.$savBtn = false;
            this.dataFormData.CustomerID = this.importSelectedRows[0].CustomerID;
            this.CustomerID = this.importSelectedRows[0].CustomerID;
            this.dataFormData.NumberRef = this.importSelectedRows[0].Number;
            this.dataFormData.NumericalOrderRef = this.importSelectedRows[0].NumericalOrder;
            setTimeout(() => {
                console.log('选择')
                this.UpdateType = true;
            }, 500);
        }
        this.importVisible = false;
    }
    //公共事件 随机数字
    weighSte() {
        this.time = setInterval(() => {
            let b = (Math.random()*100)/2;
            this.ranNum = (b + 50).toFixed(2);
        },1000)
    }
    // 弹框事件
    //保存
    delConfirm() {
        console.log(this.saveVisibleType);
        this.submited = true;
        this.onSave(false);
        this.saveVisible = false;
    }
    //不保存
    delCancel() {
        if (this.saveVisibleType == 'add' || this.saveVisibleType == 'tab' ) {
            this.empty()
        } else if (this.saveVisibleType == 'dbl') {
            this.UpdateType = false;
            this.importSelectedRows = [];
            this.acquireAxios(this.NumericalOrder);
        }
        this.saveVisible = false;
    }
    //车重保存
    onVehicleFormSubmit() {
        let validation = this.VehicleFormInstance.instance.validate().isValid;
        if (validation) {
            this.VehicleSaveDisabled = true;
            this.service.postWeight(this.VehicleFormData).then((res:any) => {
                if (res.code == 0) {
                    Notify.success('车重保存成功');
                    this.getWeightAxios();
                    this.VehicleVisible = false;
                }
                this.VehicleSaveDisabled = false;
            })
        }
    }

    onValueChangedEvent(){
        this.getPoultryAxios();
    }
    onRowSelectionChanged(event:any){
        let currentRowData=[];
        //选择行数和明细数据行相等时代表全选
        console.log(event.selectedRowsData.length);
        console.log(this.roughDetailDataSource._items.length);
        if(event.selectedRowsData.length==this.roughDetailDataSource._items.length && event.currentSelectedRowKeys.length!=1){
            currentRowData = this.roughDetailDataSource._items;
            console.log(currentRowData)
        }else{
            if(event.currentSelectedRowKeys.length>0){
                let currentSelectRow = event.currentSelectedRowKeys[0];
                console.log(currentSelectRow);
                currentRowData = this.roughDetailDataSource._items.filter(c=>c.NumericalOrderDetail==currentSelectRow);
            }
        }
        if(currentRowData.length>0){
            this.roughForm.ProductID=currentRowData[0].ProductID;
            this.roughForm.ProductName=currentRowData[0].ProductName;
            this.roughForm.CageQuantity=currentRowData[0].CageQuantity;
            this.roughForm.Quantity=currentRowData[0].Quantity;
            this.roughForm.VehicleWeight=currentRowData[0].VehicleWeight;
            this.roughForm.Remarks=currentRowData[0].Remarks;
        }
    }

    onRowSelectionChanged2(event:any){
        let currentRowData=[];
        if(event.selectedRowsData.length==this.tareDetailDataSource._items.length && event.currentSelectedRowKeys.length!=1){
            currentRowData = this.tareDetailDataSource._items;
        }else{
            if(event.currentSelectedRowKeys.length>0){
                let currentSelectRow = event.currentSelectedRowKeys[0];
                currentRowData = this.tareDetailDataSource._items.filter(c=>c.NumericalOrderDetail==currentSelectRow);
            }
        }
        if(currentRowData.length>0){
            this.tareForm.CageQuantity=currentRowData[0].CageQuantity;
        }
    }
}

