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
import { yhfamershortcutModel,yhfamershortcutbuildingModel,YHFarmerConcertRelateDto } from '../yhfamershortcut.model';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { Notify, NotifyType, MessageBox } from 'src/app/providers/notify';
import { yhfamershortcutService } from '../yhfamershortcut.service';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { TranslateI18N, TranslateService } from 'src/app/providers/i18n-translate';
import { retry } from 'rxjs-compat/operator/retry';
import { environment } from 'src/environments/environment';
import { UploadProvider } from 'src/app/providers/upload';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';
import { DateTime } from 'src/app/providers/common/datetime';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import { YHProductionODataContext } from 'src/app/providers/odataContext/yhp.odataContext';

@Component({
    selector: 'app-yhfamershortcut-detail',
    templateUrl: './yhfamershortcut-detail.component.html',
    styleUrls: ['./yhfamershortcut-detail.component.scss'],
})
export class yhfamershortcutDetailComponent implements OnInit {
    @ViewChild('form', { static: false })
    formInstance: DxFormComponent;
    $option: FormOptions = FormOptions.$modify;
    formData: any = new yhfamershortcutModel();
    @ViewChild('detailGrid', { static: false })
    detailGridRef: DxDataGridComponent;
    @ViewChild('detailPeopleGrid', { static: false })
    detailPeopleGrid: DxDataGridComponent;
    submitOption: any;
    $save: boolean = true;
    $deleted: boolean = true;
    $form: boolean = false;
    $load: boolean = true;
    $fomat: boolean = false;
    visibleFlag: boolean = false;
    today: Date = new Date();
    provinceText:any;
    ChickenFarmID: string;
    compareDataSource: yhfamershortcutModel;
    limitCharacter = RegExps.Forbidcharacter;
    PhoneJudge = RegExps.PhoneJudge;
    PersonSource: any;
    RoleSource: any;
    warehouseSource: any;
    ticketedPointSource: any;
    $modifyProvince: boolean = false;
    $modifyCity: boolean = false;
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
    SexSource: any = [
        {
            name: '男', value: true
        },{
            name: '女', value: false
        }
    ];
    //部门
    MarketSource: any;
    outDataDate: any;
    StatusSource: any = [
        {name: '是',value: true},
        {name: '否',value: false}
    ];
    ZoningSource: any;
    StartDate: any;
    showMapPop: boolean = false;
    MapRid: number = 0;
    mapsAddress: string;
    Phone: string = '';
    //区域下拉
    Province: any;
    City: any;
    County: any;
    CompanyProvince: any;
    CompanyCity: any;
    CompanyCounty: any;
    //
    detailDataSource: any = []
    detailDataPeopleSource: any = [];
    //
    uploader:NxUploader=new NxUploader();
    permission: PermissionService = new PermissionService();
    numericalOrder: string = '';
    //附件
    uploadUrl: string = environment.nxinfileServerUrl;
    fileList: FileInfo[] = [];
    ChickenFarmNameAll: any = [];

    //客户弹出
    cusVisible: boolean = false;
    cusFormData: any = {};
    customerListData: any;
    customerListDataAll: any;

    //养户弹出
    FarmerVisible: boolean = false;
    FarmerData: any = {};


    deleteKey: any = null;
    deleteKey1: any = null;

    // 一致人弹出框
    actionDataSource: any = [];
    //一致行动人
    @ViewChild('ActionGrid', { static: false })
    ActionGridRef: DxDataGridComponent;
    actionVisible: boolean = false;
    @ViewChild('ZoningForm', { static: false })
    ZoningFormInstance: DxFormComponent;
    formDataZoning: any = new YHFarmerConcertRelateDto()
    saveDisabled: boolean = false;
    actionDisabled: boolean = false;
    actionPhone:any =  null;
    IdCardNumberType = RegExps.IdCardNumberType;
    actionDelVisible: boolean = false;
    PoultryCategorySource:any;
    constructor(
        private route: ActivatedRoute,
        private basicSettingODataContext: BasicSettingODataContext,
        private service: yhfamershortcutService,
        private USER_GUIDE: USER_GUIDE_CONTEXT,
        private qlwOdataContext: QlwODataContext,
        private qlwSystemContext: QlwSystemContext,
        private translator: TranslateService,
        private qlwCustomerContext: QlwCustomerContext,
        private StatusODataContext: StatusODataContext,
        private yhProductionODataContext: YHProductionODataContext,
    ) {
        this.$option = FormOptions.$create;
        this.ChickenFarmID = `${this.route.queryParams['value']['ChickenFarmID']}`;
        this.submitOption = {
            text: '保存',
            type: 'success',
            onClick: this.onFormSubmit.bind(this),
        };
        this.stockWarehouseName = this.getStockWarehouseName();
        this.detailDataSource = this.service.getSettingSource();
        this.actionDataSource = this.service.getActionSource();
        this.detailDataPeopleSource = this.service.getPeSettingSource();
        this.PoultryCategorySource=[{Id:2,Name:"鸡"},{Id:8,Name:"鸭"}]
        this.service.AllName().then((res:any) => {
            for (let i = 0; i < res.value.length; i++) {
                const element = res.value[i];
                this.ChickenFarmNameAll.push(element.ChickenFarmName)
            }
        })
        this.NameValidation = this.NameValidation.bind(this)
    }

