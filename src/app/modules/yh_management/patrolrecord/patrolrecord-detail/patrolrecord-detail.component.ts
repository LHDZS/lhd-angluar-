import { Component, ViewChild } from '@angular/core';
import { NxFormDetail } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail-extend';
import { NxZlwFormDetailComponent } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { ActivatedRoute } from '@angular/router';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxConditionItem } from 'src/app/components/search-panel/search-panel-extend';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { DataStatus, FormOptions,DataDictionary,DataDictionarySource } from 'src/app/providers/enums';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { NxButton } from 'src/app/components/component-model/button/model';
import { MessageBox, Notify, NotifyType } from 'src/app/providers/notify';
import { NxDataGridSummaryTotal } from 'src/app/components/component-model/data-grid/summary/model';
import {
    QlwODataContext,
    BasicSettingODataContext,
    QlwCustomerContext
} from 'src/app/providers/odataContext';
import { DataValidator } from 'src/app/providers/common/dataValidator';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { NxDataGridColumnValidationRule } from 'src/app/components/component-model/data-grid/columns/validation-rule/model';
import { RegExps } from 'src/app/providers/regexp';
import { DateTime } from 'src/app/providers/common/datetime';
import { getDay } from 'src/app/providers/common/getDay';
import { PatrolrecordService } from '../patrolrecord.service';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { TokenAuthService } from 'src/app/shared/services';
import { PatrolrecordAdd } from '../patrolrecord.model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { groupBy } from 'src/app/providers/groupby';
import { PrintPageComponent } from 'nxin-print';
import { HomeHelper } from 'src/app/providers/homeHelper';
import { dealBigMoney,Distinct } from 'src/app/providers/distinct';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';
import { ToolbarPanelType } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { YHBasicSettingODataContext } from 'src/app//providers/odataContext/yh.odataContext';
import { StatusODataContext } from 'src/app/providers/odataContext/status.odataContext';
import DataSource from 'devextreme/data/data_source';
import { PermissionCodes, PermissionService } from 'src/app/providers/permission';
import { FileInfo } from 'src/app/components/upload-view/upload-view.model';
import { NxUploader } from 'src/app/components/upload-view/upload-extend';
import { promise } from 'protractor';


@Component({
    selector: 'patrolrecord-detail',
    templateUrl: './patrolrecord-detail.component.html',
    styleUrls: ['./patrolrecord-detail.component.scss'],
})
export class PatrolrecordDetailComponent {
    @ViewChild('detailInstance', { static: false })
    detailInstance: NxZlwFormDetailComponent;
    model: NxFormDetail = new NxFormDetail();
    /**
     * 流水号
     */
    numericalOrder: string;
    @ViewChild('dataGrid', { static: false })
    dataGrid: DxDataGridComponent;

    //附件
    permission: PermissionService = new PermissionService();
    uploadUrl: string = environment.nxinfileServerUrl;
    fileList: FileInfo[] = [];
    uploader:NxUploader=new NxUploader();
    //
    batchSource: any = [];
    productSource: any;
    currentCount: number = 0;
    iNumericalOrderPlan: string = '0';
    dataDateFlag: boolean = false;
    pcDate: string;
    DaysOld: Number;

    editFlag : boolean = false;

    allProductBatchSource: any;
    //打印
    menu_id: string;
    environment: any;
    tokenData: any;
    @ViewChild('printPage', { static: false })
    _printPage: PrintPageComponent;
    printDataSource:any=[];

    @ViewChild('gridRef', { static: false })
    dataGridRef: DxDataGridComponent;
    outVisible: boolean = false;
    formData: any = {};
    $form: boolean = false;
    AutoDataSource: any;
    AutoDataSourceFilter: any;
    cProductNameSource: any;
    loading: boolean = false;
    BatchDataSource: any;
    ChickenFarmDataSource: any;

    HenhouseSourceall:any

    HenhouseBydataSource: any;
    YHFarmerContract: string;
    isManageToHenhouse: any;
    PersonSource: any;
    ProductBatchSource: any;

    StartDateEditorOptions: any;
    EndDateEditorOptions: any
    DataDateVisible: boolean = false;
    allLmDataDate: string = '';

    @ViewChild('jcDetailGrid', { static: false })
    jcDetailGrid: DxDataGridComponent;
    $formAdd: boolean = false;
    jcAddVisible: boolean = false;
    addFormData: any = {
        DaysOld: 0,
        QmQuantity: 0,
        YQmQuantity: 0,
        YSljcQuantity: 0,
        YSljcPackages: 0,
        SljcPackages: 0,
        SljcQuantity: 0,
    }
    jcAddDataSource: any;
    selectedRows: any = [];
    balanceType: boolean = true;
    maxDate: any = new Date();
    PatrolRecordData: any = [];
    cPatrolRecordData: any = [];
    defaultVisible: boolean = false;
    defaultVisible1: boolean = false;
    //#endregion
    constructor(
        private route: ActivatedRoute,
        private service: PatrolrecordService,
        private http: HttpClient,
        private qlwOdataContext: QlwODataContext,
        private tokenService: TokenAuthService,
        private basicSettingODataContext: BasicSettingODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private translator: TranslateService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private StatusODataContext: StatusODataContext
    ) {
        this.StartDateEditorOptions = { width: '100%',placeholder:'请选择开始日期', min: null, max: new Date() };
        this.EndDateEditorOptions = { width: '100%',placeholder:'请选择结束日期', min: null, max: new Date() };
        this.permission.refresh(this.tokenService.getTokenData.permissions);
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.model.initialization = this.initialization.bind(this);

        this.service.getProductBatch().then((res:any)=>{
            this.allProductBatchSource = res.value;
        });

        // this.cProductNameSource = this.basicSettingODataContext.getBizProductannexedDataSource({
        //     filter: [
        //         ['iSortPlus', '=', DataDictionary.iSortA],
        //         'or',
        //         ['iSortPlus', '=', DataDictionary.iSortJ]
        //     ],
        //     select: ['ProductID', 'cProductName'],
        // });

        this.YHBasicSettingODataContext.YHBatch.load().then((res:any) => {
            this.BatchDataSource = res
        })

        this.basicSettingODataContext.bizChickenFarm.load().then((res:any) => {
            this.ChickenFarmDataSource = res
        })



        //是否开启了禽养户单据管理到栋
        this.service.getConfiguration().then((res:any) => {
            this.isManageToHenhouse = res;
            if (res) {
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly = false;
            } else {
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly = true;
            }
        })

        this.init_data_grid().init_table_header().init_toolbar_panel().init_uploader();
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
    }

    async getGetSLStock(DataDate,ProductID,ProductBatchID) {
        this.loading = true;
        let param = {
            DataDate: DataDate,
            YHBatch: this.model.conditionPanel.data['YHBatch'],
            HenhouseID: this.model.conditionPanel.data['HenhouseID'] || '0',
            ProductID: ProductID||"0",
            ProductBatchID: ProductBatchID||"0",
            Type: 0,
            NumericalOrder : this.numericalOrder || '0'
        }
        this.addFormData.YSljcQuantity = 0;
        this.addFormData.YSljcPackages = 0;
        this.addFormData.SljcPackages = 0;
        this.addFormData.SljcQuantity = 0; 
        await this.service.getFeed(param).then((res:any) => {
            this.loading = false;
            let obj = res.length > 0 ? res[0] : {};
            this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            let pcDate = new DateTime(DataDate).toString('yyyy-MM-dd');
            let start = new Date(pcDate);
            var SljcPackages = 0;
            if(obj.SljcPackages){
                SljcPackages = Number(obj.SljcPackages);
            }
            
            var SljcQuantity = 0;
            if(obj.SljcQuantity){
                SljcQuantity = Number(obj.SljcQuantity);
            }
            this.addFormData.YSljcQuantity = SljcQuantity;
            this.addFormData.YSljcPackages = SljcPackages;
            oldData.map((m) => {
                if(m.target != DataStatus.deleted && m['DataDateDetail']){
                    let pcDate2 = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                    let end= new Date(pcDate2);
                    let diff = new DateTime().diff(start, end);
                    if(diff>=0){

                        var ProductID2 = "0";
                        var ProductBatchID2 = "0";

                        if(m.ProductID){
                            ProductID2 = m.ProductID;
                        }
                        if(m.ProductBatchID){
                            ProductBatchID2 = m.ProductBatchID;
                        }
                        if(ProductID2==param.ProductID && ProductBatchID2==param.ProductBatchID){
                            var Quantity=0;
                            if(m.Quantity){
                                Quantity = Number(m.Quantity);
                            }
                            var Packages=0;
                            if(m.Packages){
                                Packages = Number(m.Packages);
                            }
                            SljcPackages-=Packages;
                            SljcQuantity-=Quantity;
                        }
                    }
                }
            });
            this.addFormData.SljcPackages = SljcPackages;
            this.addFormData.SljcQuantity = SljcQuantity;
        })
    }

    onQuery() {
        this.loading = true;
        let obj = {
            DataDate: new DateTime(this.addFormData.DataDate).toString('yyyy-MM-dd'),
            YHBatch: this.model.conditionPanel.data['YHBatch'],
            HenhouseID: this.model.conditionPanel.data['HenhouseID'] || '0',
            ProductID: '',
            ProductBatchID: '',
            Type:  1,
            NumericalOrder : this.numericalOrder || '0'
        }
        let pcDate2 = new DateTime(this.addFormData.DataDate).toString('yyyy-MM-dd');
        let start2 = new Date(pcDate2);

        this.service.getFeed(obj).then((res:any) => {
            this.loading = false;

            var arr = [];
            var index=0;
            this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            res.forEach((f) => {
                    index++;
                    var row = deepCopy(f);
                    row['RecordID'] = new DateTime().randomValue + index;

                    row.YSljcQuantity=Number(row.YSljcQuantity);
                    row.YSljcPackages=Number(row.YSljcPackages);
                    var SljcQuantity=Number(row.YSljcQuantity);
                    var SljcPackages=Number(row.YSljcPackages);

                    var ProductBatchID="0";
                    var ProductID="0";
                    if (row.BatchID) {
                        ProductBatchID = row.BatchID;
                    }

                    if (row.ProductID) {
                        ProductID = row.ProductID;
                    }
                    
                    oldData.map((m) => {
                        if(m.target != DataStatus.deleted && m['DataDateDetail']){
                            let pcDate3 = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                            let end2= new Date(pcDate3);
                            let diff2 = new DateTime().diff(start2, end2);
                            if(diff2>=0){
                                var ProductBatchID2="0";
                                var ProductID2="0";
                                if (m.ProductBatchID) {
                                    ProductBatchID2 = m.ProductBatchID;
                                }

                                if (m.ProductID) {
                                    ProductID2 = m.ProductID;
                                }

                                if(ProductBatchID2==ProductBatchID && ProductID==ProductID2){
                                    var Quantity=0;
                                    if(m.Quantity){
                                        Quantity = Number(m.Quantity);
                                    }
                                    var Packages=0;
                                    if(m.Packages){
                                        Packages = Number(m.Packages);
                                    }
                                    SljcPackages-=Packages;
                                    SljcQuantity-=Quantity;
                                }

                            }
                        }
                    });
                    row.SljcPackages=SljcPackages;
                    row.SljcQuantity=SljcQuantity;
                    row.SljcPackages2=SljcPackages;
                    row.SljcQuantity2=SljcQuantity;
                    if(this.balanceType){
                        console.log(this.balanceType,"this.balanceType")
                        if(SljcQuantity>0){
                            arr.push(row);
                        }
                    }else{
                        arr.push(row);
                    }
            })
            this.jcAddDataSource = arr;
        })
    }

    async getGetStock(DataDate) {
        let YHBatch = this.model.conditionPanel.data['YHBatch'];
        let NumericalOrder = this.numericalOrder || '0';
        this.addFormData.YQmQuantity = 0;
        this.addFormData.QmQuantity = 0;
        let HenhouseID = this.model.conditionPanel.data['HenhouseID'] || '0';
        await this.service.getStock(DataDate,YHBatch,NumericalOrder,"0",HenhouseID).then((res:any) => {
            let obj = res.length > 0 ? res[0] : {};
            this.addFormData.DaysOld = obj.DaysOld;
            this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            let pcDate = new DateTime(DataDate).toString('yyyy-MM-dd');
            let start = new Date(pcDate);
            var QmQuantity = 0;
            if(obj.QmQuantity){
                QmQuantity = Number(obj.QmQuantity);
            }
            this.addFormData.YQmQuantity = QmQuantity;
            oldData.map((m) => {
                if(m.target != DataStatus.deleted && m['DataDateDetail']){
                    let pcDate2 = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                    let end= new Date(pcDate2);
                    let diff = new DateTime().diff(start, end);
                    if(diff>=0){
                        var DeathQuantity=0;
                        if(m.DeathQuantity){
                            DeathQuantity = Number(m.DeathQuantity);
                        }
                        var CullQuantity=0;
                        if(m.CullQuantity){
                            CullQuantity = Number(m.CullQuantity);
                        }
                        QmQuantity-=(CullQuantity+DeathQuantity);
                    }
                }
            });
            this.addFormData.QmQuantity = QmQuantity;
        })
    }

    onFieldDataChanged1(e) {
        switch(e.dataField) {
            case 'DataDate':
                if(e.value){
                    this.getGetStock(new DateTime(e.value).toString('yyyy-MM-dd'))
                    this.onQuery();
                }
                break;
                
            default:
                break;
        }
    }

