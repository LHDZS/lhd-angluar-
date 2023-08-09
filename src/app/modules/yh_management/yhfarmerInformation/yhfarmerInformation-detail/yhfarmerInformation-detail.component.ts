import { Component, OnInit, ViewChild } from '@angular/core';
import { DxFormComponent } from 'devextreme-angular';
import { ActivatedRoute } from '@angular/router';
import {
    QlwODataContext,
    QlwCustomerContext,
    BasicSettingODataContext,
    QlwSystemContext } from 'src/app/providers/odataContext';
import DataSource from 'devextreme/data/data_source';
import { DxDataGridComponent } from 'devextreme-angular';
import CustomStore from 'devextreme/data/custom_store';
import {
    FormOptions,
    DataDictionary,
} from 'src/app/providers/enums';
import { DataStatus, EditorGridComponent } from 'src/app/components/editor-grid';
import { RegExps } from 'src/app/providers/regexp';
import { USER_GUIDE_CONTEXT, USER_INFO_CONTEXT } from 'src/app/providers/context';
import { yhfarmerInformationModel,YHFarmerMgmtRelateDto,YHFarmerConcertRelateDto } from '../yhfarmerInformation.model';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { Notify, NotifyType, MessageBox } from 'src/app/providers/notify';
import { yhfarmerInformationService } from '../yhfarmerInformation.service';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { TranslateI18N, TranslateService } from 'src/app/providers/i18n-translate';
import { retry } from 'rxjs-compat/operator/retry';
import { environment } from 'src/environments/environment';
import { UploadProvider } from 'src/app/providers/upload';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';
import { DateTime } from 'src/app/providers/common/datetime';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { YHProductionODataContext } from 'src/app/providers/odataContext/yhp.odataContext';

@Component({
    selector: 'app-yhfarmerInformation-detail',
    templateUrl: './yhfarmerInformation-detail.component.html',
    styleUrls: ['./yhfarmerInformation-detail.component.scss'],
})
export class yhfarmerInformationDetailComponent implements OnInit {
    @ViewChild('form', { static: false })
    formInstance: DxFormComponent;
    $option: FormOptions = FormOptions.$modify;
    formData: any = new yhfarmerInformationModel();
    @ViewChild('detailGrid', { static: false })
    detailGridRef: DxDataGridComponent;
    //一致行动人
    @ViewChild('ActionGrid', { static: false })
    ActionGridRef: DxDataGridComponent;
    @ViewChild('detailFarmGrid', { static: false })
    detailFarmGrid: DxDataGridComponent;
    submitOption: any;
    $load: boolean = true;
    $save: boolean = true;
    $deleted: boolean = true;
    $form: boolean = false;
    $fomat: boolean = false;
    $phone: boolean = false;
    loading: boolean = false;
    visibleFlag: boolean = false;
    today: Date = new Date();
    provinceText:any;
    ChickenFarmID: string;
    EnterpriseID: string;
    compareDataSource: yhfarmerInformationModel;
    limitCharacter = RegExps.Forbidcharacter;
    IdCardNumberType = RegExps.IdCardNumberType;
    PhoneJudge = RegExps.PhoneJudge;
    warehouseSource: any;
    ticketedPointSource: any;
    $modifyProvince: boolean = false;
    $modifyCity: boolean = false;
    SexSource: any = [
        {
            name: '男', value: true
        },{
            name: '女', value: false
        }
    ];
    //地区三级数据
    provinceSource: any = [];
    provinceId: any;
    citySource: any = [];
    cityId: any;
    areaSource: any = [];
    areaId: any;
    privincenulldata: any;
    flag:boolean = false;
    //end地区三级数据
    stockWarehouseName: string;
    ChickenFarmTypeSource: any;
    raisingFarmSource: any = [];
    //部门
    MarketSource: any;
    outDataDate: any;
    StatusSource: any = [
        {name: '启用',value: true},
        {name: '禁用',value: false}
    ];
    ChickenFarmSource: any;
    RoleSource: any;
    PersonSource: any;
    ZoningSource: any;
    StartDate: any;
    showMapPop: boolean = false;
    MapRid: number = 0;
    mapsAddress: string;
    //区域下拉
    Province: any;
    City: any;
    County: any;
    CompanyProvince: any;
    CompanyCity: any;
    CompanyCounty: any;
    //
    detailDataSource: any = [];