    async ngOnInit() {
        await this.service.address(0).then((res: any) => {
            this.provinceSource = res.data  //获取省
        })
        if (this.$option == FormOptions.$modify) {
            this.$deleted = false;
            this.load();
        } else {
            this.formData = new yhfamershortcutModel();
            //默认核算单元
            new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load().then((result) => {
                if(result.length==1){
                    this.formData.NTicketedPointID = result[0].TicketedPointId;
                }
            });
            this.compareDataSource = deepCopy(this.formData);
        }
        // this.personSource = this.qlwOdataContext.getQlWPersonOData();

        new DataSource(this.qlwOdataContext.getQlWPersonOData()).load().then((res:any) => {
            this.PersonSource = res;
        })

        this.RoleSource = this.StatusODataContext.getRoleSourceType();

        this.warehouseSource = this.basicSettingODataContext.getWareHouseDataSource({
            select: ['WarehouseID', 'WarehouseName'],
        });
        this.ticketedPointSource = this.qlwOdataContext.getAccountagencyODataDataSource({
            select: ['TicketedPointId', 'TicketedPointName'],
        },true);
        // 场区
        this.ZoningSource = this.basicSettingODataContext.getBizZoningDataSource({
            select: ['ZoningID', 'ZoningName'],
        });

        //领用部门
        this.MarketSource = this.qlwCustomerContext.getBizMarketDataSource({
            filter: [
                ['IsUse', '=', 1],
                ['isEnd', '=', 1],
            ],
            select: ['MarketId', 'MarketName',],
        });

        this.ChickenFarmTypeSource = this.StatusODataContext.getFarmType();


        //   label: '综合种禽孵化场',
        //   value: '201704130105242110'

    }

    init_uploader(): yhfamershortcutDetailComponent {
        this.uploader.visible = true;
        this.uploader.readonly=!this.permission.$$edit || !this.permission.$$add;
        this.uploader.numericalOrder = this.numericalOrder;
        this.uploader.fileListChange = this.fileListChanged.bind(this);

        return this;
    }

    onActionClick(e) {
        if (e.key == 'add') {
            this.actionVisible = true;
            this.formDataZoning = new YHFarmerConcertRelateDto();
        } else {
            this.actionDelVisible = true;
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

    onZoningFormSubmit(type) {
        let validation = this.ZoningFormInstance.instance.validate().isValid;
        if (validation) {
            let flag = true;
            let YHFarmerConcertRelateDto:any = (<Array<any>>this.ActionGridRef.dataSource);
            let array = YHFarmerConcertRelateDto._items ? YHFarmerConcertRelateDto._items : YHFarmerConcertRelateDto;
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                if (element.Name == this.formDataZoning.Name && element.Phone == this.formDataZoning.Phone) {
                    Notify.toast('明细表中存在相同人员和手机号！', NotifyType.Error);
                    flag = false
                    return
                }
            }
            if (flag) {
                this.actionVisible = type;
                this._addonActiRowImpl(type)
            }
        }
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

    _onPopupHiding () {
        this.cusVisible = false;
        // this.cusFormData = {};
        // this.customerListData = [];
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

    NameValidation(params) {
        return new Promise((resolve) => {
            setTimeout(() => {
              resolve(this.ChickenFarmNameAll.indexOf(params.value) == -1 );
            }, 1000);
          });
    }

    _onValueChanged(e) {
        if (e.value) {
            this.formData.StartDate = new DateTime(e.value.toString()).toString('yyyy-MM-dd');
        } else {
            this.formData.StartDate = null;
        }
        this.$save = false;
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
                    rowData['Phone'] =  obj[0].Phone;
                    this.detailPeopleGrid.instance.refresh();
                    this.$save = false;
                }
            }
        }
    }

    fileListChanged(e) {
        if (!e.isInit) {
            // this.detailGridRef.modifyDataStatusSet();
        }
        this.fileList = e.Files;

        return this;
    }

    onCellClickEvent(e) {
        if (e.row) {
            const rowData = e.row.data;
            this.deleteKey = rowData.NumericalOrderDetail;
        } else {
            this.deleteKey = null;
        }
    }