    onEditorPreparingFn2(e) {
        if (e.dataField && e.row.rowType == 'data') {
            const rowData = e.row.data;
            const rowIndex = e.row.dataIndex;
            var StandardPack = rowData['StandardPack'];
            var bIsStandardPack = rowData['bIsStandardPack'];
            switch(e.dataField) {
                case 'Quantity':
                    if(e.value){
                        if (StandardPack && bIsStandardPack) {
                            rowData['Packages'] = (e.value/StandardPack).toFixed(4);
                            rowData['SljcPackages'] = rowData['SljcPackages2'] - rowData['Packages'];
                        }
                        rowData['SljcQuantity'] = rowData['SljcQuantity2'] - e.value;
                    }
                    break;
                case 'Packages':
                    if(e.value){
                        if (StandardPack && bIsStandardPack) {
                            rowData['Quantity'] = (e.value*StandardPack).toFixed(4);
                            rowData['SljcQuantity'] = rowData['SljcQuantity2'] - rowData['Quantity'];
                        }
                        rowData['SljcPackages'] = rowData['SljcPackages2'] - e.value;
                    }
                    break;
                default:
                    break;
            }
            e.editorOptions.onValueChanged = (_e) => {
                if (this.selectedRows.indexOf(e.row.key) === -1) {
                    // this.selectedRows.push(e.row.key)
                    // console.log(e)
                    this.selectedRows.splice(rowIndex,0,e.row.key)
                }
                console.log(this.selectedRows)
                rowData[e.dataField] = _e.value
                this.jcDetailGrid.instance.refresh();
            }
        }
    }

    postSelection(type) {
        if (type == '3') {
            this.jcAddVisible = false;
            return false;
        }
        setTimeout(async () => {
            this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
            var selectedRowsData11 = this.jcDetailGrid.instance.getSelectedRowsData();
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            let arry = [];
            (<Array<any>>oldData).forEach((data) => {
                let isAllEmpty = true;
                let props = Object.keys(data).filter(
                    (x) => x != this.model.dataGrid.primaryKey && x != 'target' && x != 'SerialNo'
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
            let SerialNo = 0;
            (<Array<any>>this.model.dataGrid.props.dataSource).forEach((m) => {
                if(m.SerialNo > SerialNo) SerialNo = m.SerialNo;
            });
            
            selectedRowsData11.forEach((f, i) => {
                var row = deepCopy(f);
              
                row[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                row.target = DataStatus.newline;
                row['CommonName'] = f.ProductCommonName;
                row["SerialNo"] = ++SerialNo;
                row['NumericalOrderSource'] = f.NumericalOrder;
                row['NumericalOrderDetailSource'] = f.NumericalOrderDetail;
                row['ProductBatchName'] = f.BatchName;
                row['ProductBatchID'] = f.BatchID;
                row['DataDateDetail'] = this.addFormData.DataDate;
                row['DaysOld'] = this.addFormData.DaysOld;
                row['QmQuantity'] = this.addFormData.QmQuantity;
                row['YQmQuantity'] = this.addFormData.YQmQuantity;
                arry.push(row);
            });
            this.model.dataGrid.props.dataSource = arry;
            this.detailInstance.dataGrid.dataGrid.instance.refresh();
            this.detailInstance.modifyDataStatusSet();
            this.adjustAllData();

            if (type == '1') {
                this.jcAddVisible = false;
            }
        },200)
    }

    adjustAllData(){
        this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
        var oldData = <Array<any>>this.model.dataGrid.props.dataSource;

        (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
            
            if(m.target != DataStatus.deleted && m['DataDateDetail']){
                let pcDate2 = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                let end= new Date(pcDate2);
                var YQmQuantity2 = 0;
                if(m.YQmQuantity){
                    YQmQuantity2 = Number(m.YQmQuantity);
                }

                var ProductID2 = "0";
                var ProductBatchID2 = "0";

                if(m.ProductID){
                    ProductID2 = m.ProductID;
                }
                if(m.ProductBatchID){
                    ProductBatchID2 = m.ProductBatchID;
                }
                var YSljcQuantity2 = 0;
                if(m.YSljcQuantity){
                    YSljcQuantity2 = Number(m.YSljcQuantity);
                }
                var YSljcPackages2 = 0;
                if(m.YSljcPackages){
                    YSljcPackages2 = Number(m.YSljcPackages);
                }


                oldData.map((m2) => {
                    if(m2.target != DataStatus.deleted && m2['DataDateDetail']){
                        let pcDate3 = new DateTime(m2['DataDateDetail']).toString('yyyy-MM-dd');
                        let end3= new Date(pcDate3);
                        let diff3 = new DateTime().diff(end, end3);
                        if(diff3>=0){
                            var DeathQuantity=0;
                            if(m2.DeathQuantity){
                                DeathQuantity = Number(m2.DeathQuantity);
                            }
                            var CullQuantity=0;
                            if(m2.CullQuantity){
                                CullQuantity = Number(m2.CullQuantity);
                            }
                            YQmQuantity2-=(CullQuantity+DeathQuantity);

                            var ProductID3 = "0";
                            var ProductBatchID3 = "0";
                            if(m2.ProductID){
                                ProductID3 = m2.ProductID;
                            }
                            if(m2.ProductBatchID){
                                ProductBatchID3 = m2.ProductBatchID;
                            }
                            if(ProductID2 == ProductID3 && ProductBatchID2 == ProductBatchID3){
                                var Quantity=0;
                                if(m2.Quantity){
                                    Quantity = Number(m2.Quantity);
                                }
                                var Packages=0;
                                if(m2.Packages){
                                    Packages = Number(m2.Packages);
                                }
                                YSljcPackages2-=Packages;
                                YSljcQuantity2-=Quantity;
                            }
                        }
                    }
                });
                m.QmQuantity = YQmQuantity2;
                m.SljcQuantity = YSljcQuantity2;
                m.SljcPackages = YSljcPackages2;
                this.detailInstance.dataGrid.refresh();
            }
        });
        this.setReadOnly();
    }

    init_uploader(): PatrolrecordDetailComponent {
        this.uploader.visible = true;
        this.uploader.readonly=!this.permission.$$edit || !this.permission.$$add;
        this.uploader.numericalOrder = this.numericalOrder;
        this.uploader.fileListChange = this.fileListChanged.bind(this);

        return this;
    }
    fileListChanged(e) {
        if (!e.isInit) {
            this.detailInstance.modifyDataStatusSet();
        }
        this.fileList = e.Files;

        return this;
    }

    //#region 初始化表格
    init_data_grid(): PatrolrecordDetailComponent {
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.stateStoring.storageKey = 'Patrolrecord-detail';
        this.model.dataGrid.stateStoring.enabled = true;
        this.model.dataGrid.columns.push(...this.columns);
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.summary.enabled = true;

        const summaryItem_total_DeathQuantity = new NxDataGridSummaryTotal();
        summaryItem_total_DeathQuantity.column = 'DeathQuantity';
        summaryItem_total_DeathQuantity.summaryType = 'sum';
        summaryItem_total_DeathQuantity.valueFormat = '0';

        const summaryItem_total_CullQuantity = new NxDataGridSummaryTotal();
        summaryItem_total_CullQuantity.column = 'CullQuantity';
        summaryItem_total_CullQuantity.summaryType = 'sum';
        summaryItem_total_CullQuantity.valueFormat = '0';

        const summaryItem_total_Packages = new NxDataGridSummaryTotal();
        summaryItem_total_Packages.column = 'Packages';
        summaryItem_total_Packages.summaryType = 'sum';
        summaryItem_total_Packages.valueFormat = '4';

        const summaryItem_total_Quantity = new NxDataGridSummaryTotal();
        summaryItem_total_Quantity.column = 'Quantity';
        summaryItem_total_Quantity.summaryType = 'sum';
        summaryItem_total_Quantity.valueFormat = '4';

        this.model.dataGrid.summary.totalItems = [summaryItem_total_DeathQuantity,summaryItem_total_CullQuantity,summaryItem_total_Packages,summaryItem_total_Quantity];
        this.model.dataGrid.events.onCellClick = this.handleCell.bind(this);
        this.model.dataGrid.paginate.pager.visible = 'auto';
        this.model.dataGrid.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);
        return this;
    }

    get columns() {
        const col_dataDate = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.DataDate.text,
            'DataDateDetail',
            'date'
        );
        col_dataDate.props.width = 120;
        col_dataDate.props.format = 'yyyy/MM/dd';
        col_dataDate.props.editorOptions = {max: new Date()};
        col_dataDate.props.filterOperations = ['between', '='];
        col_dataDate.props.selectedFilterOperation = 'between';
        col_dataDate.props.allowHeaderFiltering = false;
        col_dataDate.props.HeaderRequiredIcon = true;
        col_dataDate.props.cellTemplate.widget = new NxDateBox();
        col_dataDate.props.cellTemplate.widget.props.max = new Date();
        col_dataDate.props.fixed = true;
        // col_dataDate.props.setCellValue = (newdata, value, oldData) => {
        //     (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
        //         if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
        //             let obj = this.GetgetFeed(value,oldData.ProductID,oldData.ProductBatchID);
        //             obj.then((res) => {
        //                 if (res) {
        //                     m['SljcPackages'] = res.SljcPackages;
        //                     m['SljcQuantity'] = res.SljcQuantity;
        //                     m['SljcPackagesCopy'] = res.SljcPackages;
        //                     m['SljcQuantityCopy'] = res.SljcQuantity;
        //                     this.detailInstance.dataGrid.refresh();
        //                 }
        //             })
        //             m['DataDateDetail'] = value;
        //             if(this.pcDate&&this.DaysOld&&value){
        //                 let pcDate = new DateTime(this.pcDate).toString('yyyy-MM-dd');
        //                 let DataDate = new DateTime(value).toString('yyyy-MM-dd');
        //                 let start = new Date(DataDate);
        //                 let end= new Date(pcDate);
        //                 let diff = new DateTime().diff(start, end);
        //                 m['DaysOld'] = Number(diff)+Number(this.DaysOld) + "";
        //             }
        //         }
        //     });
        // };


        // 日龄
        const col_DaysOld = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.DaysOld.text,
            'DaysOld',
            'number'
        );
        col_DaysOld.props.visible = true;
        col_DaysOld.props.allowEditing = false;
        col_DaysOld.props.width=80;
        col_DaysOld.props.allowFixing = false;
        col_DaysOld.props.alignment = 'right';
        col_DaysOld.props.cssClass = 'disabled';
        col_DaysOld.props.fixed = true;

        // 死亡只数
        const col_DeathQuantity = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.DeathQuantity.text,
            'DeathQuantity',
            'number'
        );
        col_DeathQuantity.props.visible = true;
        col_DeathQuantity.props.allowEditing = true;
        col_DeathQuantity.props.width = 80;
        const col_DeathQuantity_pattern = new NxDataGridColumnValidationRule();
        col_DeathQuantity_pattern.type = 'pattern';
        col_DeathQuantity_pattern.pattern = RegExps.IntNumber;
        col_DeathQuantity_pattern.message = this.translator.I18N.Patrolrecord.DeathQuantity.requiredMessage;
        col_DeathQuantity.props.alignment = 'right';
        col_DeathQuantity.validationRules.push(...[col_DeathQuantity_pattern]);

        // 淘汰只数
        const col_CullQuantity = new NxDataGridColumn(
            this.translator.I18N.Patrolrecord.CullQuantity.text,
            'CullQuantity',
            'number'
        );
        col_CullQuantity.props.visible = true;
        col_CullQuantity.props.allowEditing = true;
        col_CullQuantity.props.width = 80;
        const col_CullQuantity_pattern = new NxDataGridColumnValidationRule();
        col_CullQuantity_pattern.type = 'pattern';
        col_CullQuantity_pattern.pattern = RegExps.IntNumber;
        col_CullQuantity_pattern.message = this.translator.I18N.Patrolrecord.CullQuantity.requiredMessage;
        col_CullQuantity.props.alignment = 'right';
        col_CullQuantity.validationRules.push(...[col_CullQuantity_pattern]);