    uploader:NxUploader=new NxUploader();
    permission: PermissionService = new PermissionService();
    Phone: string = '';
    //附件
    uploadUrl: string = environment.nxinfileServerUrl;
    fileList: FileInfo[] = [];

    //弹出
    outVisible: boolean = false;
    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;
    outFormData: any = {};
    raisingFarmDataSource: any = [];
    raisingFarmDataSourceAll: any = [];
    selectedRows: any = [];
    NumericalOrder: string;

    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;
    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;
    messageBoxVisible: boolean = false;
    messageBoxInfo: string[] = [];

    //客户弹出
    cusVisible: boolean = false;
    cusFormData: any = {};
    customerListData: any;
    customerListDataAll: any;

    //养户弹出
    FarmerVisible: boolean = false;
    FarmerData: any = {};

    // 一致人弹出框
    actionDataSource: any = [];
    actionVisible: boolean = false;
    @ViewChild('ZoningForm', { static: false })
    ZoningFormInstance: DxFormComponent;
    formDataZoning: any = new YHFarmerConcertRelateDto()
    saveDisabled: boolean = false;
    actionDisabled: boolean = false;
    actionPhone:any =  null;
    actionDelVisible: boolean = false;
    actionSelectedRows:any = [];
    constructor(
        private route: ActivatedRoute,
        private basicSettingODataContext: BasicSettingODataContext,
        private service: yhfarmerInformationService,
        private USER_GUIDE: USER_GUIDE_CONTEXT,
        private qlwOdataContext: QlwODataContext,
        private qlwSystemContext: QlwSystemContext,
        private translator: TranslateService,
        private qlwCustomerContext: QlwCustomerContext,
        private StatusODataContext: StatusODataContext,
        private yhProductionODataContext: YHProductionODataContext,
    ) {
        this.$option = this.route.queryParams['value']['$option'];
        this.EnterpriseID = this.route.queryParams['value']['enterpriseId'];
        this.NumericalOrder = this.route.snapshot.queryParams.numericalOrder;
        this.submitOption = {
            text: '保存',
            type: 'success',
            onClick: this.onFormSubmit.bind(this),
        };
        this.ChickenFarmSource = this.basicSettingODataContext.getBizChickenFarmDataSource({
            filter: CHICKEN_FARM_CONTEXT.ChickenFarmFilterCondition,
            select: ['ChickenFarmID', 'ChickenFarmName'],
        });

        // this.service.CustomerRefCommonOData('').then((res:any) => {
        //     if (res.value.length > 0) {
        //         this.cusVisible = true;
        //         this.customerListData = res.value;
        //         this.customerListDataAll = res.value;
        //     }
        // })

        // this.PersonSource = this.qlwOdataContext.getQlWPersonOData({
        //     select: ['PersonID', 'PersonName', 'Phone'],
        // });

        // new DataSource(this.qlwOdataContext.getQlWPersonOData()).load().then(res => {
        //     this.PersonSource = res;
        // })

        this.qlwOdataContext.personODataStore.load().then((res:any) => {
            this.PersonSource = res;
        })
        //领用部门
        this.MarketSource = this.qlwCustomerContext.getBizMarketDataSource({
            filter: [
                ['IsUse', '=', 1],
                ['isEnd', '=', 1],
            ],
            select: ['MarketId', 'MarketName',],
        });

        this.RoleSource = this.StatusODataContext.getRoleSourceType();
        //栋舍数据源
        // this.basicSettingODataContext.zqHenhouse.load().then((res)=>{
        //     this.raisingFarmDataSource = res;
        // })
        //场区
        this.ZoningSource = this.basicSettingODataContext.getBizZoningDataSource({
            select: ['ZoningID', 'ZoningName'],
        });
        this.stockWarehouseName = this.getStockWarehouseName();
    }