    onCellClickEvent1(e) {
        if (e.row) {
            const rowData = e.row.data;
            this.deleteKey1 = rowData.NumericalOrderDetail;
        } else {
            this.deleteKey1 = null;
        }
    }

    onDetailClick(e) {
        if (this.$form) {
            return
        }
        if (e.key == 'add') {
            this._addRowImpl()
        } else {
            this._deleteRowImpl()
        }
    }

    onDetailPeopleClick(e) {
        if (this.$form) {
            return
        }
        if (e.key == 'add') {
            this._addPeopleRowImpl()
        } else {
            this._deletePeopleRowImpl()
        }
    }

    /** 增行 */
    _addRowImpl() {
        // if (this.submited) {
        //     Notify.error('请点击编辑按钮后再操作！');
        //     return
        // }
        let _data = { target: DataStatus.NewButNotEdit };
        // _data["SerialNum"] = this.key + 1;
        // this.key = this.key + 1;
        _data["NumericalOrder"] = '0';
        _data["ComboPack"] =  DataDictionary.ComboPackA;
        _data['EffectMonth'] = null;

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
            // this.onUpdate();
        });
    }
    /** 删行 */
    _deleteRowImpl() {
        this.$save = false;

        let _deleteKeys: any[] = []

        if (this.deleteKey) {
            _deleteKeys.push(this.deleteKey)
        }

        if (!_deleteKeys || _deleteKeys.length == 0) {
            _deleteKeys = [
                this.detailGridRef.instance.getKeyByRowIndex(this.detailGridRef.instance.getVisibleRows().length - 1),
            ];
        }

        ((<DataSource>this.detailGridRef.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this.deleteKey = null;
            this.detailGridRef.instance.refresh();
        });

    }

    /** 增行 */
    _addPeopleRowImpl() {
        // if (this.submited) {
        //     Notify.error('请点击编辑按钮后再操作！');
        //     return
        // }
        let _data = { target: DataStatus.NewButNotEdit };
        // _data["SerialNum"] = this.key + 1;
        // this.key = this.key + 1;
        _data["NumericalOrder"] = '0';
        _data["ComboPack"] =  DataDictionary.ComboPackA;
        _data['EffectMonth'] = null;

        let randomKey = undefined;
        const maxWhile = 10;
        let whileCount = 0;
        do {
            randomKey = Math.round(Math.random() * 10000000);
            if (whileCount > maxWhile) {
                break;
            }
            whileCount++;
        } while (this.detailPeopleGrid.instance.getRowIndexByKey(randomKey) > -1);
        _data[((<DataSource>this.detailPeopleGrid.dataSource).store() as CustomStore).key()] = randomKey;
        ((<DataSource>this.detailPeopleGrid.dataSource).store() as CustomStore).insert(_data).then(() => {
            this.detailPeopleGrid.instance.refresh();
            // this.onUpdate();
        });
    }
    /** 删行 */
    _deletePeopleRowImpl() {
        this.$save = false;

        let _deleteKeys: any[] = []

        if (this.deleteKey1) {
            _deleteKeys.push(this.deleteKey1)
        }

        if (!_deleteKeys || _deleteKeys.length == 0) {
            _deleteKeys = [
                this.detailPeopleGrid.instance.getKeyByRowIndex(this.detailPeopleGrid.instance.getVisibleRows().length - 1),
            ];
        }

        ((<DataSource>this.detailPeopleGrid.dataSource).store() as CustomStore).remove(_deleteKeys).then(() => {
            this.detailPeopleGrid.instance.refresh();
            this.deleteKey1 = null;
        });

    }

    showMap(e) {
        this.showMapPop = true;
        this.MapRid = 0;
        //获取坐标 或者获取省市县 定位
        this.mapsAddress = this.formData.FullAddress;
    }

    popup_hiding(e) {
        if (!e) {
            return;
        }

        let province = e[0]['province'];
        let city = e[0]['city'];
        let district = e[0]['district'];
        if (this.MapRid == 0) {
            this.formData['LAT'] = e[0].nLatitude;
            this.formData['LON'] = e[0].nLongitude;
            this.formData.coordinateAddr = province + city + district + e[0]['cCoordinateAddr'];

            this.formData.FullAddress = e[0]['cCoordinateAddr'];
            this.Province = e[0]['ProvinceId'];
            this.City = e[0]['CityId'];
            this.County = e[0]['CountyId'];
            this.formData.AreaID = this.County != '0' ? this.County : (this.City != '0' ? this.City : this.Province)
        } else {

            this.formData.CompanyFullAddress = e[0]['cCoordinateAddr'];
            this.CompanyProvince = e[0]['ProvinceId'];
            this.CompanyCity = e[0]['CityId'];
            this.CompanyCounty = e[0]['CountyId'];
            this.formData.CompanyAreaID = this.CompanyCounty != '0' ? this.CompanyCounty : (this.CompanyCity != '0' ? this.CompanyCity : this.CompanyProvince)
        }

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
    onFormSubmit() {
        if (!this.areaId || this.areaId == '-1') {
            Notify.toast(this.translator.I18N.chickenYHFarmSetting.AreaId.requestMessage, NotifyType.Error);
            return false;
        }
        const validation = this.formInstance.instance.validate().isValid;
        if (validation) {
            this.formData.AreaID = (this.areaId).toString();

            this.formData.ComboPack = this.service.comboPack;
            let YHFarmerConcertRelateDto:any = (<Array<any>>this.ActionGridRef.dataSource);
            this.formData.YHFarmerConcertRelateDto = YHFarmerConcertRelateDto._items ? YHFarmerConcertRelateDto._items : YHFarmerConcertRelateDto;
            let YHFarmerHenhouseRelateDto:any = (<Array<any>>this.detailGridRef.dataSource);
            this.formData.YHFarmerHenhouseRelateDto = YHFarmerHenhouseRelateDto._items ? YHFarmerHenhouseRelateDto._items : YHFarmerHenhouseRelateDto;
            let YHFarmerMgmtRelateDto:any = (<Array<any>>this.detailPeopleGrid.dataSource);
            this.formData.YHFarmerMgmtRelateDto = YHFarmerMgmtRelateDto._items ? YHFarmerMgmtRelateDto._items : YHFarmerMgmtRelateDto;
            this.formData.YHFarmerMgmtRelateDto.map(m => {
                m['RoleID'] = m.RoleID || '0';
            })
            this.formData.FileDto = this.fileList;
            this.service.post(this.formData).then((result: Result) => {
                const response = ResponseSuccess.handle(result);
                if (response.status) {
                    Notify.toast(`保存${response.message}`, NotifyType.Success);
                    if (this.$option == FormOptions.$create) {
                        this.$option = FormOptions.$modify;
                        this.ChickenFarmID = response.data.ChickenFarmID;
                        this.formData.ChickenFarmID = this.ChickenFarmID;
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
                    Notify.toast(response.message, NotifyType.Error);
                }
            });
        } else {
            Notify.toast('保存失败请检查输入内容', NotifyType.Error);
        }
    }
    add() {
        this.$option = FormOptions.$create;
        this.$deleted = true;
        this.$form = false;
        this.$fomat = false;
        // if (!this.$deleted) {
            this.cancel();
        // }
    }
    cancel() {
        if (this.$option == FormOptions.$create) {
            this.formInstance.instance.resetValues();
            this.formData = new yhfamershortcutModel();
            //默认核算单元
            new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load().then((result) => {
                if(result.length==1){
                    this.formData.NTicketedPointID = result[0].TicketedPointId;
                }
            });
            this.service.getLastPoultryCategory().then((res:any)=>{
                this.formData.PoultryCategory = res;
            })
            this.detailDataSource = this.service.getSettingSource();
            this.actionDataSource = this.service.getActionSource();
            this.detailDataPeopleSource = this.service.getPeSettingSource();
            this.service._settingUtil.init([]);
            this.service._actionUtil.init([]);
            this.service._settingUtilPe.init([]);
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
        this.basicSettingODataContext.bizChickenFarm.byKey(this.ChickenFarmID).then((value) => {
                this.$load = false;
                this.formData = value[0];
                this.service.address(Number(this.formData.AreaId), 1).then((res: any) => {
                    if (res.data.length) {
                        let axis = res.data[0].axis;
                        let arr = axis.split('$');
                        this.provinceId = Number(arr[1]);
                        this.cityId = Number(arr[2]);
                        this.areaId = Number(arr[3]);
                    }
                })
                setTimeout(() => {
                    this.$load = true;
                }, 200);
                this.compareDataSource = deepCopy(this.formData);
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
            if(e.dataField=='YHFarmerName'){
                if(this.formData.ChickenFarmName=='' || this.formData.ChickenFarmName==null){
                    this.formData.ChickenFarmName = e.value;
                }
            }
        }
    }

    deleteData() {
        MessageBox.confirm('您确认要删除吗', '提示').then((confirm) => {
            if (confirm) {
                this.service.deleteList([{ ChickenFarmID: this.ChickenFarmID }]).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        this.formInstance.instance.resetValues();
                        this.formData = new yhfamershortcutModel();
                        //默认核算单元
                        new DataSource(this.qlwOdataContext.getAccountagencyODataDataSource()).load().then((result) => {
                            if(result.length==1){
                                this.formData.NTicketedPointID = result[0].TicketedPointId;
                            }
                        });
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