        // 死淘备注
        const col_DeathCullRemarks = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.DeathCullRemarks.text,
            'DeathCullRemarks',
            'string'
        );
        col_DeathCullRemarks.props.visible = true;
        col_DeathCullRemarks.props.allowEditing = true;
        col_DeathCullRemarks.props.width = 120;
        col_DeathCullRemarks.props.alignment = 'left';

        //商品代号
        const col_ProductID = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.ProductName.text,
            'ProductID',
            'string',
            'ProductName'
        );
        col_ProductID.props.width = 120;
        col_ProductID.props.requiredDisable = false;
        // col_ProductID.props.lookup.enabled = true;
        // col_ProductID.props.allowEditing = true;
        col_ProductID.props.HeaderRequiredIcon = false;
        col_ProductID.props.cellTemplate.widget = new NxSelectBox();
        col_ProductID.props.cellTemplate.enabled = true;
        col_ProductID.props.cellTemplate.type = 'SelectBox';
        col_ProductID.props.cellTemplate.templateName = "aName";

        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.dataSource = [];
        // this.basicSettingODataContext.getProductDataSource({
        //     filter: [
        //         ['iSortPlus', '=', DataDictionary.iSortA],
        //         'or',
        //         ['iSortPlus', '=', DataDictionary.iSortK]
        //     ],
        //     // select: ['ProductID', 'cProductName','MnemonicCode'],
        // });
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.valueExpr = 'ProductID';
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.displayExpr = 'ProductName';
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchExpr = ['ProductID','ProductName','MnemonicCode'];
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchEnabled = true;
        // const col_ProductID_required = new NxDataGridColumnValidationRule('required');
        // col_ProductID_required.message = this.translator.I18N.PatrolrecordDetail.ProductName.required;
        // col_ProductID.validationRules.push(...[col_ProductID_required]);
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).events.onOpened = async (e, cell, row) => {
            console.log(e, cell, row)
            let HenhouseID = '0';
            if ( this.isManageToHenhouse ) {
                HenhouseID = this.model.conditionPanel.data['HenhouseID'] || '0'
            }
            let Para = {
                YHBatch: this.model.conditionPanel.data['YHBatch'] || '0',
                HenhouseID: HenhouseID,
                StartDate: cell.data.DataDateDetail ? new DateTime(cell.data.DataDateDetail).toString('yyyy-MM-dd') : '0',
                EndDate: '1',
            }
            await this.service.PatrolRecordProduct(Para).then((res:any) => {
                let dataSource = Distinct(res.data,"ProductID");
                e.component.option('dataSource', dataSource)
            })
            
        }
        col_ProductID.props.setCellValue = (newdata, value, oldData) => {
            if (value) {
                
                var iSort = 'ProductID=' + value + '&';
                this.service
                    .getProduct(<any>iSort)
                    .then((result: any) => {
                        (<Array<any>>this.model.dataGrid.props.dataSource).map(async (m) => {
                            if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                                if(oldData.DataDateDetail){
                                    if(value!="0"){
                                        let DataDateDetail = new DateTime(oldData.DataDateDetail).toString('yyyy-MM-dd');
                                        await this.getGetSLStock(DataDateDetail,value,oldData['ProductBatchID'])
                                    }
                                }
                                m['ProductID'] = value;
                                m['ProductName'] = result.value[0].cProductName;
                                m['ProductBatchID'] = null;
                                m['ProductBatchName'] = '';
                                m['Specification'] = result.value[0].Specification;
                                m['StandardPack'] = result.value[0].StandardPack;
                                m['bIsStandardPack'] = result.value[0].bIsStandardPack;
                                m['MeasureUnitName'] = result.value[0].MeasureUnitName;
                                m['Quantity'] = 0;
                                m['Packages'] = 0;
                                m['YSljcQuantity'] = this.addFormData.YSljcQuantity;
                                m['YSljcPackages'] = this.addFormData.YSljcPackages;
                                m['SljcPackages'] = this.addFormData.SljcPackages;
                                m['SljcQuantity'] = this.addFormData.SljcQuantity;
                                if(m['ProductID']&&m['ProductID']!="0"){
                                    let ProductID = m['ProductID']||0;
                                    let ProductBatchID = m['ProductBatchID']||0;
                                    await this.adjustSLData(m.NumericalOrderDetail,m['YSljcQuantity'],m['YSljcPackages'],m['SljcPackages'],m['SljcQuantity'],m['DataDateDetail'],ProductID,ProductBatchID,true);
                                }
                                setTimeout(() => {
                                    this.detailInstance.modifyDataStatusSet();
                                    this.detailInstance.dataGrid.dataGrid.instance.refresh();
                                    this.setReadOnly();
                                }, 20);
                            }
                        });
                    });
            } else {
                (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                    if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                        m['ProductID'] = '0';
                        m['ProductName'] = '';
                        m['ProductBatchID'] = null;
                        m['ProductBatchName'] = '';
                        m['MeasureUnitName'] = '';
                        m['Specification'] = null;
                        m['StandardPack'] = null;
                        m['bIsStandardPack'] = null;
                        m['bIsStandardPackName'] = null;
                        setTimeout(() => {
                            this.detailInstance.dataGrid.refresh();
                            this.setReadOnly();
                        }, 20);
                    }
                });

            }
        }

        const col_Specification = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.Specification.text,
            'Specification',
            'string'
        );
        col_Specification.props.visible = true;
        col_Specification.props.allowEditing = false;
        col_Specification.props.width=100;
        col_Specification.props.alignment = 'center';
        col_Specification.props.cssClass = 'disabled';

        const col_bIsStandardPack = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.bIsStandardPack.text,
            'bIsStandardPack',
            'string'
        );
        col_bIsStandardPack.props.visible = true;
        col_bIsStandardPack.props.allowEditing = false;
        col_bIsStandardPack.props.width=60;
        col_bIsStandardPack.props.alignment = 'center';
        col_bIsStandardPack.props.lookup.enabled = true;
        col_bIsStandardPack.props.lookup.dataSource = DataDictionarySource.blImmunitySource;
        col_bIsStandardPack.props.lookup.valueExpr = 'value';
        col_bIsStandardPack.props.lookup.displayExpr = 'name';
        col_bIsStandardPack.props.cssClass = 'disabled';


        const col_StandardPack = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.StandardPack.text,
            'StandardPack',
            'string'
        );
        col_StandardPack.props.visible = true;
        col_StandardPack.props.allowEditing = false;
        col_StandardPack.props.width=100;
        col_StandardPack.props.alignment = 'center';
        col_StandardPack.props.cssClass = 'disabled';


        //批号
        const col_ProductBatchID = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.ProductBatchID.text,
            'ProductBatchID',
            'string',
            'ProductBatchName'
        );
        col_ProductBatchID.props.width = 120;
        col_ProductBatchID.props.requiredDisable = true;
        col_ProductBatchID.props.lookup.enabled = true;
        col_ProductBatchID.props.allowEditing = true;
        col_ProductBatchID.props.HeaderRequiredIcon = false;
        col_ProductBatchID.props.lookup.dataSource = []
        col_ProductBatchID.props.lookup.valueExpr = 'ProductBatchID';
        col_ProductBatchID.props.lookup.displayExpr = 'ProductBatchName';
        // col_ProductBatchID.props.setCellValue = (newData, value, oldData) => {
        //     // if (value) {
        //         (<Array<any>>this.model.dataGrid.props.dataSource).map(async (m) => {
        //             if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
        //                 if(oldData.DataDateDetail){
        //                     if(oldData['ProductID']!="0"){
        //                         let DataDateDetail = new DateTime(oldData.DataDateDetail).toString('yyyy-MM-dd');
        //                         console.log("===========")
        //                         await this.getGetSLStock(DataDateDetail,oldData['ProductID'],value)
        //                     }
        //                 }
        //                 m['ProductBatchID'] = value;
        //                 // m['Quantity'] = 0;
        //                 // m['Packages'] = 0;
        //                 m['YSljcQuantity'] = this.addFormData.YSljcQuantity;
        //                 m['YSljcPackages'] = this.addFormData.YSljcPackages;
        //                 m['SljcPackages'] = this.addFormData.SljcPackages;
        //                 m['SljcQuantity'] = this.addFormData.SljcQuantity;
        //                 if(m['ProductID']&&m['ProductID']!="0"){
        //                     let ProductID = m['ProductID']||0;
        //                     let ProductBatchID = m['ProductBatchID']||0;
        //                    await this.adjustSLData(m.NumericalOrderDetail,m['YSljcQuantity'],m['YSljcPackages'],m['SljcPackages'],m['SljcQuantity'],m['DataDateDetail'],ProductID,ProductBatchID);
        //                 }
        //                 setTimeout(() => {
        //                     this.detailInstance.modifyDataStatusSet();
        //                     this.detailInstance.dataGrid.dataGrid.instance.refresh();
        //                 }, 20);
        //             }
        //         })
        //     // }
        // };

        //计量单位
        const col_MeasureUnitName = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.MeasureUnitName.text,
            'MeasureUnitName',
            'string',
        );
        col_MeasureUnitName.props.lookup.enabled = true;
        col_MeasureUnitName.props.allowEditing = false;
        col_MeasureUnitName.props.width=100;
        col_MeasureUnitName.props.alignment = 'center'
        col_MeasureUnitName.props.cssClass = 'disabled';

        // 件数
        const col_Packages = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.Packages.text,
            'Packages',
            'number'
        );
        col_Packages.props.width = 120;
        col_Packages.props.alignment = 'right';
        col_Packages.props.visible = true;
        const col_Packages_pattern = new NxDataGridColumnValidationRule();
        col_Packages_pattern.type = 'pattern';
        col_Packages_pattern.pattern = RegExps.AllNumber4;
        col_Packages_pattern.message = this.translator.I18N.PatrolrecordDetail.Packages.patternMessage;
        col_Packages.validationRules.push(...[col_Packages_pattern]);
        col_Packages.props.setCellValue = (newdata, value, oldData) => {
            var StandardPack = oldData['StandardPack'];
            var bIsStandardPack = oldData['bIsStandardPack'];
            // if (oldData['SljcPackagesCopy'] && oldData['SljcQuantityCopy']) {
            //     oldData['SljcPackages'] = (oldData.SljcPackagesCopy - Number(value)).toFixed(2);
            //     oldData['SljcQuantity'] = (oldData.SljcQuantityCopy - Number(value*StandardPack)).toFixed(2);
            // }
            (<Array<any>>this.model.dataGrid.props.dataSource).map(async (m) => {
                var Packages = 0;
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {

                    if(value){
                        Packages = Number(value);
                    }  
                    m['Packages'] = Packages.toFixed(4);

                    if (StandardPack && bIsStandardPack) {
                        m['Quantity'] = (Number(m['Packages'])*StandardPack).toFixed(4);
                    }

                    this.detailInstance.dataGrid.dataGrid.instance.refresh();
                    var Quantity=0;
                    if(m['Quantity']){
                        Quantity = Number(m['Quantity']);
                    }
                    var Packages=0;
                    if(m['Packages']){
                        Packages = Number(m['Packages']);
                    }
                    let pcDate = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                    let start = new Date(pcDate);

                    var ProductID = "0";
                    var ProductBatchID = "0";

                    if(m.ProductID){
                        ProductID = m.ProductID;
                    }
                    if(m.ProductBatchID){
                        ProductBatchID = m.ProductBatchID;
                    }

                    (<Array<any>>this.model.dataGrid.props.dataSource).map((m2) => {
                        if (m2.target != DataStatus.deleted && m2.NumericalOrderDetail != m.NumericalOrderDetail) {

                            var ProductID2 = "0";
                            var ProductBatchID2 = "0";

                            if(m2.ProductID){
                                ProductID2 = m2.ProductID;
                            }
                            if(m2.ProductBatchID){
                                ProductBatchID2 = m2.ProductBatchID;
                            }
                            if(ProductBatchID==ProductBatchID2&&ProductID==ProductID2){
                                let pcDate2 = new DateTime(m2['DataDateDetail']).toString('yyyy-MM-dd');
                                let end= new Date(pcDate2);
                                let diff = new DateTime().diff(start, end);
                                if(diff>=0){
                                    if(m2['Quantity']){
                                        Quantity += Number(m2['Quantity']);
                                    }
                                    if(m2['Packages']){
                                        Packages += Number(m2['Packages']);
                                    }
                                }
                            }
                            
                        }
                    });
                    m['SljcQuantity'] = Number(m['YSljcQuantity'])-Quantity;
                    m['SljcPackages'] = Number(m['YSljcPackages'])-Packages;
                    if(ProductID!="0"){
                        await this.adjustSLData(m.NumericalOrderDetail,m['YSljcQuantity'],m['YSljcPackages'],m['SljcPackages'],m['SljcQuantity'],m['DataDateDetail'],ProductID,ProductBatchID,false);
                    }
                    this.detailInstance.modifyDataStatusSet();
                    this.detailInstance.dataGrid.dataGrid.instance.refresh();
                }
            });
        }

        // 数量
        const col_Quantity = new NxDataGridColumn(
            this.translator.I18N.PatrolrecordDetail.Quantity.text,
            'Quantity',
            'number'
        );
        col_Quantity.props.width = 120;
        col_Quantity.props.visible = true;
        col_Quantity.props.alignment = 'right';
        col_Quantity.props.HeaderRequiredIcon = false;
        const col_Quantity_pattern = new NxDataGridColumnValidationRule();
        col_Quantity_pattern.type = 'pattern';
        col_Quantity_pattern.pattern = RegExps.AllNumber4;
        col_Quantity_pattern.message = this.translator.I18N.PatrolrecordDetail.Quantity.patternMessage;
        col_Quantity.validationRules.push(...[col_Quantity_pattern]);
        col_Quantity.props.setCellValue = (newdata, value, oldData) => {
            var StandardPack = oldData['StandardPack'];
            var bIsStandardPack = oldData['bIsStandardPack'];
            (<Array<any>>this.model.dataGrid.props.dataSource).map(async (m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    var Quantity = 0;

                    if(value){
                        Quantity = Number(value)
                    }
                    m['Quantity'] = Quantity.toFixed(4);
                    if (StandardPack && bIsStandardPack) {
                        m['Packages'] = (Number(m['Quantity'])/StandardPack).toFixed(4);
                    }
                    this.detailInstance.dataGrid.dataGrid.instance.refresh();
                    var Quantity=0;
                    if(m['Quantity']){
                        Quantity = Number(m['Quantity']);
                    }
                    var Packages=0;
                    if(m['Packages']){
                        Packages = Number(m['Packages']);
                    }
                    let pcDate = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                    let start = new Date(pcDate);

                    var ProductID = "0";
                    var ProductBatchID = "0";

                    if(m.ProductID){
                        ProductID = m.ProductID;
                    }
                    if(m.ProductBatchID){
                        ProductBatchID = m.ProductBatchID;
                    }

                    (<Array<any>>this.model.dataGrid.props.dataSource).map((m2) => {
                        if (m2.target != DataStatus.deleted && m2.NumericalOrderDetail != m.NumericalOrderDetail) {

                            var ProductID2 = "0";
                            var ProductBatchID2 = "0";

                            if(m2.ProductID){
                                ProductID2 = m2.ProductID;
                            }
                            if(m2.ProductBatchID){
                                ProductBatchID2 = m2.ProductBatchID;
                            }
                            if(ProductBatchID==ProductBatchID2&&ProductID==ProductID2){
                                let pcDate2 = new DateTime(m2['DataDateDetail']).toString('yyyy-MM-dd');
                                let end= new Date(pcDate2);
                                let diff = new DateTime().diff(start, end);
                                if(diff>=0){
                                    if(m2['Quantity']){
                                        Quantity += Number(m2['Quantity']);
                                    }
                                    if(m2['Packages']){
                                        Packages += Number(m2['Packages']);
                                    }
                                }
                            }
                            
                        }
                    });
                    m['SljcQuantity'] = Number(m['YSljcQuantity'])-Quantity;
                    m['SljcPackages'] = Number(m['YSljcPackages'])-Packages;
                    if(ProductID!="0"){
                        await this.adjustSLData(m.NumericalOrderDetail,m['YSljcQuantity'],m['YSljcPackages'],m['SljcPackages'],m['SljcQuantity'],m['DataDateDetail'],ProductID,ProductBatchID,false);
                    }
                    this.detailInstance.modifyDataStatusSet();
                    this.detailInstance.dataGrid.dataGrid.instance.refresh();
                }
            });
        };

        //饲喂备注
        const col_FeedRemarks = new NxDataGridColumn(this.translator.I18N.PatrolrecordDetail.FeedRemarks.text, 'FeedRemarks');
        col_FeedRemarks.props.width = 120;
        col_FeedRemarks.props.allowHeaderFiltering = false;
        col_FeedRemarks.props.allowFiltering = false;
        col_FeedRemarks.props.filterOperations = ['contains'];

        //巡查备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.PatrolrecordDetail.Remarks.text, 'DetailRemarks');
        col_Remarks.props.width = 120;
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = false;
        col_Remarks.props.filterOperations = ['contains'];

        //日末存栏
        const col_RmQuantity = new NxDataGridColumn('日末存栏', 'QmQuantity');
        col_RmQuantity.props.width = 120;
        col_RmQuantity.props.alignment = 'right';
        col_RmQuantity.props.allowEditing = false;
        col_RmQuantity.props.cssClass = 'disabled';

        //饲料结存件数
        const col_SljcPackage = new NxDataGridColumn('饲料结存件数', 'SljcPackages');
        col_SljcPackage.props.width = 120;
        col_SljcPackage.props.allowEditing = false;
        col_SljcPackage.props.cssClass = 'disabled';
        col_SljcPackage.props.headerHelpEnabled = true;
        col_SljcPackage.props.headerHelpMessage = '结存=该养户批次该养殖场栋的（养户领料单-饲喂记录）';

        //饲料结存数量
        const col_SljcQuantity = new NxDataGridColumn('饲料结存数量', 'SljcQuantity');
        col_SljcQuantity.props.width = 120;
        col_SljcQuantity.props.allowEditing = false;
        col_SljcQuantity.props.cssClass = 'disabled';
        col_SljcQuantity.props.headerHelpEnabled = true;
        col_SljcQuantity.props.headerHelpMessage = '结存=该养户批次该养殖场栋的（养户领料单-饲喂记录）';

        // 死淘记录单号
        const col_NumericalOrderExtend = new NxDataGridColumn(
            '死淘记录单号',
            'DeathCullNumber',
            'string'
        );
        col_NumericalOrderExtend.props.visible = true;
        col_NumericalOrderExtend.props.allowEditing = false;
        col_NumericalOrderExtend.props.width=130;
        col_NumericalOrderExtend.props.cssClass = 'disabled';

        // 饲喂记录单号
        const col_NumericalOrderExtend2 = new NxDataGridColumn(
            '饲喂记录单号',
            'FeedingNumber',
            'string'
        );
        col_NumericalOrderExtend2.props.visible = true;
        col_NumericalOrderExtend2.props.allowEditing = false;
        col_NumericalOrderExtend2.props.width=130;
        col_NumericalOrderExtend2.props.cssClass = 'disabled';

        return [
            col_dataDate,
            col_DaysOld,
            col_DeathQuantity,
            col_CullQuantity,
            col_DeathCullRemarks,
            col_ProductID,
            col_Specification,
            col_bIsStandardPack,
            col_StandardPack,
            col_ProductBatchID,
            col_Packages,
            col_Quantity,
            col_MeasureUnitName,
            col_FeedRemarks,
            col_Remarks,
            col_RmQuantity,
            col_SljcPackage,
            col_SljcQuantity,
            col_NumericalOrderExtend,
            col_NumericalOrderExtend2
        ];
    }

    async GetgetFeed(DataDate,ProductID,ProductBatchID) {
        if (DataDate && ProductID) {
            this.loading = true;
            let row = {}
            let obj = {
                DataDate: new DateTime(DataDate).toString('yyyy-MM-dd'),
                YHBatch: this.model.conditionPanel.data['YHBatch'] || '0',
                HenhouseID: this.model.conditionPanel.data['HenhouseID'] || '0',
                NumericalOrder: this.numericalOrder || '0',
                ProductID: ProductID,
                ProductBatchID: ProductBatchID || '0',
                Type: 0
            }
            return this.service.getFeed(obj).then((res:any) => {
                this.loading = false;
                return row = res.length > 0 ? res[0] : {};
            })
        }
    }

    onFieldDataChanged(e) {
        switch (e.dataField) {
            case 'StartDate' :
                this.EndDateEditorOptions = { width: '100%',placeholder:'请选择结束日期', min: new Date(e.value), max: new Date() };
                this.formData.ProductID = '';
                this.formData.ProductBatchID = '';
                this.getPatrolRecordProduct();
                break;
            case 'EndDate' :
                let max = new Date();
                if (e.value) {
                    max = new Date(e.value);
                }
                this.StartDateEditorOptions = { width: '100%',placeholder:'请选择开始日期', min: null, max: max };
                this.formData.ProductID = '';
                this.formData.ProductBatchID = '';
                this.getPatrolRecordProduct();
                break;
            case 'ProductID' :
                var ProductID = e.value;
                var dataSource = [];
                if (ProductID) {
                    dataSource = this.allProductBatchSource.filter((o) => o.ProductID == ProductID);
                }
                this.ProductBatchSource = Distinct(dataSource, 'ProductBatchID');

                break;
            default:
                break;
        }
    }

    onEditorPreparingFn(e) {
        if (e.parentType == 'dataRow') {
            const defaultValueChangeEvent = e.editorOptions.onValueChanged;
            const rowData = e.row.data;
            let triggerValueChanged = true;
            if (triggerValueChanged) {
                //没有这个，编辑datagrid不会激活保存按钮
                e.editorOptions.onValueChanged = (args) => {
                    this.detailInstance.modifyDataStatusSet();
                    setTimeout(() => {
                        // 将选中的文本值赋值到数据源上,_changedValue是下拉数据中对应的文本值
                        e.setValue(args.value, args.component._changedValue);
                        this.detailInstance.dataGrid.refresh();

                    }, 0);
                    defaultValueChangeEvent(args);
                };
            }
            switch (e.dataField) {
                case 'ProductBatchID' :
                    var ProductID = e.row.data['ProductID'];
                    var dataSource = [];
                    if (ProductID) {
                        dataSource = this.allProductBatchSource.filter((o) => o.ProductID == ProductID);
                    }
                    e.editorOptions.dataSource = Distinct(dataSource, 'ProductBatchID');
                    e.editorOptions.onValueChanged = async (args) => {
                        const selected = args.component.option('selectedItem');
                        var ProductBatchID = null;
                        var ProductBatchName = "";
                        if(selected){
                            ProductBatchName = selected.ProductBatchName;
                            ProductBatchID = selected.ProductBatchID;
                        }
                        rowData['ProductBatchID'] = ProductBatchID;
                        rowData['ProductBatchName'] = ProductBatchName;
                        this.detailInstance.modifyDataStatusSet();
                        this.detailInstance.dataGrid.dataGrid.instance.refresh();
                        
                        if(rowData.DataDateDetail){
                            if(rowData['ProductID']!="0"){
                                let DataDateDetail = new DateTime(rowData.DataDateDetail).toString('yyyy-MM-dd');
                                await this.getGetSLStock(DataDateDetail,rowData['ProductID'],ProductBatchID)
                            }
                        }
                        rowData['YSljcQuantity'] = this.addFormData.YSljcQuantity;
                        rowData['YSljcPackages'] = this.addFormData.YSljcPackages;
                        rowData['SljcPackages'] = this.addFormData.SljcPackages;
                        rowData['SljcQuantity'] = this.addFormData.SljcQuantity;
                        if(rowData['ProductID']&&rowData['ProductID']!="0"){
                            let ProductID = rowData['ProductID']||0;
                            let ProductBatchID = rowData['ProductBatchID']||0;
                           await this.adjustSLData(rowData.NumericalOrderDetail,rowData['YSljcQuantity'],rowData['YSljcPackages'],rowData['SljcPackages'],rowData['SljcQuantity'],rowData['DataDateDetail'],ProductID,ProductBatchID,true);
                        }
                        this.detailInstance.dataGrid.dataGrid.instance.refresh();
                        this.setReadOnly();
                    }
                    break;
                case 'DataDateDetail' :
                    e.editorOptions.onValueChanged = async (args) => {
                        if(args.value){
                            rowData['DataDateDetail'] = new DateTime(args.value).toString('yyyy-MM-dd');
                            await this.getGetStock(rowData['DataDateDetail']);
                            rowData['QmQuantity'] = this.addFormData.QmQuantity;
                            rowData['YQmQuantity'] = this.addFormData.YQmQuantity;
                            if(this.pcDate&&this.DaysOld){
                                let pcDate = new DateTime(this.pcDate).toString('yyyy-MM-dd');
                                let DataDate = rowData['DataDateDetail'];
                                let start = new Date(DataDate);
                                let end= new Date(pcDate);
                                let diff = new DateTime().diff(start, end);
                                rowData['DaysOld'] = Number(diff)+Number(this.DaysOld) + "";
                            }
                            this.addFormData.YSljcQuantity = 0;
                            this.addFormData.YSljcPackages = 0;
                            this.addFormData.SljcPackages = 0;
                            this.addFormData.SljcQuantity = 0; 
                            if(rowData['ProductID']&&rowData['ProductID']!="0"){
                                await this.getGetSLStock(rowData['DataDateDetail'],rowData['ProductID'],rowData['ProductBatchID'])
                            }
                            rowData['YSljcQuantity'] = this.addFormData.YSljcQuantity;
                            rowData['YSljcPackages'] = this.addFormData.YSljcPackages;
                            rowData['SljcPackages'] = this.addFormData.SljcPackages;
                            rowData['SljcQuantity'] = this.addFormData.SljcQuantity;
                        }
                        await this.adjustData(rowData.NumericalOrderDetail,rowData['QmQuantity'],rowData['YQmQuantity'],rowData['DataDateDetail']);
                        if(rowData['ProductID']&&rowData['ProductID']!="0"){
                            let ProductID = rowData['ProductID']||0;
                            let ProductBatchID = rowData['ProductBatchID']||0;
                            await this.adjustSLData(rowData.NumericalOrderDetail,rowData['YSljcQuantity'],rowData['YSljcPackages'],rowData['SljcPackages'],rowData['SljcQuantity'],rowData['DataDateDetail'],ProductID,ProductBatchID,false);
                        }
                        this.detailInstance.modifyDataStatusSet();
                        this.detailInstance.dataGrid.dataGrid.instance.refresh();
                        this.setReadOnly();
                    }
                    break;
                case 'DeathQuantity' :
                    e.editorOptions.onValueChanged = async (args) => {
                        if(args.value){
                            rowData['DeathQuantity'] = Number(args.value).toFixed(0);
                        }
                        var DeathQuantity=0;
                        if(rowData['DeathQuantity']){
                            DeathQuantity = Number(rowData['DeathQuantity']);
                        }
                        var CullQuantity=0;
                        if(rowData['CullQuantity']){
                            CullQuantity = Number(rowData['CullQuantity']);
                        }
                        let pcDate = new DateTime(rowData['DataDateDetail']).toString('yyyy-MM-dd');
                        let start = new Date(pcDate);
                        (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                            if (m.target != DataStatus.deleted && m.NumericalOrderDetail != rowData.NumericalOrderDetail) {
                                let pcDate2 = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                                let end= new Date(pcDate2);
                                let diff = new DateTime().diff(start, end);
                                if(diff>=0){
                                    if(m['DeathQuantity']){
                                        DeathQuantity += Number(m['DeathQuantity']);
                                    }
                                    if(m['CullQuantity']){
                                        CullQuantity += Number(m['CullQuantity']);
                                    }
                                }
                            }
                        });
                        rowData['QmQuantity'] = Number(rowData['YQmQuantity'])-DeathQuantity-CullQuantity;
                        await this.adjustData(rowData.NumericalOrderDetail,rowData['QmQuantity'],rowData['YQmQuantity'],rowData['DataDateDetail']);
                        this.detailInstance.modifyDataStatusSet();
                        this.detailInstance.dataGrid.dataGrid.instance.refresh();
                    }
                    break;
                case 'CullQuantity' :
                    e.editorOptions.onValueChanged = async (args) => {
                        if(args.value){
                            rowData['CullQuantity'] = Number(args.value).toFixed(0);
                        }
                        var DeathQuantity=0;
                        if(rowData['DeathQuantity']){
                            DeathQuantity = Number(rowData['DeathQuantity']);
                        }
                        var CullQuantity=0;
                        if(rowData['CullQuantity']){
                            CullQuantity = Number(rowData['CullQuantity']);
                        }
                        let pcDate = new DateTime(rowData['DataDateDetail']).toString('yyyy-MM-dd');
                        let start = new Date(pcDate);
                        (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                            if (m.target != DataStatus.deleted && m.NumericalOrderDetail != rowData.NumericalOrderDetail) {
                                let pcDate2 = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                                let end= new Date(pcDate2);
                                let diff = new DateTime().diff(start, end);
                                if(diff>=0){
                                    if(m['DeathQuantity']){
                                        DeathQuantity += Number(m['DeathQuantity']);
                                    }
                                    if(m['CullQuantity']){
                                        CullQuantity += Number(m['CullQuantity']);
                                    }
                                }
                            }
                        });
                        rowData['QmQuantity'] = Number(rowData['YQmQuantity'])-DeathQuantity-CullQuantity;
                        await this.adjustData(rowData.NumericalOrderDetail,rowData['QmQuantity'],rowData['YQmQuantity'],rowData['DataDateDetail']);
                        this.detailInstance.modifyDataStatusSet();
                        this.detailInstance.dataGrid.dataGrid.instance.refresh();
                    }
                    break;
                default:
                    break;
            }
        }
    }

    adjustSLData(NumericalOrderDetail,YSljcQuantity,YSljcPackages,SljcPackages,SljcQuantity,DataDate,ProductID,ProductBatchID,flag){
        this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
        var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
        let pcDate = new DateTime(DataDate).toString('yyyy-MM-dd');
        let start = new Date(pcDate);
        oldData.forEach((m, i) => {
            if(m.target != DataStatus.deleted && m.NumericalOrderDetail!=NumericalOrderDetail && m['DataDateDetail']){

                var ProductID2 = "0";
                var ProductBatchID2 = "0";

                if(m.ProductID){
                    ProductID2 = m.ProductID;
                }
                if(m.ProductBatchID){
                    ProductBatchID2 = m.ProductBatchID;
                }
                let pcDate2 = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                let end= new Date(pcDate2);
                if(ProductID == ProductID2 && ProductBatchID == ProductBatchID2){
                    let diff = new DateTime().diff(start, end);
                    if(diff==0){ //时间相等
                       m.YSljcQuantity = YSljcQuantity;
                       m.YSljcPackages = YSljcPackages;
                       m.SljcPackages = SljcPackages;
                       m.SljcQuantity = SljcQuantity;
                    }
                    if(diff<0){//大于修改时间
                        var YSljcQuantity2 = 0;
                        if(m.YSljcQuantity){
                            YSljcQuantity2 = Number(m.YSljcQuantity);
                        }
                        var YSljcPackages2 = 0;
                        if(m.YSljcPackages){
                            YSljcPackages2 = Number(m.YSljcPackages);
                        }
                        oldData.map((m2) => {
                            if(m2.target != DataStatus.deleted && m2['DataDateDetail']){

                                var ProductID3 = "0";
                                var ProductBatchID3 = "0";

                                if(m2.ProductID){
                                    ProductID3 = m2.ProductID;
                                }
                                if(m2.ProductBatchID){
                                    ProductBatchID3 = m2.ProductBatchID;
                                }
                                if(ProductID == ProductID3 && ProductBatchID == ProductBatchID3){
                                    let pcDate3 = new DateTime(m2['DataDateDetail']).toString('yyyy-MM-dd');
                                    let end3= new Date(pcDate3);
                                    let diff3 = new DateTime().diff(end, end3);
                                    if(diff3>=0){
                                        var Quantity=0;
                                        if(m2.Quantity){
                                            Quantity = Number(m2.Quantity);
                                        }
                                        var Packages=0;
                                        if(m2.Packages){
                                            Packages = Number(m2.Packages);
                                        }
                                        YSljcPackages2-=Packages;
                                        YSljcQuantity2-=Quantity;
                                    }
                                }
                            }
                        });
                        m.SljcQuantity = YSljcQuantity2;
                        m.SljcPackages = YSljcPackages2;
                    }
                }
                else{
                    if(flag){ //改变商品代号或批号重新算其他商品的结存数量
                        var YSljcQuantity2 = 0;
                        if(m.YSljcQuantity){
                            YSljcQuantity2 = Number(m.YSljcQuantity);
                        }
                        var YSljcPackages2 = 0;
                        if(m.YSljcPackages){
                            YSljcPackages2 = Number(m.YSljcPackages);
                        }
                        oldData.map((m2) => {
                            if(m2.target != DataStatus.deleted && m2['DataDateDetail']){

                                var ProductID3 = "0";
                                var ProductBatchID3 = "0";

                                if(m2.ProductID){
                                    ProductID3 = m2.ProductID;
                                }
                                if(m2.ProductBatchID){
                                    ProductBatchID3 = m2.ProductBatchID;
                                }
                                if(ProductID2 == ProductID3 && ProductBatchID2 == ProductBatchID3){
                                    let pcDate3 = new DateTime(m2['DataDateDetail']).toString('yyyy-MM-dd');
                                    let end3= new Date(pcDate3);
                                    let diff3 = new DateTime().diff(end, end3);
                                    if(diff3>=0){
                                        var Quantity=0;
                                        if(m2.Quantity){
                                            Quantity = Number(m2.Quantity);
                                        }
                                        var Packages=0;
                                        if(m2.Packages){
                                            Packages = Number(m2.Packages);
                                        }
                                        YSljcPackages2-=Packages;
                                        YSljcQuantity2-=Quantity;
                                    }
                                }
                            }
                        });
                        m.SljcQuantity = YSljcQuantity2;
                        m.SljcPackages = YSljcPackages2;

                    }
                }
            }
        });
    }

    adjustData(NumericalOrderDetail,QmQuantity,YQmQuantity,DataDate){
        this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
        var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
        let pcDate = new DateTime(DataDate).toString('yyyy-MM-dd');
        let start = new Date(pcDate);
        oldData.forEach((m, i) => {
            if(m.target != DataStatus.deleted && m.NumericalOrderDetail!=NumericalOrderDetail && m['DataDateDetail']){
                let pcDate2 = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                let end= new Date(pcDate2);
                let diff = new DateTime().diff(start, end);
                if(diff==0){ //时间相等
                   m.QmQuantity = QmQuantity;
                   m.YQmQuantity = YQmQuantity;
                }
                if(diff<0){//大于修改时间
                    var YQmQuantity2 = 0;
                    if(m.YQmQuantity){
                        YQmQuantity2 = Number(m.YQmQuantity);
                    }
                    oldData.map((m2) => {
                        if(m2.target != DataStatus.deleted && m2['DataDateDetail']){
                            let pcDate3 = new DateTime(m2['DataDateDetail']).toString('yyyy-MM-dd');
                            let end3= new Date(pcDate3);
                            let diff3 = new DateTime().diff(end, end3);
                            if(diff3>=0){
                                var DeathQuantity=0;
                                if(m2.DeathQuantity){
                                    DeathQuantity = Number(m2.DeathQuantity);
                                }
                                var CullQuantity=0;
                                if(m2.CullQuantity){
                                    CullQuantity = Number(m2.CullQuantity);
                                }
                                YQmQuantity2-=(CullQuantity+DeathQuantity);
                            }
                        }
                    });
                    m.QmQuantity = YQmQuantity2;
                }
            }
        });
    }

    onSearch() {
        let UrlParam = 'BillType=2201131629250001455&iSortPlus='+DataDictionary.iSortF+'&';

        UrlParam += 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd') + '&WarehouseID=' + this.model.conditionPanel.data.OutWarehouse + '&';
        if (this.numericalOrder) {
            UrlParam += 'NumericalOrder=' + this.numericalOrder + '&';
        }
        if (this.formData.ProductID) {
            UrlParam += 'ProductID=' + this.formData.ProductID + '&';
        }
        UrlParam += 'groupBy=md.ProductID,mt.BatchID&';
        this.loading = true;
        this.service.getQLWWarehouseStock(UrlParam).then( (res:any) => {
            this.AutoDataSourceFilter = [];
            this.loading = false;
            var selectedRowsData11 = res.value;
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            if (oldData && oldData.length > 0) {
                selectedRowsData11.forEach((f) => {
                    oldData.forEach((row) => {
                        if (f.HenhouseID == row.HenhouseID && f.BatchID == row.BatchID && f.SexType==row.SexType) {
                            var Quantity = Number(f.cQuantity);
                            var cQuantity = 0;
                            if (row.Quantity) {
                                cQuantity = Number(row.Quantity);
                                f.cQuantity = Quantity - Number(row.Quantity);
                            }
                            f.cQuantity = Quantity - cQuantity;
                        }
                    });
                });
            }
            var data = [];
            selectedRowsData11.forEach((f) => {
                if (f.cQuantity && Number(f.cQuantity) > 0) {
                    f.DetailID = new DateTime().randomValue.toString();
                    data.push(f);
                }
            });
            this.AutoDataSource = data;
            this.AutoDataSourceFilter = data;

        })
    }

    reset() {
        this.AutoDataSourceFilter = deepCopy(this.AutoDataSource);
    }

    async getSelection(type) {
        if (type == '3') {
            this.outVisible = false;
            this.formData = {};
            return false;
        }

        if (!this.formData.StartDate || !this.formData.EndDate) {
            Notify.toast('开始日期、结束日期必填！', NotifyType.Error);
            return
        }

        if (this.formData.StartDate > this.formData.EndDate) {
            Notify.toast('开始日期不得大于结束日期！', NotifyType.Error);
            return
        }

        this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
        let YHBatch = this.model.conditionPanel.data['YHBatch'];
        let NumericalOrder = this.numericalOrder || '0';
        let HenhouseID = this.model.conditionPanel.data['HenhouseID'] || '0';
        await this.service.getStock(new DateTime(this.formData.StartDate).toString('yyyy-MM-dd'),YHBatch,NumericalOrder,new DateTime(this.formData.EndDate).toString('yyyy-MM-dd'),HenhouseID).then(async (res:any) => {
            var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
            let arry = [];
            (<Array<any>>oldData).forEach((data) => {
                let isAllEmpty = true;
                let props = Object.keys(data).filter(
                    (x) => x != this.model.dataGrid.primaryKey && x != 'target'
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
            var productInfos=[];
            if (this.formData.ProductID && this.formData.ProductID != '0') {
                this.loading = true;
                let param2 = {
                    DataDate: new DateTime(this.formData.StartDate).toString('yyyy-MM-dd'),
                    YHBatch: YHBatch,
                    HenhouseID: this.model.conditionPanel.data['HenhouseID'] || '0',
                    EndDate: new DateTime(this.formData.EndDate).toString('yyyy-MM-dd'),
                    ProductID: this.formData.ProductID||"0",
                    ProductBatchID: this.formData.ProductBatchID||"0",
                    Type: 0,
                    NumericalOrder : NumericalOrder
                }
                await this.service.getFeed(param2).then((res2:any) => {
                    this.loading = false;
                    productInfos = res2;
                })
            }
            if(res.length>0){
                var index=0;
                res.forEach((f) => {
                    index++;
                    var row = deepCopy(f);
                    row['DataDateDetail'] = new DateTime(row['DataDate']).toString('yyyy-MM-dd');
                    if(this.pcDate&&this.DaysOld){
                        let pcDate = new DateTime(this.pcDate).toString('yyyy-MM-dd');
                        let DataDate = new DateTime(row['DataDate']).toString('yyyy-MM-dd');
                        let start = new Date(DataDate);
                        let end= new Date(pcDate);
                        let diff = new DateTime().diff(start, end);
                        row['DaysOld'] = Number(diff)+Number(this.DaysOld) + "";
                    }
                    row[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                    row.target = DataStatus.newline;
                    row.YQmQuantity=row.QmQuantity;
                    // row.NumericalOrderDetail = new DateTime().randomValue.toString();
                    row['NumericalOrderDetail'] = new DateTime().randomValue + index;
                    var QmQuantity=row.YQmQuantity;
                    let pcDate2 = new DateTime(row['DataDateDetail']).toString('yyyy-MM-dd');
                    let start2 = new Date(pcDate2);

                    row.YSljcQuantity=0;
                    row.YSljcPackages=0;
                    var SljcQuantity=0;
                    var SljcPackages=0;
                    productInfos.forEach((m) => {
                        var d = new DateTime(m['DataDate']).toString('yyyy-MM-dd');
                        if(pcDate2 == d){
                            row.YSljcQuantity=Number(m.YSljcQuantity);
                            row.YSljcPackages=Number(m.YSljcPackages);
                            SljcQuantity=Number(m.YSljcQuantity);
                            SljcPackages=Number(m.YSljcPackages);
                        }
                    })

                    var ProductBatchID="0";
                    var ProductID="0";
                    if (this.formData.ProductBatchID&&this.formData.ProductBatchID!="0") {
                        ProductBatchID = this.formData.ProductBatchID;
                        let produce = this.ProductBatchSource.filter(o => o.ProductBatchID == this.formData.ProductBatchID);
                        row['ProductBatchName'] = produce.length > 0 ? produce[0].ProductBatchName : '';
                        row['ProductBatchID'] = this.formData.ProductBatchID;
                    }

                    if (this.formData.ProductID && this.formData.ProductID != '0') {
                        ProductID = this.formData.ProductID;
                        let result = this.cPatrolRecordData.filter(m => m.ProductID == this.formData.ProductID);
                        row['ProductID'] = this.formData.ProductID;
                        row['ProductName'] = result[0].ProductName;
                        row['Specification'] = result[0].Specification;
                        row['StandardPack'] = result[0].StandardPack;
                        row['bIsStandardPack'] = result[0].bIsStandardPack;
                        row['MeasureUnitName'] = result[0].MeasureUnitName;
                    }
                    oldData.map((m) => {
                        if(m.target != DataStatus.deleted && m['DataDateDetail']){
                            let pcDate3 = new DateTime(m['DataDateDetail']).toString('yyyy-MM-dd');
                            let end2= new Date(pcDate3);
                            let diff2 = new DateTime().diff(start2, end2);
                            if(diff2>=0){
                                var DeathQuantity=0;
                                if(m.DeathQuantity){
                                    DeathQuantity = Number(m.DeathQuantity);
                                }
                                var CullQuantity=0;
                                if(m.CullQuantity){
                                    CullQuantity = Number(m.CullQuantity);
                                }
                                QmQuantity-=(CullQuantity+DeathQuantity);

                                var ProductBatchID2="0";
                                var ProductID2="0";
                                if (m.ProductBatchID) {
                                    ProductBatchID2 = m.ProductBatchID;
                                }

                                if (m.ProductID) {
                                    ProductID2 = m.ProductID;
                                }

                                if(ProductBatchID2==ProductBatchID && ProductID==ProductID2){
                                    var Quantity=0;
                                    if(m.Quantity){
                                        Quantity = Number(m.Quantity);
                                    }
                                    var Packages=0;
                                    if(m.Packages){
                                        Packages = Number(m.Packages);
                                    }
                                    SljcPackages-=Packages;
                                    SljcQuantity-=Quantity;
                                }

                            }
                        }
                    });
                    row.QmQuantity=QmQuantity;
                    row.SljcPackages=SljcPackages;
                    row.SljcQuantity=SljcQuantity;
                    arry.push(row);
                });
            }

            this.model.dataGrid.props.dataSource = arry;
            this.detailInstance.dataGrid.dataGrid.instance.refresh();
            this.detailInstance.dataGrid.refresh();
            this.detailInstance.modifyDataStatusSet();
            this.setReadOnly();
            if (type == '2') {
                this.formData = {};
                // this.clickAuto();
            }
            if (type == '1') {
                this.formData = {};
                this.outVisible = false;
            }
        })
    }

    onPopupHiding() {
        // this.outVisible = false;
        // this.AutoDataSourceFilter = [];
        // this.AutoDataSource = [];
    }

    handleCell(e) {
        // console.log(e)
    }
    //#endregion
    //#region 初始化工具条
    init_toolbar_panel(): PatrolrecordDetailComponent {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;
        const add_type = new ToolbarPanelType();
        add_type.key = 'addHang';
        add_type.widget = new NxButton('批量增行');
        add_type.widget.events.onClick = this.addHang.bind(this);

        const jc_Add_type = new ToolbarPanelType();
        jc_Add_type.key = 'addHang';
        jc_Add_type.widget = new NxButton('按结存饲料增行');
        jc_Add_type.widget.events.onClick = this.jcAddHang.bind(this);

        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).props.visible = false;
        this.model.toolbar.mainPanel.push(...[add_type,jc_Add_type]);
        this.model.toolbar.getOtherWidgetByKey('headSetting').props.visible = true;
        return this;
    }
    // 批量增行
    addHang () {
        if (!this.model.conditionPanel.data['YHBatch']) {
            return Notify.toast('请选择养户批次！', NotifyType.Error);
        }
        if (this.isManageToHenhouse && !this.model.conditionPanel.data['HenhouseID']) {
            return Notify.toast('请选择栋舍！', NotifyType.Error);
        }
        this.formData = {
            StartDate: new Date(new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toLocaleDateString()),
            EndDate: new Date(new Date(new Date().getTime()).toLocaleDateString())
        }
        this.outVisible = true;
        this.getPatrolRecordProduct();
        

    }
    jcAddHang() {
        if (!this.model.conditionPanel.data['YHBatch']) {
            return Notify.toast('请选择养户批次！', NotifyType.Error);
        }
        if (this.isManageToHenhouse && !this.model.conditionPanel.data['HenhouseID']) {
            return Notify.toast('栋舍不能为空！', NotifyType.Error);
        }
        this.jcAddVisible = true;
        
        let dateTime = new Date(this.model.conditionPanel.data['DataDate']);
        let DataDate = dateTime.setDate(dateTime.getDate()-1);
        this.addFormData.DataDate = new Date(DataDate);
        this.jcAddDataSource = [];
        this.getGetStock(new DateTime(this.addFormData.DataDate).toString('yyyy-MM-dd'));
        this.onQuery();
    }
    create() {
        this.model.conditionPanel.data = {};
        this.detailInstance.cacheSearchData = {};
        this.model.conditionPanel.data['DataDate'] = new Date();
        this.model.conditionPanel.data['isbegin'] = false;
        this.model.conditionPanel.data['YHBatch'] = null;
        this.model.conditionPanel.data['YHFarmerID'] = null;
        this.model.conditionPanel.data['ReceiveType'] = DataDictionary.ReceiveTypeA;
        this.fileList = [];
        // this.detailInstance.cacheSearchData['ChickenSource'] = DataDictionary.ChickenSourceB; //赋值ID
        // this.model.conditionPanel.data['FreightFor'] = '201612090104402201';
        // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "SupplierID")[0].required = true;
        this.model.conditionPanel.data.NumericalOrder = '';
        this.numericalOrder = '';
        this.model.conditionPanel.data.Number = '';
        this.model.conditionPanel.data.Remarks = '';
        this.model.dataGrid.type = 'detail';
        this.detailInstance.$open = FormOptions.$create;
        this.model.review.visible = false;
        this.getWarehouse(USER_INFO_CONTEXT.childId);
        this.detailInstance.cacheBodyData = deepCopy(this.model.dataGrid.props.dataSource);
        this.detailInstance.cacheSearchData = deepCopy(this.model.conditionPanel.data);

        setTimeout(() => {
            this.detailInstance.createDataStatus(undefined,4);
            this.setReadOnly();
        }, 20);
    }
    save() {

        if (this.isManageToHenhouse && !this.model.conditionPanel.data['HenhouseID']) {
            return Notify.toast('栋舍不能为空！', NotifyType.Error);
        }
        // var oldData = <Array<any>>this.model.dataGrid.props.dataSource;
        // if (this.model.conditionPanel.data['ReceiveType'] == DataDictionary.ReceiveTypeB) {
        //     for (let i = 0; i < oldData.length; i++) {
        //         const element = oldData[i];
        //         if (element.Quantity > 0) {
        //             return Notify.toast('退回的数量必须需为负数!', NotifyType.Error);
        //         }
        //     }
        // }

        this.detailInstance.saveChanges().then((value) => {

            this.detailInstance.openCheck(
                () => {
                    const data = this.getSaveData(value);
                    if (data) {
                        this.service.create(data).then((result: Result) => {
                            const response = ResponseSuccess.handle(result);
                            if (response.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                this.model.conditionPanel.data['NumericalOrder'] = result.data.NumericalOrder;
                                this.numericalOrder = result.data.NumericalOrder;
                                //开启审核功能
                                this.model.review.visible = true;
                                this.model.review.numericalOrder = this.numericalOrder;
                                this.model.dataGrid.type = 'detail';
                                this.detailInstance.$open = FormOptions.$modify;
                                this.queryDetail();
                            } else {
                                // Notify.toast(response.message, NotifyType.Error);
                                this.detailInstance.messageBox.show(response.message);
                                this.detailInstance.saveDataError();
                            }
                        });
                    }
                },
                () => {
                    if (this.detailInstance.reviewValidation()) {
                        this.service.update(this.getSaveData(value)).then((result: Result) => {
                            const res = ResponseSuccess.handle(result);
                            if (res.status) {
                                Notify.toast(this.translator.I18N.commandOptions.save.success, NotifyType.Success);
                                // this.detailInstance.saveDataAfterStatus();
                                this.queryDetail();
                            } else {
                                // Notify.toast(res.message, NotifyType.Error);
                                this.detailInstance.messageBox.show(res.message);
                                this.detailInstance.saveDataError();
                            }
                        });
                    }
                }
            );
        });
    }
    delete() {
        MessageBox.confirm(
            this.translator.I18N.commandOptions.delete.confirm,
            this.translator.I18N.commandOptions.delete.confirmTitle
        ).then((require) => {
            if (require) {
                this.detailInstance.dataGrid.dataGrid.instance;
                this.service.deleteByKey(this.model.conditionPanel.data.NumericalOrder).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        Notify.toast(this.translator.I18N.commandOptions.delete.success, NotifyType.Success);
                        this.detailInstance.deletedStatus();
                    } else {
                        // Notify.toast(response.message, NotifyType.Error);
                        this.detailInstance.messageBox.show(response.message);
                        this.detailInstance.saveDataError();
                    }
                });
            }
        });
    }
    cancel() {
        if (this.detailInstance.$open == FormOptions.$create) {
            this.create();
        } else {
            this.queryDetail();
        }
        // this.detailInstance.resetDataStatus();
    }
    private dataValidation(data): boolean {
        const validator = new DataValidator();
        validator.forObjRequire(data, [
            ['DataDateDetail', this.translator.I18N.PatrolrecordDetail.DataDate.required],
        ]);
        return validator.validation;
    }
    private getSaveData(value) {
        const validation = this.dataValidation(value.body);
        if (validation) {
            let saveData = new PatrolrecordAdd();
            const date = new DateTime(value.header.DataDate.toString()).toString('yyyy-MM-dd');
            saveData.DataDate = date;
            saveData.Number = 0;
            saveData.NumericalOrder = value.header.NumericalOrder || '0';
            saveData.ChickenFarmID = value.header.ChickenFarmID || '0';
            saveData.YHFarmerID = value.header.YHFarmerID || '0';
            saveData.PersonID = value.header.PersonID || '0';
            saveData.YHBatch = value.header.YHBatch || '0';
            saveData.Remarks = value.header.Remarks || '';
            saveData.FeedWarehouseID = value.header.FeedWarehouseID || '0';
            saveData.WarehouseID = value.header.WarehouseID || '0';
            saveData.BreedingID = value.header.BreedingID || '0';
            saveData.HenhouseID = value.header.HenhouseID || '0';
            saveData.ComboPack = value.header.ComboPack || DataDictionary.ComboPackA;
            saveData.isbegin = value.header.isbegin || false;
            saveData.Files = this.fileList;
            value.body.map((m) => {
                saveData.YhPatrolRecordDetailDto.push({
                    NumericalOrder: m.NumericalOrder || '0',
                    NumericalOrderDetail: m.NumericalOrderDetail || '0',
                    DataDateDetail: new DateTime(m.DataDateDetail.toString()).toString('yyyy-MM-dd'),
                    DeathQuantity: m.DeathQuantity || 0,
                    DaysOld: m.DaysOld,
                    ProductID: m.ProductID || '0',
                    ProductBatchID: m.ProductBatchID || '0',
                    ProductBatchName: m.ProductBatchName || '',
                    Packages: m.Packages || 0,
                    MeasureUnitName: m.MeasureUnitName || '0',
                    CullQuantity: m.CullQuantity || 0,
                    DeathCullRemarks: m.DeathCullRemarks || '',
                    Quantity: m.Quantity || 0,
                    FeedRemarks: m.FeedRemarks || '',
                    BreedingID: m.BreedingID || '0',
                    Target: m.target,
                    Remarks: m.DetailRemarks || '',
                    NumericalOrderExtend: m.NumericalOrderExtend || '0',
                    NumericalOrderExtend2: m.NumericalOrderExtend2 || '0'
                });
            });
            if (this.detailInstance.$open == FormOptions.$modify) {
                saveData.YhPatrolRecordDetailDto.push(...value.deleted);
            }
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }
    //#endregion

    //#region  表头配置
    init_table_header(): PatrolrecordDetailComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        const condition_ChickenFarmID = new NxConditionItem();
        condition_ChickenFarmID.required = false;
        condition_ChickenFarmID.requiredDisable = false;
        condition_ChickenFarmID.headVisible = true;
        condition_ChickenFarmID.label = this.translator.I18N.Patrolrecord.ChickenFarmID.text;
        condition_ChickenFarmID.dataField = 'ChickenFarmID';
        condition_ChickenFarmID.type = 'SelectBox';
        condition_ChickenFarmID.widget = new NxSelectBox();
        condition_ChickenFarmID.widget.props.readOnly = true;
        condition_ChickenFarmID.widget.props.dataSource = this.basicSettingODataContext.getBizChickenFarmDataSource({
            filter: CHICKEN_FARM_CONTEXT.ChickenFarmFilterCondition,
            select: ['ChickenFarmID', 'ChickenFarmName'],
        });
        condition_ChickenFarmID.widget.props.valueExpr = 'ChickenFarmID';
        condition_ChickenFarmID.widget.props.displayExpr = 'ChickenFarmName';

        //日期
        const condition_date = new NxConditionItem();
        condition_date.required = false;
        condition_date.label = this.translator.I18N.Patrolrecord.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.requiredDisable = false;
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.readOnly = false;
        condition_date.widget.events.onValueChanged = this.updateDaysOld.bind(this);
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        condition_date.widget.props.max = new Date();

        // 养户名称
        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.Patrolrecord.YHFarmerID.text;
        condition_YHFarmerID.required = true;
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.requiredDisable = true;
        condition_YHFarmerID.widget = new NxSelectBox();
        condition_YHFarmerID.widget.props.showClearButton = true;
        condition_YHFarmerID.widget.props.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource({
            filter: [
                [ 'Status', '=', true ]
            ]
        })
        condition_YHFarmerID.widget.events.onValueChanged = this.onChickenFarmChange.bind(this);
        condition_YHFarmerID.widget.props.valueExpr = 'YHFarmerID';
        condition_YHFarmerID.widget.props.displayExpr = 'YHFarmerName';
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerID','YHFarmerName','Phone','YHPersonName','MnemonicCode']
        // condition_YHFarmerID.widget.events.onValueChanged = (value) => {}

        //养户批次
        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.Patrolrecord.YHBatch.text;
        condition_YHBatch.required = true;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.requiredDisable = true;
        condition_YHBatch.widget = new NxSelectBox();
        condition_YHBatch.widget.props.showClearButton = false;
        condition_YHBatch.widget.props.dataSource = this.YHBasicSettingODataContext.getYHBatchDataSource();
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';
        condition_YHBatch.widget.props.searchExpr = ['YHBatchName','MnemonicCode'];
        condition_YHBatch.widget.props.readOnly = true;
        condition_YHBatch.widget.props.placeholder = '请先选养户';
        condition_YHBatch.widget.events.onOpened = e => {
            let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            if(YHFarmerID&&YHFarmerID!="0"){
                let filter = [['TransferDate', '<=', new Date(new Date(new Date(DataDate).getTime()).toLocaleDateString())],['Status', '=', true],['YHFarmerID','=',YHFarmerID]];
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName'],
                }));
            }else{
                e.component.option('dataSource',[]);
            }
        };
        condition_YHBatch.widget.events.onValueChanged = (value) => {
            if (value) {
                this.service.YHBatchAndLmData(value).then((res:any) => {
                    this.model.conditionPanel.data['LmQuantity'] = res[0].LmQuantity;
                    if (res[0].LmDataDate!=null && res[0].LmDataDate.length > 32) {
                        this.allLmDataDate = res[0].LmDataDate;
                        this.model.conditionPanel.data['LmDataDate'] = res[0].LmDataDate.slice(0,10) + '...'
                    } else {
                        this.model.conditionPanel.data['LmDataDate'] = res[0].LmDataDate;
                    }
                    this.model.conditionPanel.data['BreedingName'] = res[0].BreedingName;
                })

                let obj = this.BatchDataSource.filter(o => o.YHBatchID === value)[0];
                //计算日龄
                this.DaysOld = obj.DaysOld;
                this.pcDate = obj.DaysOldDate;
                (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                    m['ProductID'] = '';
                    m['ProductName'] = '';
                    if(obj.DaysOldDate&&obj.DaysOld&&m.DataDateDetail){
                        let pcDate = new DateTime(obj.DaysOldDate).toString('yyyy-MM-dd');
                        let DataDate = new DateTime(m.DataDateDetail).toString('yyyy-MM-dd');
                        let start = new Date(DataDate);
                        let end= new Date(pcDate);
                        let diff = new DateTime().diff(start, end);
                        m['DaysOld'] = Number(diff)+Number(obj.DaysOld) + "";
                        this.detailInstance.dataGrid.refresh();
                    }
                });
                //
                this.YHFarmerContract = obj.YHFarmerContract;
                this.model.conditionPanel.data['ChickenFarmID'] = obj.ChickenFarmID;

                if (obj.ChickAbstract == DataDictionary.MaterialSupplyPolicyA) {
                    let list = this.ChickenFarmDataSource.filter(o => o.ChickenFarmID === obj.ChickenFarmID)[0];
                    if (list) {
                        this.model.conditionPanel.data['WarehouseID'] = list.NWarehouseID;
                        this.model.conditionPanel.data['FeedWarehouseID'] = list.ByProdWarehouseID;
                    } else {
                        this.model.conditionPanel.data['WarehouseID'] = '';
                        this.model.conditionPanel.data['FeedWarehouseID'] = '';
                    }
                } else {
                    this.model.conditionPanel.data['WarehouseID'] = '';
                    this.model.conditionPanel.data['FeedWarehouseID'] = '';
                }
                // 栋舍
                let DataDate = this.model.conditionPanel.data['DataDate'];
                let YHBatch = this.model.conditionPanel.data['YHBatch'];
                let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
                let ChickenFarmID = this.model.conditionPanel.data['ChickenFarmID'];
                let page = `DataDate=${new DateTime(DataDate).toString('yyyy-MM-dd')}&YHFarmerID=${YHFarmerID}&YHBatch=${YHBatch}&ChickenFarmID=${ChickenFarmID}&`;
                this.service.getHenhouseByParam(page).then((res:any) => {
                    res = res.map(m => {
                        m['HenHouseID'] = m.HenhouseID;
                        m['HenHouseName'] = m.HenhouseName;
                        return m
                    })
                    if (res.length == 1) {
                        this.model.conditionPanel.data['HenhouseID'] = res[0].HenhouseID;
                    }
                })

            }
        }

        // 栋舍
        const condition_HenhouseID = new NxConditionItem(this.translator.I18N.Patrolrecord.HenhouseID.text, 'HenhouseID');
        condition_HenhouseID.headVisible = true;
        condition_HenhouseID.type = 'SelectBox';
        condition_HenhouseID.widget = new NxSelectBox();
        condition_HenhouseID.required = false;
        condition_HenhouseID.requiredDisable = false;
        condition_HenhouseID.widget.props.showClearButton = false;
        condition_HenhouseID.widget.props.disabled = false;
        condition_HenhouseID.widget.props.readOnly = this.isManageToHenhouse;
        condition_HenhouseID.widget.props.dataSource = this.basicSettingODataContext.getZqHenhouseDataSource();
        condition_HenhouseID.widget.props.valueExpr = 'HenHouseID';
        condition_HenhouseID.widget.props.displayExpr = 'HenHouseName';
        condition_HenhouseID.widget.events.onOpened = e => {
            let DataDate = this.model.conditionPanel.data['DataDate'];
            let YHBatch = this.model.conditionPanel.data['YHBatch'];
            let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            let ChickenFarmID = this.model.conditionPanel.data['ChickenFarmID'];
            let page = '';
            if (DataDate) {
                page += `DataDate=${new DateTime(DataDate).toString('yyyy-MM-dd')}&`
            }
            if (YHFarmerID && YHFarmerID != '0') {
                page += `YHFarmerID=${YHFarmerID}&`
            }
            if (YHBatch && YHBatch != '0') {
                page += `YHBatch=${YHBatch}&`
            }
            if (ChickenFarmID && ChickenFarmID != '0') {
                page += `ChickenFarmID=${ChickenFarmID}&`
            }
            if (YHBatch && YHBatch != '0' && YHFarmerID && YHFarmerID != '0' && ChickenFarmID && ChickenFarmID != '0') {
                this.service.getHenhouseByParam(page).then((res:any) => {
                    res = res.map(m => {
                        m['HenHouseID'] = m.HenhouseID;
                        m['HenHouseName'] = m.HenhouseName;
                        return m
                    })
                    e.component.option('dataSource',res);
                })
            } else {
                e.component.option('dataSource',[]);
            }
        };

        //管理员
        const condition_PersonID = new NxConditionItem();
        condition_PersonID.label = this.translator.I18N.Patrolrecord.PersonID.text;
        condition_PersonID.required = false;
        condition_PersonID.requiredDisable = false;
        condition_PersonID.type = 'SelectBox';
        condition_PersonID.dataField = 'PersonID';
        condition_PersonID.headVisible = true;
        condition_PersonID.widget = new NxSelectBox();
        condition_PersonID.widget.props.showClearButton = false;
        condition_PersonID.widget.props.disabled = false;
        condition_PersonID.widget.props.readOnly = false;
        condition_PersonID.widget.props.dataSource = this.qlwOdataContext.getQlWPersonOData();
        condition_PersonID.widget.props.valueExpr = 'PersonID';
        condition_PersonID.widget.props.displayExpr = 'PersonName';
        condition_PersonID.widget.events.onOpened = e => {
            let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            if (YHFarmerID) {
                let page = `?YHFarmerID=${YHFarmerID}`;
                this.service.YhFarmingPerson(page).then((res:any) => {
                    e.component.option('dataSource',res);
                })
            } else {
                e.component.option('dataSource',[]);
                this.model.conditionPanel.data['PersonID'] = '0';
            }

        };

        //是否期初
        const condition_isbegin = new NxConditionItem();
        condition_isbegin.label =  this.translator.I18N.Patrolrecord.isbegin.text;
        condition_isbegin.required = false;
        condition_isbegin.type = 'SelectBox';
        condition_isbegin.dataField = 'isbegin';
        condition_isbegin.headVisible = true;
        condition_isbegin.requiredDisable = false;
        condition_isbegin.widget = new NxSelectBox();
        condition_isbegin.widget.props.showClearButton = false;
        condition_isbegin.widget.props.dataSource = this.StatusODataContext.getEggsIsShiftTrayDataSource();
        condition_isbegin.widget.props.valueExpr = 'value';
        condition_isbegin.widget.props.displayExpr = 'name';

        //品种
        const condition_BreedingID = new NxConditionItem('品种', 'BreedingName', 'TextBox', false);
        condition_BreedingID.required = false;
        condition_BreedingID.headVisible = true;
        condition_BreedingID.widget = new NxTextBox();
        condition_BreedingID.widget.props.showClearButton = false;
        condition_BreedingID.widget.props.readOnly = true;

        //领苗日期
        const condition_LmDataDate = new NxConditionItem('领苗日期', 'LmDataDate', 'TextBox', false);
        condition_LmDataDate.required = false;
        condition_LmDataDate.headVisible = true;
        condition_LmDataDate.widget = new NxTextBox();
        condition_LmDataDate.widget.props.showClearButton = false;
        condition_LmDataDate.widget.props.readOnly = true;
        condition_LmDataDate.widget.props.id = 'LmDataDate';
        condition_LmDataDate.widget.events.mouseenter = this.LmDataDateDefault.bind(this);
        condition_LmDataDate.widget.events.mouseleave = this.LmDataDateDefault.bind(this);

        //领苗总只数
        const condition_TotalQuantity = new NxConditionItem('领苗总只数', 'LmQuantity', 'TextBox', false);
        condition_TotalQuantity.required = false;
        condition_TotalQuantity.headVisible = true;
        condition_TotalQuantity.widget = new NxTextBox();
        condition_TotalQuantity.widget.props.showClearButton = false;
        condition_TotalQuantity.widget.props.readOnly = true;

        //饲料仓库
        const condition_FeedWarehouseID = new NxConditionItem();
        condition_FeedWarehouseID.label =  this.translator.I18N.Patrolrecord.FeedWarehouseID.text;
        condition_FeedWarehouseID.required = false;
        condition_FeedWarehouseID.type = 'SelectBox';
        condition_FeedWarehouseID.dataField = 'FeedWarehouseID';
        condition_FeedWarehouseID.headVisible = true;
        condition_FeedWarehouseID.requiredDisable = false;
        condition_FeedWarehouseID.widget = new NxSelectBox();
        condition_FeedWarehouseID.widget.props.showClearButton = false;
        condition_FeedWarehouseID.widget.props.readOnly = true;
        condition_FeedWarehouseID.widget.props.dataSource = this.basicSettingODataContext.getWareHouseDataSource({
            select: ['WarehouseID', 'WarehouseName'],
        });
        condition_FeedWarehouseID.widget.props.valueExpr = 'WarehouseID';
        condition_FeedWarehouseID.widget.props.displayExpr = 'WarehouseName';

        //存栏仓库
        const condition_WarehouseID = new NxConditionItem();
        condition_WarehouseID.label =  this.translator.I18N.Patrolrecord.WarehouseID.text;
        condition_WarehouseID.required = false;
        condition_WarehouseID.type = 'SelectBox';
        condition_WarehouseID.dataField = 'WarehouseID';
        condition_WarehouseID.headVisible = true;
        condition_WarehouseID.requiredDisable = false;
        condition_WarehouseID.widget = new NxSelectBox();
        condition_WarehouseID.widget.props.showClearButton = false;
        condition_WarehouseID.widget.props.disabled = false;
        condition_WarehouseID.widget.props.readOnly = true;
        condition_WarehouseID.widget.props.dataSource = this.basicSettingODataContext.getWareHouseDataSource({
            select: ['WarehouseID', 'WarehouseName'],
        });
        condition_WarehouseID.widget.props.valueExpr = 'WarehouseID';
        condition_WarehouseID.widget.props.displayExpr = 'WarehouseName';

        const condition_numericalOrder = new NxConditionItem();
        condition_numericalOrder.label = this.translator.I18N.commonColumns.numericalOrder.text;
        condition_numericalOrder.type = 'Span';
        condition_numericalOrder.headVisible = true;
        condition_numericalOrder.dataField = 'NumericalOrder';

        const condition_number = new NxConditionItem();
        condition_number.label = this.translator.I18N.commonColumns.number.text;
        condition_number.type = 'Span';
        condition_number.headVisible = true;
        condition_number.dataField = 'Number';


        this.model.conditionPanel.conditionItems.push(
            ...[
                condition_date,
                condition_YHFarmerID,
                condition_YHBatch,
                condition_ChickenFarmID,
                condition_HenhouseID,
                condition_PersonID,
                condition_isbegin,
                condition_BreedingID,
                condition_LmDataDate,
                condition_TotalQuantity,
                condition_FeedWarehouseID,
                condition_WarehouseID,
                condition_number,
                // condition_numericalOrder,
            ]
        );
        return this;
    }

    getPatrolRecordProduct() {
        let HenhouseID = '0';
        if ( this.isManageToHenhouse ) {
            HenhouseID = this.model.conditionPanel.data['HenhouseID'] || '0'
        }
        let Para = {
            YHBatch: this.model.conditionPanel.data['YHBatch'] || '0',
            HenhouseID: HenhouseID,
            StartDate: new DateTime(this.formData.StartDate).toString('yyyy-MM-dd'),
            EndDate: new DateTime(this.formData.EndDate).toString('yyyy-MM-dd'),
        }
        this.service.PatrolRecordProduct(Para).then((res:any) => {
            this.cPatrolRecordData = res.data;
        })
    }

    LmDataDateDefault() {
        if (!this.allLmDataDate) {
            return
        }
        this.DataDateVisible = !this.DataDateVisible;
    }

    //移入移出
    toggleDefault () {
        this.defaultVisible = !this.defaultVisible;
    }

    //移入移出
    toggleDefault1 () {
        this.defaultVisible1 = !this.defaultVisible1;
    }

    onChickenSourceChange(value){
        if(this.editFlag){
            return;
        }
        if (value==DataDictionary.ChickenSourceA) {
            this.http
            .post(environment.faUri + '/api/FA_EnterpriseAPI/GetCurEnterData', {})
            .subscribe((res: any) => {
                if(res.beginDate){
                    this.model.conditionPanel.data['DataDate'] =  new DateTime(res.beginDate).toString('yyyy-MM-dd');
                    this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly = true;
                }
                else{
                    this.model.conditionPanel.data['DataDate'] = null;
                    this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
                }
            });
            // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "SupplierID")[0].required = false;
            this.model.conditionPanel.data['SupplierID'] = '';
        }
        else{
            this.model.conditionPanel.data['DataDate'] = new Date();
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
            // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "SupplierID")[0].required = true;
            this.model.conditionPanel.data['SupplierID'] = '';
        }
    }
    onChickenFarmChange(value){
        if (value) {
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly  = false;
        }else {
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly  = true;
        }

        if(this.editFlag){
            return;
        }

        (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
            m['ProductID'] = '';
            m['ProductName'] = '';
            this.detailInstance.dataGrid.refresh();
        })

        this.model.conditionPanel.data['YHBatch'] = null;
        this.model.conditionPanel.data['ProductID'] = '';
        this.model.conditionPanel.data['ChickenFarmID'] = '';
        let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
        let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
        if (YHFarmerID) {
            let page = `?YHFarmerID=${YHFarmerID}`;
            this.service.YhFarmingPerson(page).then((res:any) => {
                this.PersonSource = res;
                if (res.length == 1 && res[0].RoleID == '2212141714430000150') {
                    this.model.conditionPanel.data['PersonID'] = res[0].PersonID;
                }else {
                    this.model.conditionPanel.data['PersonID'] = '0';
                }

            })
        } else {
            this.PersonSource = [];
            this.model.conditionPanel.data['PersonID'] = '0';
        }
        let filter = [['DataDate', '<=', new Date(new Date(new Date(DataDate).getTime()).toLocaleDateString())],['Status', '=', true],["YHFarmerID",'=',YHFarmerID]];
        new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
            filter: filter
        })).load().then((res:any) => {
            if(res&&res.length>0){
                if(res.length==1){
                    this.model.conditionPanel.data['YHBatch'] = res[0].YHBatchID;
                }else{
                    this.HenhouseBydataSource = [];
                }
            }
        });
    }

    getWarehouse(value){
        if(this.editFlag){
            return;
        }
        if (value&&value!="0") {
            var param = "ChickenFarmID="+value+"&Billtype=zjyz&";
            this.service
                .queryWarehouseByFarm(<any>param)
                .then((res: any) => {
                    if(res&&res.WarehouseID&&res.WarehouseID!="0"){
                        this.model.conditionPanel.data['WarehouseID'] = res.WarehouseID;
                    }
                    else{
                        this.model.conditionPanel.data['WarehouseID'] = null;
                    }
                });
        }
        else{
            this.model.conditionPanel.data['WarehouseID'] = null;
        }
    }

    updateDaysOld() {
        if(this.editFlag){
            return;
        }
        var DaysOld = "";
        if(this.pcDate&&this.DaysOld&&this.model.conditionPanel.data['DataDate']){
            let pcDate = new DateTime(this.pcDate).toString('yyyy-MM-dd');
            let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let start = new Date(DataDate);
            let end= new Date(pcDate);
            let diff = new DateTime().diff(start, end);
            DaysOld = Number(diff)+Number(this.DaysOld)+"";
         }
         this.model.conditionPanel.data['DaysOld'] = DaysOld;
    }
    removeRow() {

        // 底部删除选中行
        // 获取到用户当前选中的key
        // 删除数据的时候需要把数据标记为delete
        if (!this.detailInstance.dataGrid.model.editing.allowUpdating) {
            Notify.toast('当前状态不可以操作', NotifyType.Warning);
            return;
        }
        if((<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length==0){
            return;
        }
        if (this.detailInstance.dataGrid.selectRowIndex == -1) {
            this.detailInstance.dataGrid.dataGrid.instance.deleteRow((<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length - 1);
            // splice源数据删除
            let deletedRowData = (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).splice(
                (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).length - 1,
                1
            );
            if (deletedRowData[0].target != DataStatus.newline) {
                deletedRowData[0].target = DataStatus.deleted;
                this.detailInstance.dataGrid.$deletedData.push(...deletedRowData);
            }
        } else {
            this.detailInstance.dataGrid.dataGrid.instance.deleteRow(this.detailInstance.dataGrid.selectRowIndex);
            let deletedRowData = (<Array<any>>this.detailInstance.dataGrid.model.props.dataSource).splice(this.detailInstance.dataGrid.selectRowIndex, 1);
            if (deletedRowData[0].target != DataStatus.newline) {
                deletedRowData[0].target = DataStatus.deleted;
                this.detailInstance.dataGrid.$deletedData.push(...deletedRowData);
            }
        }
        this.detailInstance.dataGrid.dataGrid.instance.refresh();
        if (this.detailInstance.dataGrid.model.commandColumn.deleteButton.onClick) {
            this.detailInstance.dataGrid.model.commandColumn.deleteButton.onClick();
        }
        this.detailInstance.dataGrid.selectRowIndex = -1;
        this.adjustAllData();
    }
    queryDetail(){

        this.service.getCustomDataSourceById(this.numericalOrder).then((res:any) => {
            var value = res.data;
            console.log("queryDetail",res.data)
            value.map( m => {
                m.target = DataStatus.none;
                // m['SljcPackagesCopy'] = m.SljcPackages;
                // m['SljcQuantityCopy'] = m.SljcQuantity;
                return m
            })
            this.editFlag = true;
            this.model.dataGrid.props.dataSource = value;
            this.model.conditionPanel.data = value[0];
            if (value[0].LmDataDate.length > 32) {
                this.allLmDataDate = value[0].LmDataDate;
                this.model.conditionPanel.data['LmDataDate'] = value[0].LmDataDate.slice(0,10) + '...'
            }
            this.detailInstance.cacheSearchData = deepCopy(value[0]);
            this.detailInstance.cacheBodyData = deepCopy(this.model.conditionPanel.data);
            //开启审核功能
            this.model.review.visible = true;
            this.model.review.numericalOrder = this.numericalOrder;
            //计算日龄
            this.YHBasicSettingODataContext.YHBatch.load().then((res:any) => {
                let obj = res.filter(o => o.YHBatchID === value[0].YHBatch)[0];
                this.DaysOld = obj.DaysOld;
                this.pcDate = obj.DaysOldDate;
            })
            this.model.review.ownerName = value[0].CreatedOwnerName;
            setTimeout(() => {
                this.detailInstance.saveDataAfterStatus();
                this.editFlag = false;
                this.setReadOnly();
            }, 200);
        })
    }

    setReadOnly(){
        var flag = false;
        (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
            if(m.target != DataStatus.deleted ){
                if((m.ProductID&&m.ProductID!="0")||(m['DataDateDetail'])){
                    flag = true;
                    return false;
                }
            }
        })
        if(flag){
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly = true;
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHFarmerID")[0].widget.props.readOnly = true;
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "HenhouseID")[0].widget.props.readOnly = true;
        }
        else{
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly = false;
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHFarmerID")[0].widget.props.readOnly = false;
            this.model.conditionPanel.conditionItems.filter(q => q.dataField == "HenhouseID")[0].widget.props.readOnly = false;
        }
    }

    //#region 初始化数据源
    initialization(e: NxZlwFormDetailComponent) {
        this.service.getClosedInTheCurrent().then((res)=>{
            console.log(res,'账期月份')
            if(res){
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.readOnly  = true;
            }else{

                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.readOnly  = false;
            }
        })
        e.isRightReview = true;//禁用右键
        //详情进入编辑页面
        if (this.route.queryParams['value']['$open'] == FormOptions.$modify) {
            setTimeout(() => {
                this.queryDetail();
            }, 500);
        } else {
            setTimeout(() => {
                this.create();
            }, 500);
        }
        setTimeout(() => {
            this.detailInstance.dataGrid.removeRow = this.removeRow.bind(this);
        }, 1000);
    }
    //#endregion



    //跳转模板
    jump() {
        HomeHelper.open(
            {
                url: `${this.environment.desiUrl}/print-template?choice_menu_id=${this.menu_id}&enterpriseId=${this.tokenService.getTokenData.enterprise_id}&choice_menu_name=引种入舍`,
                title: '模板管理',
            },
            () => {
                window.open(
                    `${this.environment.desiUrl}/print-template?appid=2009082147570000101&enterpriseId=1798961&childEnterpriseId=210407101720000107&choice_menu_id=${this.menu_id}&choice_menu_name=引种入舍`
                );
            }
        );
    }
    //自定义打印
    getSource(e) {
        console.log(e);
        if (e.status) {

            var tabid1 = [];
            var totalAmount=0;
            this.detailInstance.dataGrid.dataGrid.instance.getVisibleRows().map((m: any, index) => {
                var obj = {
                    XuHao: index + 1,
                    HenhouseName: m.data.HenhouseName,
                    SexTypeName:m.data.SexTypeName,
                    Packages:m.data.Packages,
                    cProductName:m.data.cProductName,
                    ValueQuantity:m.data.ValueQuantity,
                    GiftQuantity:m.data.GiftQuantity,
                    DeliveryTotal:m.data.DeliveryTotal,
                    UnitPrice:m.data.UnitPrice,
                    AmountTotal:m.data.AmountTotal,
                    LossTotal:m.data.LossTotal,
                    IntoHouseTotal:m.data.IntoHouseTotal,
                };
                totalAmount+=m.AmountTotal==''?0:m.AmountTotal;
                totalAmount=Number(totalAmount.toFixed(2));
                tabid1.push(obj);
            });
            var tabId0 = {
                //日期
                DataDate: new DateTime(this.model.conditionPanel.data['DataDate']).toString(),
                //引种来源
                ChickenSourceName:  this.model.conditionPanel.data['ChickenSourceName'] == undefined ? '': this.model.conditionPanel.data['ChickenSourceName'],
                //鸡场
                ChickenFarmName:  this.model.conditionPanel.data['ChickenFarmName'] == undefined ? '': this.model.conditionPanel.data['ChickenFarmName'],
                //批次
                BatchName:  this.model.conditionPanel.data['BatchName'] == undefined ? '': this.model.conditionPanel.data['BatchName'],
                //供应商ID
                SupplierName:this.model.conditionPanel.data['SupplierName'] == undefined ? '': this.model.conditionPanel.data['SupplierName'],
                //仓库
                WarehouseName:this.model.conditionPanel.data['WarehouseName'] == undefined ? '': this.model.conditionPanel.data['WarehouseName'],
                //运费承担方
                FreightForName:this.model.conditionPanel.data['FreightForName'] == undefined ? '': this.model.conditionPanel.data['FreightForName'],
                //品种
                BreedingName:this.model.conditionPanel.data['BreedingName'] == undefined ? '': this.model.conditionPanel.data['BreedingName'],
                //日龄
                DaysOld:this.model.conditionPanel.data['DaysOld'] == undefined ? '': this.model.conditionPanel.data['DaysOld'],
                //单位
                EnterpriseName:USER_INFO_CONTEXT.enterpriseName,
                // 单据号
                Number:this.model.conditionPanel.data['Number'] == undefined ? '': this.model.conditionPanel.data['Number'],
                // 说明
                Remarks:this.model.conditionPanel.data['Remarks'] == undefined ? '': this.model.conditionPanel.data['Remarks'],
                // 制单人
                creatorName: this.model.review.ownerName,
                // 审核人
                auditerName: this.model.review.reviewName,
                // 表单总金额小写
                totalAmount: totalAmount,
                // 表单总金额大写
                TotalAmount: dealBigMoney(totalAmount),
            };
            let sources = {
                tabId0: tabId0,
                tabId1: tabid1,
            };
            this._printPage.instance.printGeneration(sources);
        }
    }
}