    async ngOnInit() {
        // this.detailFarmGrid.keyExpr = 'RecordID';
        await this.service.address(0).then((res: any) => {
            this.provinceSource = res.data  //获取省
        })
        if (this.$option == FormOptions.$modify) {
            this.$phone = true;
            this.$deleted = false;
            this.load();
        } else {
            this.formData = new yhfarmerInformationModel();
            //默认核算单元
            // new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load().then((result) => {
            //     if(result.length==1){
            //         this.formData.NTicketedPointID = result[0].TicketedPointId;
            //     }
            // });
            this.StartDate = new Date();
            this.formData.StartDate = new Date();
            this.compareDataSource = deepCopy(this.formData);
            this.detailDataSource = this.service.getSettingSource();
            this.actionDataSource = this.service.getActionSource();
            this.service._settingUtil.init([]);
            this.service._actionUtil.init([]);
        }

        this.warehouseSource = this.basicSettingODataContext.getWareHouseDataSource({
            select: ['WarehouseID', 'WarehouseName'],
        });
        this.ticketedPointSource = this.qlwOdataContext.getAccountagencyODataDataSource({
            select: ['TicketedPointId', 'TicketedPointName'],
        },true);


    }

    init_uploader(): yhfarmerInformationDetailComponent {
        this.uploader.visible = true;
        this.uploader.readonly=!this.permission.$$edit || !this.permission.$$add;
        this.uploader.numericalOrder = this.NumericalOrder;
        this.uploader.fileListChange = this.fileListChanged.bind(this);

        return this;
    }

    //养户弹出
    farConfirm() {
        this.formData['YHFarmerID'] = this.FarmerData.YHFarmerID;
        this.formData['IdCardNumber'] = this.FarmerData.IdCardNumber;
        this.formData['YHPersonName'] = this.FarmerData.YHPersonName;
        this.formData['YHFarmerName'] = this.FarmerData.YHFarmerName;
        this.formData['Address'] = this.FarmerData.Address;
        this.formData['Sex'] = this.FarmerData.Sex;
        this.formData['MnemonicCode'] = this.FarmerData.MnemonicCode;
        this.$fomat = true;
        this.FarmerVisible = false;
    }

    farCancel() {
        this.formData['Phone'] = '';
        this.FarmerVisible = false;
    }

    onSearch() {
        if (this.cusFormData.LinkMan) {
            this.customerListData = this.customerListDataAll.filter( o => o.LinkMan == this.cusFormData.LinkMan);
        } else {
            this.customerListData = this.customerListDataAll;
        }

    }

    reset() {
        this.customerListData = this.customerListDataAll;
    }

    onIntroduce(row) {
        this.formData['YHPersonName'] = row.LinkMan;
        this.formData['YHFarmerName'] = row.CustomerName;
        this.formData['CustomerID'] = row.CustomerId;
        this.formData['CustomerName'] = row.CustomerName;
        this.formData['EnterpriseId'] = row.EnterpriseId;
        this.formData['EnterpriseName'] = row.EnterpriseName;
        this.formData['IsInner'] = row.IsInner;
        this.formData['IsPm'] = row.IsPm;
        this.formData['IsPmImp'] = row.IsPmImp;
        this.formData['IsSa'] = row.IsSa;
        this.formData['IsSaImp'] = row.IsSaImp;
        this.formData['LinkMan'] = row.LinkMan;
        this.cusVisible = false;
    }

    //栋舍操作
    RowRemoved(e) {
        this.$save = false;
    }

    _onDetailEditorPreparing(e) {
        if (e.dataField && e.row.rowType == 'data') {
            const rowIndex = e.row.rowIndex;
            const rowData = e.row.data;

            const _defaultValueChanged = e.editorOptions.onValueChanged;
            this.$save = false;
        }
    }

    //一致行动人
    onActionDataChanged(e) {

        if (e.dataField && e.dataField == "Phone" ) {
            if (this.actionPhone != e.value) {
                this.actionPhone = e.value;

                this.service.getUserInfoByPhone(e.value).then((res:any) => {
                    if (res.BO_ID != '0') {
                        this.formDataZoning = res;
                        this.actionDisabled = true;
                    } else {
                        // this.formDataZoning = new YHFarmerConcertRelateDto();
                        this.actionDisabled = false;
                    }
                })
            }
        }

    }

    onDetailEditorPreparing(e) {
        if (e.dataField && e.row.rowType == 'data') {
            const rowIndex = e.row.rowIndex;
            const rowData = e.row.data;
            const _defaultValueChanged = e.editorOptions.onValueChanged;
            if(e.dataField == 'PersonID') {
                e.editorOptions.onValueChanged = _e => {
                    let obj = this.PersonSource.filter(o => o.PersonID == _e.value);
                    rowData['PersonID'] =  _e.value;
                    rowData['PersonName']=obj[0].PersonName;
                    rowData['Phone'] =  obj[0].Phone;

                    this.detailGridRef.instance.refresh();

                }
            } else if (e.dataField == 'RoleID') {
                e.editorOptions.onValueChanged = _e => {
                    let obj = this.RoleSource.filter(o => o.value == _e.value);
                    rowData['RoleID'] =  _e.value;
                    rowData['RoleName'] =  obj[0].name;
                    this.detailGridRef.instance.refresh();
                }
            } else if (e.dataField == 'StartDate') {
                e.editorOptions.onValueChanged = _e => {
                    rowData['StartDate'] = new DateTime(_e.value.toString()).toString('yyyy-MM-dd');
                }
            } else if (e.dataField == 'EndDate') {
                e.editorOptions.onValueChanged = _e => {
                    rowData['EndDate'] = new DateTime(_e.value.toString()).toString('yyyy-MM-dd');
                }
            }
            this.$save = false;
        }
    }

    fileListChanged(e) {
        if (!e.isInit) {
            this.$save = false;
            // this.detailGridRef.modifyDataStatusSet();
        }

        this.fileList = e.Files;

        return this;
    }

    onPopupHiding() {
        this.outVisible = false;
        this.raisingFarmDataSource = [];
    }

    _onPopupHiding () {
        this.cusVisible = false;
    }

    onDetailClick(e) {
        if (e.key == 'add') {
            this._addRowImpl()
        } else {
            this._deleteRowImpl()
        }
    }

    /** 增行 */
    _addRowImpl() {
        let _data = new YHFarmerMgmtRelateDto();
        // _data["ComboPack"] =  DataDictionary.ComboPackA;
        // _data['EffectMonth'] = null;
        this.$save = false;
        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this.detailGridRef.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this.detailGridRef.dataSource).store() as CustomStore).key()] = randomKey;
        ((<DataSource>this.detailGridRef.dataSource).store() as CustomStore).insert(_data).then(() => {
            this.detailGridRef.instance.refresh();
        });
    }

    /** 删行 */
    _deleteRowImpl() {

        this.$save = false;

        let _deleteKeys: any[] = this.detailGridRef.instance.getSelectedRowKeys();


        if (!_deleteKeys || _deleteKeys.length == 0) {
            _deleteKeys = [
                this.detailGridRef.instance.getKeyByRowIndex(this.detailGridRef.instance.getVisibleRows().length - 1),
            ];
        }

        ((<DataSource>this.detailGridRef.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this.detailGridRef.instance.refresh();
        });

    }

    //禁用 启用
    forbidden(row) {
        let data = {
            'NumericalOrderDetail': row.data.NumericalOrderDetail,
            'Status': !row.data.Status
        }
        this.service.UpdateStatus(data).then((res:any) => {
            Notify.toast(res.msg);
            this.load()
        })
    }
    startUsing(row) {
        let data = {
            'NumericalOrderDetail': row.data.NumericalOrderDetail,
            'Status': !row.data.Status
        }
        this.service.UpdateStatus(data).then((res:any) => {
            Notify.toast(res.msg);
            this.load()
        })
    }

    onActionClick(e) {
        if (e.key == 'add') {
            this.actionVisible = true;
            this.formDataZoning = new YHFarmerConcertRelateDto();
            // this._addonActiRowImpl()
        } else {
            if (this.actionSelectedRows.length > 0) {
                this.actionDelVisible = true;
            }
        }
    }

    onZoningFormSubmit(type) {
        let validation = this.ZoningFormInstance.instance.validate().isValid;
        if (validation) {
            let flag = true;
            if (this.formDataZoning.Phone == this.formData.Phone) {
                Notify.toast('请不要在此添加养户！', NotifyType.Error);
                this.formDataZoning.Phone = '';
                this.formDataZoning.Name = '';
                this.actionDisabled = false;
                flag = false;
                return
            }
            let YHFarmerConcertRelateDto:any = (<Array<any>>this.ActionGridRef.dataSource);
            let array = YHFarmerConcertRelateDto._items ? YHFarmerConcertRelateDto._items : YHFarmerConcertRelateDto;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.Name == this.formDataZoning.Name && element.Phone == this.formDataZoning.Phone) {
                    Notify.toast('明细表中存在相同人员和手机号！', NotifyType.Error);
                    flag = false;
                    return
                }
            }
            if (flag) {
                this.actionVisible = type;
                this._addonActiRowImpl(type)
            }
        }
    }

    _addonActiRowImpl(type) {
        // this.formDataZoning['YHFarmerID'] = this.FarmerData.YHFarmerID;
        let _data = this.formDataZoning;

        this.$save = false;
        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this.ActionGridRef.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this.ActionGridRef.dataSource).store() as CustomStore).key()] = randomKey;
        _data['Status'] = true;
        ((<DataSource>this.ActionGridRef.dataSource).store() as CustomStore).insert(_data).then(() => {
            this.ActionGridRef.instance.refresh();
        });
        if (type) {
            this.formDataZoning = new YHFarmerConcertRelateDto();
        }
    }

    _deleteonActiRowImpl() {
        let filter = [['YHFarmerID', '=', this.formData.YHFarmerID]];
        let YhFarmerContractSource = new DataSource(this.yhProductionODataContext.getYHFarmerContractInfoDataSource({
            filter: filter,
            paginate: false,
        }))
        YhFarmerContractSource.load().then((res:any) => {
            this.actionDelVisible = false;
            if(res.length > 0) {
                Notify.toast('该一致行动人已被某养殖合同引用，不允许删行！', NotifyType.Error);
            } else {
                this.$save = false;

                let _deleteKeys: any[] = this.ActionGridRef.instance.getSelectedRowKeys();


                if (!_deleteKeys || _deleteKeys.length == 0) {
                    _deleteKeys = [
                        this.ActionGridRef.instance.getKeyByRowIndex(this.ActionGridRef.instance.getVisibleRows().length - 1),
                    ];
                }

                ((<DataSource>this.ActionGridRef.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
                    this.ActionGridRef.instance.refresh();
                });
            }
        })
    }

    addFarm() {
        //栋舍数据源
        this.basicSettingODataContext.zqHenhouseGroup.load().then((res)=>{
            this.raisingFarmDataSourceAll = [];
            let HenHouseArr = [];
            let dataSource:any = this.detailFarmGrid.dataSource;
            dataSource.forEach(row => {
                HenHouseArr.push(row.HenHouseID)
            })
            res.forEach(row => {
                if (HenHouseArr.indexOf(row.HenHouseID) == -1) {
                    // this.raisingFarmDataSource.push(row)
                    this.raisingFarmDataSourceAll.push(row)
                }
            })
            this.outVisible = true;
        })
    }
    //养户栋添加确认
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
            this.detailFarmGrid.instance.saveEditData();
            var selectedRowsData11 = this.dataGridRef.instance.getSelectedRowsData();
            var oldData:any = this.detailFarmGrid.dataSource;
            let arry = [];
            (oldData).forEach((data) => {
                let isAllEmpty = true;
                let props = Object.keys(data).filter(
                    (x) => x != this.detailFarmGrid.keyExpr && x != 'target'
                ); //过滤主键跟target
                for (const prop of props) {
                    if (data[prop] != null && data[prop] != '' && data[prop] != undefined) {
                        isAllEmpty = false;
                        break;
                    }
                }
                if (!isAllEmpty) {
                    arry.push(data);
                }
            });
            selectedRowsData11.forEach((f) => {
                var row = deepCopy(f);
                row['ChickenFarmID'] = this.outFormData.ChickenFarmID;
                row['StartDate'] = this.outFormData.StartDate;
                row['EndDate'] = this.outFormData.EndDate;
                // row[`${this.detailFarmGrid.keyExpr}`] = new DateTime().randomValue.toString();
                row.target = DataStatus.New;
                row['DaysOld'] = f.CurDayOld;
                arry.push(row);
            });
            this.$save = false;
            this.detailFarmGrid.dataSource = arry;
            this.detailFarmGrid.instance.refresh();
            // this.detailInstance.modifyDataStatusSet();
            // this.setChickenFarmReadOnly();
        },200)

    }

    // 省级
    onProvinceChanged(event) {
        if (this.$save) {
            this.$save = false;
        }
        if(this.flag){
            return ;
        }
        this.service.address(event.value).then((res: any) => {
            this.citySource = res.data;
            if (this.$option == FormOptions.$create) {
                this.cityId = res.data[0].id;
            } else {
                let newData = this.citySource.filter(d => { return d['id'] == this.cityId });
                if(newData && newData.length>0){
                    this.cityId = newData[0].id
                }

            }
        })
    }
    onCityChanged(event) {
        if(this.flag){
            this.flag = false;
            return;
        }
        this.service.address(event.value).then((res: any) => {
            this.areaSource = res.data;
            if (this.$option == FormOptions.$create) {
                this.areaId = res.data[0].id
            } else {
                let newData = this.areaSource.filter(d => { return d['id'] == this.areaId });
                if(newData && newData.length>0){
                    this.areaId = newData[0].id
                }
            }
        })
    }

    _onValueChanged(e) {
        if (e.value) {
            this.formData.StartDate = new DateTime(e.value.toString()).toString('yyyy-MM-dd');
        } else {
            this.formData.StartDate = null;
        }
        if (this.$save && this.$load) {
            this.$save = false;
        }
    }

    onFormSubmit() {
        const validation = this.formInstance.instance.validate().isValid;
        if (validation) {
            let YHFarmerMgmtRelateDto:any = (<Array<any>>this.detailGridRef.dataSource);
            this.formData.YHFarmerMgmtRelateDto = YHFarmerMgmtRelateDto._items ? YHFarmerMgmtRelateDto._items : YHFarmerMgmtRelateDto;
            this.formData.YHFarmerMgmtRelateDto.map(m => {
                m['RoleID'] = m.RoleID || '0';
            })

            let YHFarmerConcertRelateDto:any = (<Array<any>>this.ActionGridRef.dataSource);
            this.formData.YHFarmerConcertRelateDto = YHFarmerConcertRelateDto._items ? YHFarmerConcertRelateDto._items : YHFarmerConcertRelateDto;
            for (let index = 0; index < this.formData.YHFarmerMgmtRelateDto.length; index++) {
                const element = this.formData.YHFarmerMgmtRelateDto[index];
                if (!element.PersonID) {
                    return Notify.toast('明细表人员不能为空', NotifyType.Error);
                }
            }
            this.formData.FileDto = this.fileList;
            if (this.$option == FormOptions.$create) {
                this.loading = true;
                this.service.post(this.formData).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    this.loading = false;
                    if (response.status) {
                        Notify.toast(`保存${response.message}`, NotifyType.Success);
                        if (this.$option == FormOptions.$create) {
                            this.$option = FormOptions.$modify;
                            // this.ChickenFarmID = response.data.ChickenFarmID;
                            this.NumericalOrder = response.data.numericalOrder;
                            // this.formData.ChickenFarmID = this.ChickenFarmID;
                            // 保存成功更新对比数据源
                            this.compareDataSource = deepCopy(this.formData);
                            this.load();
                            this.$deleted = false;
                            this.$save = true;
                            this.$form = true;
                            // this.initEarTagDataSource();
                        }
                        //更新场外信息数据源
                        // this.getBoarOrSowEarNumberData();
                    } else {
                        this.loading = false;
                        // Notify.toast(response.message, NotifyType.Error);
                        this.messageBoxVisible = true;
                        if (response.message instanceof Array) {
                            this.messageBoxInfo = response.message;
                        }
                    }
                });
            }
            if (this.$option == FormOptions.$modify) {
                this.loading = true;
                this.service.put(this.formData).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    this.loading = false;
                    if (response.status) {
                        // 修改成功更新对比数据源
                        this.compareDataSource = deepCopy(this.formData);
                        this.NumericalOrder = response.data.NumericalOrder;
                        this.load();
                        Notify.toast(`修改${response.message}`, NotifyType.Success);
                        this.$deleted = false;
                        this.$save = true;
                        this.$form = true;
                        //更新场外信息数据源
                        // this.getBoarOrSowEarNumberData();
                    } else {
                        this.loading = false;
                        // Notify.toast(response.message, NotifyType.Error);
                        this.messageBoxVisible = true;
                        if (response.message instanceof Array) {
                            this.messageBoxInfo = response.message;
                        }
                    }
                });
            }
        } else {

        }
    }
    add() {
        this.$option = FormOptions.$create;
        this.$deleted = true;
        this.$form = false;
        this.$fomat = false;
        this.$phone = false;
        // if (!this.$deleted) {
            this.cancel();
        // }
    }
    cancel() {
        if (this.$option == FormOptions.$create) {
            this.formInstance.instance.resetValues();
            this.formData = new yhfarmerInformationModel();
            //默认核算单元
            new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load().then((result) => {
                if(result.length==1){
                    this.formData.NTicketedPointID = result[0].TicketedPointId;
                }
            });
            this.raisingFarmSource = [];
            this.detailDataSource = this.service.getSettingSource();
            this.actionDataSource = this.service.getActionSource();
            this.service._settingUtil.init([]);
            this.service._actionUtil.init([]);
            this.compareDataSource = deepCopy(this.formData);
            this.provinceId=-1;
            this.areaId=-1;
            this.cityId=-1;
            this.flag = true;
            setTimeout(() => {
                this.$save=true;
            }, 50);
        } else {
            this.load();
        }
    }

    load() {
        this.compareDataSource = deepCopy(this.formData);
        var Param = 'NumericalOrder=' + this.NumericalOrder + '&';
        this.service
            .byKey(<any>Param)
            .then((res: any) => {
                if(res.isSuccess){
                    this.$load = false;
                    var value = res.data[0];
                    var newValue = value;
                    this.StartDate = newValue.StartDate;
                    this.formData = deepCopy(newValue);
                    //
                    if (newValue.EnterpriseID != this.EnterpriseID) {
                        this.$fomat = true;
                    }
                    // this.raisingFarmSource = newValue.YHFarmerConcertRelateDto.map( item => {
                    //     item['HenHouseName'] = item.HenhouseName;
                    //     return item
                    // });
                    // this.detailDataSource = newValue.YHFarmerMgmtRelateDto;
                    this.detailDataSource = this.service.getSettingSource();
                    this.actionDataSource = this.service.getActionSource();
                    if (newValue.YHFarmerConcertRelateDto) {
                        newValue.YHFarmerConcertRelateDto.map(o => {
                            o.type = true;
                            return o
                        })
                        this.service._actionUtil.init(newValue.YHFarmerConcertRelateDto);
                    }
                    this.service._settingUtil.init(newValue.YHFarmerMgmtRelateDto);


                    setTimeout(() => {
                        this.$load = true;
                    }, 200);
                }
            });
    }

    onFieldDataChanged(e) {
        if (this.compareDataSource&&e.dataField&&e.dataField!="DomainEvents") {
            if (this.compareDataSource[e.dataField] != e.value) {
                if (this.$save && this.$load) {
                    this.$save = false;
                }
            }
            if (e.dataField == 'Phone') {
                if (this.Phone != e.value && this.$load) {
                    this.Phone = e.value;

                    this.service.GetYhFarmerInfomationByPhone(e.value).then((res:any) => {
                        if (res.length > 0) {
                            this.FarmerData = res[0];
                            this.FarmerVisible = true;
                        } else {
                            this.service.CustomerRefCommonOData(e.value).then((res:any) => {
                                if (res.value.length > 0) {
                                    this.cusVisible = true;
                                    this.customerListData = res.value;
                                }
                            })
                        }
                    })


                }
            }
            if(e.dataField=='YHPersonName'){
                if(this.formData.YHFarmerName=='' || this.formData.YHFarmerName==null){
                    this.formData.YHFarmerName = e.value;
                }
            }
        }
    }

    _onFieldDataChanged(e) {

        if (e.dataField == 'ChickenFarmID') {
            this.raisingFarmDataSource = this.raisingFarmDataSourceAll.filter(o => o.ChickenFarmID == e.value);
        }
    }

    deleteData() {
        MessageBox.confirm('您确认要删除吗', '提示').then((confirm) => {
            if (confirm) {
                this.service.delete(this.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        this.formInstance.instance.resetValues();
                        this.formData = new yhfarmerInformationModel();
                        //默认核算单元
                        new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load().then((result) => {
                            if(result.length==1){
                                this.formData.NTicketedPointID = result[0].TicketedPointId;
                            }
                        });
                        this.raisingFarmSource = [];
                        this.detailDataSource = this.service.getSettingSource();
                        this.actionDataSource = this.service.getActionSource();
                        this.service._settingUtil.init([]);
                        this.compareDataSource = deepCopy(this.formData);
                        this.provinceId=-1;
                        this.areaId=-1;
                        this.cityId=-1;
                        this.$deleted = true;
                        this.$form = true;
                        this.flag = true;
                        setTimeout(() => {
                            this.$save = true;
                        }, 50);
                        Notify.toast('删除成功');
                    } else {
                        Notify.toast(response.message, NotifyType.Error);
                    }
                });
            }
        });

    }
    redirectToAddProduct() {
        this.USER_GUIDE.toSetProduct();
    }

    /**
     * 判断鸡场类型
     * @returns 是否是养殖场
     */
    private getStockWarehouseName() {
        if (this.service.PoultryFarmType == DataDictionary.FarmTypeA) {
            return TranslateI18N.I18N.chickenYHFarmSetting.Warehouse.poultry;
        }else if (this.service.PoultryFarmType == DataDictionary.FarmTypeB) {
            this.visibleFlag = true;
            return TranslateI18N.I18N.chickenYHFarmSetting.Warehouse.hatchery;
        }else {
            return '';
        }
    }

}
