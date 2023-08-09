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
import { YhChickenReceiveService } from '../yhchickenreceive.service';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { TokenAuthService } from 'src/app/shared/services';
import { YhChickenReceiveAdd } from '../yhchickenreceive.model';
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

@Component({
    selector: 'yhchickenreceive-detail',
    templateUrl: './yhchickenreceive-detail.component.html',
    styleUrls: ['./yhchickenreceive-detail.component.scss'],
})
export class YhChickenReceiveDetailComponent {
    @ViewChild('detailInstance', { static: false })
    detailInstance: NxZlwFormDetailComponent;
    model: NxFormDetail = new NxFormDetail();
    /**
     * 流水号
     */
    numericalOrder: string;
    @ViewChild('dataGrid', { static: false })
    dataGrid: DxDataGridComponent;

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
    selectedRows: any;
    cProductNameSource: any;
    OutHouseNameSource: any;

    loading: boolean = false;
    zqHenhouseSource: any;
    BatchDataSource: any;
    ChickenFarmDataSource: any;

    HenhouseSourceall:any
    modifyVisible: boolean = false;

    HenhouseBydataSource: any;
    YHFarmerContract: string;
    //#endregion
    constructor(
        private route: ActivatedRoute,
        private service: YhChickenReceiveService,
        private http: HttpClient,
        private qlwOdataContext: QlwODataContext,
        private tokenService: TokenAuthService,
        private basicSettingODataContext: BasicSettingODataContext,
        private qlwCustomerContext: QlwCustomerContext,
        private translator: TranslateService,
        private YHBasicSettingODataContext: YHBasicSettingODataContext,
        private StatusODataContext: StatusODataContext
    ) {
        this.numericalOrder = this.route.queryParams['value']['numericalOrder'];
        this.model.initialization = this.initialization.bind(this);

        this.service.getProductBatch().then((res:any)=>{
            this.allProductBatchSource = res.value;
        });

        this.cProductNameSource = this.basicSettingODataContext.getBizProductannexedDataSource({
            filter: [
                ['iSortPlus', '=', DataDictionary.iSortF],
            ],
            select: ['ProductID', 'cProductName'],
        });


        this.basicSettingODataContext.zqHenhouseGroup.load().then((res:any) => {
            this.zqHenhouseSource = res
        })

        // new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource()).load().then((res:any) => {
        //     this.BatchDataSource = res
        // })

        this.YHBasicSettingODataContext.YHBatch.load().then((res:any) => {
            this.BatchDataSource = res
        })


        this.basicSettingODataContext.bizChickenFarm.load().then((res:any) => {
            this.ChickenFarmDataSource = res
        })

        // this.service.getHenhouseByParam('').then((res:any) => {
        //     this.HenhouseSourceall = res;
        // })

        this.OutHouseNameSource = this.basicSettingODataContext.getZqHenhouseDataSource({
            // filter: [['ChickenFarmID ', '<>','0']],
            select: ['HenHouseID', 'HenHouseName'],
        });
        this.init_data_grid().init_table_header().init_toolbar_panel();
        this.menu_id = tokenService.getTokenData.menu_id;
        this.environment = environment;
        this.tokenData = tokenService.getTokenData;
    }
    //#region 初始化表格
    init_data_grid(): YhChickenReceiveDetailComponent {
        this.model.dataGrid.primaryKey = 'NumericalOrderDetail';
        this.model.dataGrid.stateStoring.storageKey = 'YhChickenReceive-detail';
        this.model.dataGrid.stateStoring.enabled = true;
        this.model.dataGrid.columns.push(...this.columns);
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.summary.enabled = true;

        const summaryItem_total_ValueTotal = new NxDataGridSummaryTotal();
        summaryItem_total_ValueTotal.column = 'ValueQuantity';
        summaryItem_total_ValueTotal.summaryType = 'sum';
        summaryItem_total_ValueTotal.valueFormat = '0';

        const summaryItem_total_AmountTotal = new NxDataGridSummaryTotal();
        summaryItem_total_AmountTotal.column = 'AmountTotal';
        summaryItem_total_AmountTotal.summaryType = 'sum';
        summaryItem_total_AmountTotal.valueFormat = '2';

        this.model.dataGrid.summary.totalItems = [summaryItem_total_ValueTotal,summaryItem_total_AmountTotal];
        this.model.dataGrid.events.onCellClick = this.handleCell.bind(this);
        this.model.dataGrid.paginate.pager.visible = 'auto';
        this.model.dataGrid.events.onEditorPreparing = this.onEditorPreparingFn.bind(this);
        return this;
    }

    get columns() {
        const col_HenHouseName = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.HenhouseID.text,
            'HenhouseID',
            'string',
            'HenhouseName'
        );
        col_HenHouseName.props.width = 120;
        col_HenHouseName.props.alignment = 'center';
        col_HenHouseName.props.lookup.enabled = true;
        col_HenHouseName.props.lookup.dataSource = this.HenhouseBydataSource;
        col_HenHouseName.props.lookup.valueExpr = 'HenhouseID';
        col_HenHouseName.props.lookup.displayExpr = 'HenhouseName';
        col_HenHouseName.props.setCellValue = (newdata, value, oldData) => {
            var res = this.HenhouseBydataSource.filter((o) => o.HenhouseID == value);
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    m['HenhouseID'] = value;
                    m['HenhouseName'] = res[0].HenhouseName;
                }
            })
        };
        // const col_HenHouseName_required = new NxDataGridColumnValidationRule('required');
        // col_HenHouseName_required.message = this.translator.I18N.YhChickenReceiveDetail.HenhouseID.required;
        // col_HenHouseName.validationRules.push(...[col_HenHouseName_required]);

        //商品代号
        const col_ProductID = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.ProductName.text,
            'DetailProductID',
            'string',
            'DetailProductName'
        );
        col_ProductID.props.width = 120;
        col_ProductID.props.requiredDisable = true;
        // col_ProductID.props.lookup.enabled = true;
        // col_ProductID.props.allowEditing = true;
        col_ProductID.props.HeaderRequiredIcon = true;
        col_ProductID.props.cellTemplate.widget = new NxSelectBox();
        col_ProductID.props.cellTemplate.enabled = true;
        col_ProductID.props.cellTemplate.type = 'SelectBox';
        col_ProductID.props.cellTemplate.templateName = "aName";
        col_ProductID.props.fixed = true;
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.dataSource = this.basicSettingODataContext.getProductDataSource({
            filter: [
                ['iSortPlus', '=', DataDictionary.iSortF],
            ],
            select: ['ProductID', 'ProductName'],
        });
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.valueExpr = 'ProductID';
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.displayExpr = 'ProductName';
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchExpr = ['ProductID','ProductName','MnemonicCode'];
        (<NxSelectBox>col_ProductID.props.cellTemplate.widget).props.searchEnabled = true;
        const col_ProductID_required = new NxDataGridColumnValidationRule('required');
        col_ProductID_required.message = this.translator.I18N.YhChickenReceiveDetail.ProductName.required;
        col_ProductID.validationRules.push(...[col_ProductID_required]);
        col_ProductID.props.setCellValue = (newdata, value, oldData) => {
            if (value) {
                var iSort = 'ProductID=' + value + '&';
                this.service
                    .getProduct(<any>iSort)
                    .then((result: any) => {
                        (<Array<any>>this.model.dataGrid.props.dataSource).map(async (m) => {
                            if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {

                                if (DataDictionary.MaterialSupplyPolicyA != this.model.conditionPanel.data['Abstract']) {
                                    let UrlParam = 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd')+ '&';
                                    UrlParam += 'ProductCollectType=' + DataDictionary.ProductCollectTypeA + '&';
                                    if (this.model.conditionPanel.data['YHFarmerID']) {
                                        UrlParam += 'YHFarmerID=' + this.model.conditionPanel.data['YHFarmerID'] + '&';
                                    }
                                    if (this.model.conditionPanel.data.YHBatch) {
                                        UrlParam += 'YHBatchID=' + this.model.conditionPanel.data.YHBatch + '&';
                                    }
                                    UrlParam += 'ProductID=' + value + '&';
                                    this.loading = true;
                                    await this.service.getGetUnitPrice(UrlParam).then( (res:any) => {
                                        this.loading = false;
                                        if(res&&res.length>0){
                                            m['UnitPrice'] = res[0].UnitPrice;
                                        }
                                    })
                                }

                                m['DetailProductID'] = value;
                                m['DetailProductName'] = result.value[0].cProductName;
                                m['MeasureUnitName'] = result.value[0].MeasureUnitName;
                                m['ProductBatchID'] = '';
                                m['ProductBatchName'] = '';
                                m['HatchBatchName'] = '';
                                m['SouHenhouseName'] = '';
                                m['FarmName'] = '';
                                m['BatchName'] = '';
                                m['SouBreedingName'] = '';
                                m['ImmuneSubjectName'] = '';
                                m['DebeakingName'] = '';
                                m['BatchRemarks'] = '';
                                setTimeout(() => {
                                    this.setReadOnly();
                                    this.detailInstance.dataGrid.refresh();
                                }, 10);
                            }
                        });
                        // this.setReadOnly();
                        // this.detailInstance.dataGrid.refresh();
                        // this.model.dataGrid.props.dataSource = deepCopy(this.model.dataGrid.props.dataSource);
                    });
            } else {
                (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                    if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                        m['DetailProductID'] = null;
                        m['DetailProductName'] = '';
                        m['MeasureUnitName'] = '';
                        m['ProductBatchID'] = '';
                        m['ProductBatchName'] = '';
                        m['HatchBatchName'] = '';
                        m['SouHenhouseName'] = '';
                        m['FarmName'] = '';
                        m['BatchName'] = '';
                        m['SouBreedingName'] = '';
                        m['ImmuneSubjectName'] = '';
                        m['DebeakingName'] = '';
                        m['BatchRemarks'] = '';
                        this.setReadOnly();
                        this.detailInstance.dataGrid.refresh();
                    }
                });

            }
        }

        //批号
        const col_ProductBatchID = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.ProductBatchID.text,
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
        col_ProductBatchID.props.fixed = true;
        // const col_ProductBatchID_required = new NxDataGridColumnValidationRule('required');
        // col_ProductBatchID_required.message = this.translator.I18N.YhChickenReceiveDetail.ProductName.required;
        // col_ProductBatchID.validationRules.push(...[col_ProductBatchID_required]);
        col_ProductBatchID.props.lookup.valueExpr = 'ProductBatchID';
        col_ProductBatchID.props.lookup.displayExpr = 'ProductBatchName';
        col_ProductBatchID.props.setCellValue = (newData, value, oldData) => {
            if (value) {
                var res = this.allProductBatchSource.filter((o) => o.ProductBatchID == value);
                (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                    if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                        m['ProductBatchID'] = value;
                        m['ProductBatchName'] = res[0].ProductBatchName;
                        m['HatchBatchName'] = res[0].HatchBatchName;
                        m['HatchBatchID'] = res[0].HatchBatchID;
                        m['SouHenhouseName'] = res[0].HenhouseName;
                        m['SouHenhouseID'] = res[0].HenhouseID;
                        m['FarmName'] = res[0].FarmName;
                        m['BatchName'] = res[0].BatchName;
                        m['BatchID'] = res[0].BatchID;
                        m['SouBreedingName'] = res[0].SouBreedingName;
                        m['SouBreedingID'] = res[0].SouBreedingID;
                        m['ImmuneSubjectName'] = res[0].ImmuneSubjectName;
                        m['ImmuneSubjectID'] = res[0].ImmuneSubjectID;
                        m['DebeakingName'] = res[0].DebeakingName;
                        m['Debeaking'] = res[0].Debeaking;
                        m['BatchRemarks'] = res[0].BatchRemarks;
                    }
                });
                this.detailInstance.dataGrid.refresh();
                // this.model.dataGrid.props.dataSource = deepCopy(this.model.dataGrid.props.dataSource);
            }
        };

        //计价只数
        const col_ValueTotal = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.ValueQuantity.text,
            'ValueQuantity',
            'number'
        );
        col_ValueTotal.props.width = 120;
        col_ValueTotal.props.alignment = 'right';
        col_ValueTotal.props.HeaderRequiredIcon = false;
        col_ValueTotal.props.requiredDisable = true;
        const col_ValueTotal_pattern = new NxDataGridColumnValidationRule();
        col_ValueTotal_pattern.type = 'pattern';
        col_ValueTotal_pattern.pattern = RegExps.IntNumber;
        col_ValueTotal_pattern.message = this.translator.I18N.YhChickenReceiveDetail.ValueQuantity.patternMessage;
        col_ValueTotal.validationRules.push(...[col_ValueTotal_pattern]);
        col_ValueTotal.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    var AmountTotal=0; //金额
                    var ValueQuantity=0; //计价只数
                    var UnitPrice =0; //单价
                    var Weight = 0;  //总重量(公斤)
                    var DonateQuantity = oldData['DonateQuantity']
                    /**
                     * 1）用户更改计价只数时：
                     *  a、当（总重量=0或为空）且（金额大于0）且（单价大于0）时，
                     *      修改计价只数时，需要更新金额，金额=计价只数*单价，四舍五入保留两位小数；
                     *  b、当（总重量大于0）且（金额大于0）且（单价大于0）时，
                     *      修改计价只数时，需要更新单价，单价=金额/计价只数，四舍五入保留四位小数；
                     */
                    if(value){
                        ValueQuantity = Number(value);
                    }
                    if(oldData.Weight){
                        Weight = Number(oldData.Weight);
                    }
                    if(oldData.AmountTotal){
                        AmountTotal = Number(oldData.AmountTotal);
                    }
                    if(oldData.UnitPrice){
                        UnitPrice = Number(oldData.UnitPrice);
                    }
                    if(Weight==0&&AmountTotal>0&&UnitPrice>0){
                        AmountTotal = UnitPrice*ValueQuantity;
                        m['AmountTotal'] =AmountTotal.toFixed(2);
                        if (m['Gift']) {
                            m['AmountTotal'] = 0;
                        } else {
                            m['AmountTotal'] = AmountTotal.toFixed(2);
                        }
                    }
                    else if(Weight>0&&AmountTotal>0&&UnitPrice>0){
                        UnitPrice = ValueQuantity!=0?(AmountTotal/ValueQuantity):0;
                        if (m['Gift']) {
                            m['UnitPrice'] = 0;
                        } else {
                            m['UnitPrice'] = UnitPrice.toFixed(4);
                        }
                    }else{
                        if(AmountTotal==0){
                            AmountTotal = UnitPrice*ValueQuantity;
                        }else{
                            UnitPrice = ValueQuantity!=0?(AmountTotal/ValueQuantity):0;
                        }
                        if (m['Gift']) {
                            m['AmountTotal'] = 0;
                            m['UnitPrice'] = 0;
                        } else {
                            m['AmountTotal'] = AmountTotal.toFixed(2);
                            m['UnitPrice'] = UnitPrice.toFixed(4);
                        }
                    }
                    m['ValueQuantity'] = value;

                    if (DonateQuantity && DonateQuantity > 0) {
                        m['TotalQuantity'] = value + DonateQuantity;
                    } else {
                        m['TotalQuantity'] = value;
                    }
                }
            });
        }

        //计量单位
        const col_MeasureUnitName = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.MeasureUnitName.text,
            'MeasureUnitName',
            'string',
        );
        col_MeasureUnitName.props.lookup.enabled = true;
        col_MeasureUnitName.props.allowEditing = false;
        col_MeasureUnitName.props.width=100;
        col_MeasureUnitName.props.alignment = 'center'

        // 单价
        const col_UnitPrice = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.UnitPrice.text,
            'UnitPrice',
            'number'
        );
        col_UnitPrice.props.width = 120;
        col_UnitPrice.props.alignment = 'right';
        col_UnitPrice.props.HeaderRequiredIcon = false;
        col_UnitPrice.props.requiredDisable = false;
        const col_UnitPrice_pattern = new NxDataGridColumnValidationRule();
        col_UnitPrice_pattern.type = 'pattern';
        col_UnitPrice_pattern.pattern = RegExps.PositiveNumberFix4;
        col_UnitPrice_pattern.message = this.translator.I18N.YhChickenReceiveDetail.UnitPrice.patternMessage;
        col_UnitPrice.validationRules.push(...[col_UnitPrice_pattern]);
        col_UnitPrice.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    var AmountTotal=0;
                    var TaxPrice=0;
                    var Weight=0;
                    var ValueQuantity=0;
                    var UnitPrice=0;
                    if(value){
                        UnitPrice = Number(value);
                    }
                    if(oldData.AmountTotal){
                        AmountTotal = Number(oldData.AmountTotal);
                    }
                    if(oldData.Weight){
                        Weight = Number(oldData.Weight);
                    }
                    if(oldData.ValueQuantity){
                        ValueQuantity = Number(oldData.ValueQuantity);
                    }
                    AmountTotal = ValueQuantity*UnitPrice;
                    if(Weight!=0){
                        TaxPrice = AmountTotal/Weight;
                    }
                    m['TaxPrice'] =TaxPrice.toFixed(4);

                    if (m['Gift']) {
                        m['AmountTotal'] = 0;
                        m['UnitPrice'] = 0;
                    } else {
                        m['AmountTotal'] = AmountTotal.toFixed(2);
                        m['UnitPrice'] = UnitPrice.toFixed(4);
                    }
                }
            });
        };

        //金额
        const col_AmountTotal = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.AmountTotal.text,
            'AmountTotal',
            'number'
        );
        col_AmountTotal.props.width = 120;
        col_AmountTotal.props.HeaderRequiredIcon = false;
        col_AmountTotal.props.alignment = 'right';
        const col_AmountTotal_pattern = new NxDataGridColumnValidationRule();
        col_AmountTotal_pattern.type = 'pattern';
        col_AmountTotal_pattern.pattern = RegExps.PositiveNumberFix2;
        col_AmountTotal_pattern.message = this.translator.I18N.YhChickenReceiveDetail.AmountTotal.patternMessage;
        col_AmountTotal.validationRules.push(...[col_AmountTotal_pattern]);
        col_AmountTotal.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    var ValueQuantity=0;
                    var AmountTotal=0;
                    var UnitPrice=0;
                    var Weight=0;
                    var TaxPrice=0;
                    if(value){
                        AmountTotal = Number(value);
                    }
                    if(oldData.ValueQuantity){
                        ValueQuantity = Number(oldData.ValueQuantity);
                    }
                    if(oldData.Weight){
                        Weight = Number(oldData.Weight);
                    }
                    if(ValueQuantity!=0){
                        UnitPrice = AmountTotal/ValueQuantity;
                    }
                    if(Weight!=0){
                        TaxPrice = AmountTotal/Weight;
                    }
                    if (m['Gift']) {
                        m['AmountTotal'] = 0;
                        m['UnitPrice'] = 0;
                    } else {
                        m['AmountTotal'] = value;
                        m['UnitPrice'] = UnitPrice.toFixed(4);
                    }


                    m['TaxPrice'] = TaxPrice.toFixed(4);
                }
            });
        };

        //途补只数
        const col_DonateQuantity = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.DonateQuantity.text,
            'DonateQuantity',
            'number'
        );
        col_DonateQuantity.props.width = 120;
        col_DonateQuantity.props.alignment = 'right';
        col_DonateQuantity.props.visible = true;
        const col_DonateQuantity_pattern = new NxDataGridColumnValidationRule();
        col_DonateQuantity_pattern.type = 'pattern';
        col_DonateQuantity_pattern.pattern = RegExps.IntNumber;
        col_DonateQuantity_pattern.message = this.translator.I18N.YhChickenReceiveDetail.DonateQuantity.patternMessage;
        col_DonateQuantity.validationRules.push(...[col_DonateQuantity_pattern]);
        col_DonateQuantity.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    var ValueQuantity = oldData['ValueQuantity']

                    m['DonateQuantity'] = value;

                    if (ValueQuantity && ValueQuantity > 0) {
                        m['TotalQuantity'] = value + ValueQuantity;
                    } else {
                        m['TotalQuantity'] = value;
                    }
                }
            });
        }

        //总只数
        const col_TotalQuantity = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.TotalQuantity.text,
            'TotalQuantity',
            'number'
        );
        col_TotalQuantity.props.width = 120;
        col_TotalQuantity.props.visible = true;
        col_TotalQuantity.props.allowEditing = false;
        col_TotalQuantity.props.cssClass = 'disabled';
        col_TotalQuantity.props.alignment = 'right';
        col_TotalQuantity.props.HeaderRequiredIcon = false;
        const col_TotalQuantity_pattern = new NxDataGridColumnValidationRule();
        col_TotalQuantity_pattern.type = 'pattern';
        col_TotalQuantity_pattern.pattern = RegExps.IntNumber;
        col_TotalQuantity_pattern.message = this.translator.I18N.YhChickenReceiveDetail.TotalQuantity.patternMessage;
        col_TotalQuantity.validationRules.push(...[col_TotalQuantity_pattern]);

        //赠送
        const col_Gift = new NxDataGridColumn(this.translator.I18N.EggGoodsSalesOrderDetail.Gift.text, 'Gift', 'boolean');
        col_Gift.props.width=100;
        col_Gift.props.alignment="center";
        col_Gift.props.showEditorAlways=true;
        col_Gift.props.setCellValue = (newdata, value, oldData) => {
            (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
                if (m.NumericalOrderDetail == oldData.NumericalOrderDetail) {
                    m['Gift'] = value;
                    if (value) {
                        m['AmountTotal'] = 0;
                        m['UnitPrice'] = 0;
                    }
                }
            });

        }

        //备注
        const col_Remarks = new NxDataGridColumn(this.translator.I18N.yhfarmerInformationSetting.Remarks.text, 'DetailRemarks');
        col_Remarks.props.width = 120;
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = false;
        col_Remarks.props.filterOperations = ['contains'];

        // 孵化批次
        const col_HatchBatchID = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.HatchBatchID.text,
            'HatchBatchName',
            'string'
        );
        col_HatchBatchID.props.width = 120;
        col_HatchBatchID.props.allowEditing = false;
        col_HatchBatchID.props.cssClass = 'disabled';
        col_HatchBatchID.props.HeaderRequiredIcon = false;
        col_HatchBatchID.props.requiredDisable = true;
        col_HatchBatchID.props.visible = true;

        // 来源鸡场
        const col_FarmID = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.FarmID.text,
            'FarmName',
            'string'
        );
        col_FarmID.props.width = 120;
        col_FarmID.props.cssClass = 'disabled';
        col_FarmID.props.allowEditing = false;
        col_FarmID.props.HeaderRequiredIcon = false;
        col_FarmID.props.requiredDisable = true;

        //来源栋舍
        const col_HenhouseID = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.HenHouseName.text,
            'SouHenhouseName',
            'string'
        );
        col_HenhouseID.props.width = 120;
        col_HenhouseID.props.cssClass = 'disabled';
        col_HenhouseID.props.alignment = 'center';
        col_HenhouseID.props.allowEditing = false;
        col_HenhouseID.props.HeaderRequiredIcon = false;
        col_HenhouseID.props.requiredDisable = true;

        //来源禽批次
        const col_BatchID = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.BatchID.text,
            'BatchName',
            'string'
        );
        col_BatchID.props.width = 120;
        col_BatchID.props.cssClass = 'disabled';
        col_BatchID.props.allowEditing = false;
        col_BatchID.props.HeaderRequiredIcon = false;
        col_BatchID.props.requiredDisable = true;

        //来源品种
        const col_BreedingID = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.BreedingID.text,
            'SouBreedingName',
            'string'
        );
        col_BreedingID.props.width = 120;
        col_BreedingID.props.cssClass = 'disabled';
        col_BreedingID.props.allowEditing = false;
        col_BreedingID.props.HeaderRequiredIcon = false;
        col_BreedingID.props.requiredDisable = true;

        //免疫项目
        const col_ImmuneSubjectID = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.ImmuneSubjectID.text,
            'ImmuneSubjectName',
            'string'
        );
        col_ImmuneSubjectID.props.width = 120;
        col_ImmuneSubjectID.props.cssClass = 'disabled';
        col_ImmuneSubjectID.props.alignment = 'center';
        col_ImmuneSubjectID.props.allowEditing = false;
        col_ImmuneSubjectID.props.HeaderRequiredIcon = false;
        col_ImmuneSubjectID.props.requiredDisable = true;

        //断喙
        const col_Debeaking = new NxDataGridColumn(
            this.translator.I18N.YhChickenReceiveDetail.Debeaking.text,
            'DebeakingName',
            'string'
        );
        col_Debeaking.props.width = 120;
        col_Debeaking.props.cssClass = 'disabled';
        col_Debeaking.props.alignment = 'center';
        col_Debeaking.props.allowEditing = false;
        col_Debeaking.props.HeaderRequiredIcon = false;
        col_Debeaking.props.requiredDisable = true;
        const col_BatchRemarks = new NxDataGridColumn(
            this.translator.I18N.ZqEggsTransferDetail.BatchRemarks.text,
            'BatchRemarks',
            'string'
        );
        col_BatchRemarks.props.allowEditing = true;
        col_BatchRemarks.props.width = 100;
        return [
            col_ProductID,
            col_ProductBatchID,
            col_ValueTotal,
            col_MeasureUnitName,
            col_UnitPrice,
            col_AmountTotal,
            col_DonateQuantity,
            col_TotalQuantity,
            col_HenHouseName,
            col_Gift,
            col_Remarks,
            col_HatchBatchID,
            col_FarmID,
            col_HenhouseID,
            col_BatchID,
            col_BreedingID,
            col_ImmuneSubjectID,
            col_Debeaking,
            col_BatchRemarks
        ];
    }

    onEditorPreparingFn(e) {
        if (e.parentType == 'dataRow') {
            const defaultValueChangeEvent = e.editorOptions.onValueChanged;
            const rowData = e.row.data;
            let triggerValueChanged = true;

            switch (e.dataField) {

                case 'HenhouseID' :
                    e.editorOptions.dataSource = this.HenhouseBydataSource;
                    this.setReadOnly();
                    break;
                case 'DetailProductID' :
                    // var ProductBatchID = e.row.data['ProductBatchID'];
                    // ProductBatchID = ''
                    break;
                case 'ProductBatchID' :
                    var ProductID = e.row.data['DetailProductID'];
                    var ProductBatchID = e.row.data['ProductBatchID'];
                    var dataSource = [];
                    if (ProductID) {
                        dataSource = this.allProductBatchSource.filter((o) => o.ProductID == ProductID);
                    }
                    e.editorOptions.dataSource = Distinct(dataSource, 'ProductBatchID');
                    break;
                default:
                    break;
            }
            if (triggerValueChanged) {
                //没有这个，编辑datagrid不会激活保存按钮
                e.editorOptions.onValueChanged = (args) => {

                    if (!args.previousValue && args.previousValue != 0 && !args.value && args.value != 0) { }
                    else {
                        this.detailInstance.modifyDataStatusSet();
                        setTimeout(() => {
                            e.setValue(args.value, args.component._changedValue);
                        }, 0);
                    }
                };
            }

        }
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
                            if (row.TotalQuantity) {
                                cQuantity = Number(row.TotalQuantity);
                                f.cQuantity = Quantity - Number(row.TotalQuantity);
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
        this.formData.ProductID = '';
        let UrlParam = 'BillType=2201131629250001455&iSortPlus='+DataDictionary.iSortF+'&';

        UrlParam += 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd') + '&WarehouseID=' + this.model.conditionPanel.data.OutWarehouse + '&';
        if (this.numericalOrder) {
            UrlParam += 'NumericalOrder=' + this.numericalOrder + '&';
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
                            if (row.TotalQuantity) {
                                cQuantity = Number(row.TotalQuantity);
                                f.cQuantity = Quantity - Number(row.TotalQuantity);
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

    farConfirm() {

    }

    farCancel() {

    }

    onEditorPreparingFn2(e) {
        if (e.dataField && e.row.rowType == 'data') {
            const rowData = e.row.data;
            // let rowData2 = this.AutoDataSource.find((m) => m['RecordID'] == rowData['RecordID']);
            // if(e.dataField == 'cQuantity'){
            //     e.editorOptions.onValueChanged = (_e) => {
            //         if (this.selectedRows.indexOf(e.row.key) === -1) {
            //             this.selectedRows.push(e.row.key)
            //         }
            //         rowData2[e.dataField] = Number(_e.value);
            //         this.dataGridRef.instance.refresh();
            //     }
            // }else if (e.dataField == 'RemarksDetail') {
            //     e.editorOptions.onValueChanged = (_e) => {
            //         this.AutoDataSource.map((m) => {
            //             if (rowData.RecordID == m.RecordID) {
            //                 m['RemarksDetail'] = _e.value;
            //             }
            //         });
            //         this.dataGridRef.instance.refresh();
            //     };
            // }
        }
    }

    getSelection(type) {
        if (type == '3') {
            this.outVisible = false;
            this.AutoDataSourceFilter = [];
            return false;
        }
        setTimeout(async () => {
            this.detailInstance.dataGrid.dataGrid.instance.saveEditData();
            var selectedRowsData11 = this.dataGridRef.instance.getSelectedRowsData();
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


            let HenhouseName = '';
            if (this.formData.HenHouseID) {
                HenhouseName = this.zqHenhouseSource.filter(o => o.HenHouseID === this.formData.HenHouseID)[0].HenHouseName;
            }
            if (DataDictionary.MaterialSupplyPolicyA != this.model.conditionPanel.data['Abstract']) {
                var ids = [];
                selectedRowsData11.forEach((f) => {
                    if(ids.indexOf(f.ProductID) === -1){
                        ids.push(f.ProductID);
                    }
                });

                let UrlParam = 'DataDate=' + new DateTime(this.model.conditionPanel.data.DataDate).toString('yyyy-MM-dd')+ '&';
                UrlParam += 'ProductCollectType=' + DataDictionary.ProductCollectTypeA + '&';
                if (this.model.conditionPanel.data['YHFarmerID']) {
                    UrlParam += 'YHFarmerID=' + this.model.conditionPanel.data['YHFarmerID'] + '&';
                }
                if (this.model.conditionPanel.data.YHBatch) {
                    UrlParam += 'YHBatchID=' + this.model.conditionPanel.data.YHBatch + '&';
                }
                UrlParam += 'ProductID=' + ids.join(',') + '&';
                this.loading = true;
                await this.service.getGetUnitPrice(UrlParam).then( (res:any) => {
                    this.loading = false;
                    if(res&&res.length>0){
                        res.forEach(element => {
                            selectedRowsData11.forEach((f) => {
                                if(f.ProductID==element.ProductID){
                                    f.UnitPrice = element.UnitPrice;
                                }
                            });
                        });
                    }
                })
            }

            selectedRowsData11.forEach((f) => {
                var row = deepCopy(f);
                row[`${this.model.dataGrid.primaryKey}`] = new DateTime().randomValue.toString();
                row.target = DataStatus.newline;
                row['DetailProductID'] = f.ProductID;
                row['DetailProductName'] = f.cProductName;
                row['HenhouseID'] = this.formData.HenHouseID;
                row['HenhouseName'] = HenhouseName;
                row['SouHenhouseName'] = f.HenhouseName;
                row['SouBreedingName'] = f.BreedingName;
                let TotalQuantity = 0;
                if (f.ValueQuantity && f.ValueQuantity > 0) {
                    TotalQuantity += f.ValueQuantity
                }
                if (f.DonateQuantity && f.DonateQuantity > 0) {
                    TotalQuantity += f.DonateQuantity
                }
                row.TotalQuantity = TotalQuantity;

                if(row['ValueQuantity']&&row['UnitPrice']){
                    row['AmountTotal'] = (Number(row['ValueQuantity'])*Number(row['UnitPrice'])).toFixed(2);
                }

                row['OutHouseType'] = this.formData.OutHouseType;
                arry.push(row);
            });


            this.model.dataGrid.props.dataSource = arry;
            this.detailInstance.dataGrid.dataGrid.instance.refresh();
            this.detailInstance.modifyDataStatusSet();

            if (type == '2') {
                this.AutoDataSourceFilter = [];
                // this.clickAuto();
            }
            if (type == '1') {
                this.AutoDataSourceFilter = [];
                this.outVisible = false;
            }
            this.setReadOnly()
        },200)
    }

    onPopupHiding() {
        // this.outVisible = false;
        // this.AutoDataSourceFilter = [];
        // this.AutoDataSource = [];
    }

    handleCell(e) {
    }
    setReadOnly(){
        // var flag = false;
        // (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
        //     if((m.DetailProductID&&m.DetailProductID!="0")||(m.HenhouseID&&m.HenhouseID!="0")){
        //         flag = true;
        //         return false;
        //     }
        // })
        // if(flag){
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly = true;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly = true;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHFarmerID")[0].widget.props.readOnly = true;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "OutWarehouse")[0].widget.props.readOnly = true;
        // }
        // else{
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHBatch")[0].widget.props.readOnly = false;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "YHFarmerID")[0].widget.props.readOnly = false;
        //     this.model.conditionPanel.conditionItems.filter(q => q.dataField == "OutWarehouse")[0].widget.props.readOnly = false;
        // }
    }
    //#endregion
    //#region 初始化工具条
    init_toolbar_panel(): YhChickenReceiveDetailComponent {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;

        const add_type = new ToolbarPanelType();
        add_type.key = 'addHang';
        add_type.widget = new NxButton('批量增行');
        add_type.widget.events.onClick = this.addHang.bind(this);

        (<NxButton>this.model.toolbar.getWidgetByKey('save')).events.onClick = this.save.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('delete')).events.onClick = this.delete.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.model.toolbar.getWidgetByKey('cancel')).events.onClick = this.cancel.bind(this);
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('print')).props.visible = false;
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('messageBox')).props.visible = false;
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('filterRow')).events.onClick = this.toogleFilterRow.bind(this);
        // (<NxButton>this.model.toolbar.getOtherWidgetByKey('setting')).props.visible = true;
        // this.model.toolbar.getOtherWidgetByKey('headSetting').props.visible = true;

        this.model.toolbar.mainPanel.push(...[add_type]);
        return this;
    }
    toogleFilterRow() {
        this.detailInstance.dataGrid.toggleFilterRow()
    }
    // 批量增行
    addHang () {
        if (!this.model.conditionPanel.data.DataDate) {
            return Notify.toast('请选择日期', NotifyType.Error);
        }

        if (!this.model.conditionPanel.data.OutWarehouse) {
            return Notify.toast('请选择出库仓库', NotifyType.Error);
        }

        this.outVisible = true;

    }
    create() {
        this.model.conditionPanel.data = {};
        this.detailInstance.cacheSearchData = {};
        this.model.conditionPanel.data['DataDate'] = new Date();
        this.model.conditionPanel.data['DaysOld'] = 1;
        this.model.conditionPanel.data['YHBatch'] = null;
        this.model.conditionPanel.data['YHFarmerID'] = null;
        this.model.conditionPanel.data['isbegin'] = false;
        this.model.conditionPanel.data['ConfirmStatus'] = 0;
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
            this.detailInstance.createDataStatus();
            this.setReadOnly();
        }, 20);
    }
    save() {
        if (this.model.conditionPanel.data['Abstract'] == DataDictionary.MaterialSupplyPolicyA && (!this.model.conditionPanel.data['InWarehouse'] || this.model.conditionPanel.data['InWarehouse']=="0")) {
            return Notify.toast('养殖场仓库不能为空，请先在养殖场设置中设置该养殖场的存栏仓库! ', NotifyType.Error);
        }
        let flag = true;
        let ProductName = '';
        let MeasureUnitNameArrL:any = ['只','羽','个'];
        (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
            if (m.MeasureUnitName && MeasureUnitNameArrL.indexOf(m.MeasureUnitName) == -1) {
                flag = false;
                ProductName = m.DetailProductName
            }
        });
        if (!flag) {
            return Notify.toast(`${ProductName}商品代号的计量单位设置错误，保存失败（请修改为只/羽/个）！`, NotifyType.Error);
        }
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
                        const data = this.getSaveData(value);
                        if (data) {
                            this.service.update(data).then((result: Result) => {
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
            ['DetailProductID', this.translator.I18N.YhChickenReceiveDetail.ProductName.required],
            ['TotalQuantity', this.translator.I18N.YhChickenReceiveDetail.TotalQuantity.message],
            ['UnitPrice', this.translator.I18N.YhChickenReceiveDetail.UnitPrice.message],
            ['AmountTotal', this.translator.I18N.YhChickenReceiveDetail.AmountTotal.message],
        ]);
        return validator.validation;
    }
    private getSaveData(value) {
        if (this.model.conditionPanel.data.DaysOld < 0) {
            Notify.toast('日龄＜0，保存失败。请检查日期！', NotifyType.Error);
            this.detailInstance.saveDataError();
            return;
        }

        if (!value.header.SourceType || value.header.SourceType=="0") {
            Notify.toast(this.translator.I18N.YhChickenReceive.SourceType.requiredMessage, NotifyType.Error);
            this.detailInstance.saveDataError();
            return;
        }

        const validation = this.dataValidation(value.body);
        if (validation) {
            let saveData = new YhChickenReceiveAdd();
            const date = new DateTime(value.header.DataDate.toString()).toString('yyyy-MM-dd');
            saveData.DataDate = date;
            saveData.NumericalOrder = value.header.NumericalOrder || '0';
            saveData.ChickenFarmID = value.header.ChickenFarmID || '0';
            saveData.YHFarmerID = value.header.YHFarmerID || '0';
            saveData.YHBatch = value.header.YHBatch || '0';
            saveData.Abstract = value.header.Abstract || "0";
            saveData.OutWarehouse = value.header.OutWarehouse || "0";
            saveData.InWarehouse = value.header.InWarehouse || '0';
            saveData.ProductID = value.header.ProductID || '0';
            saveData.SourceType = value.header.SourceType || '0';
            saveData.Remarks = value.header.Remarks || '';
            saveData.DaysOld  = value.header.DaysOld || 0;
            saveData.Driver = value.header.Driver || '0';
            saveData.SupplierID = value.header.SupplierID || '0';
            saveData.ConfirmStatus = value.header.ConfirmStatus;
            saveData.BreedingID = value.header.BreedingID || '0';
            saveData.ChickenType = value.header.ChickenType || '0';
            saveData.ComboPack = value.header.ComboPack || DataDictionary.ComboPackA;
            saveData.isbegin = value.header.isbegin || false;
            if (value.header.Number) {
                saveData.Number  = value.header.Number;
            }
            value.body.map((m) => {
                saveData.YHChickenReceiveDetailDto.push({
                    NumericalOrder: m.NumericalOrder || '0',
                    NumericalOrderDetail: m.NumericalOrderDetail || '0',
                    Remarks: m.DetailRemarks || '',
                    HenhouseID: m.HenhouseID || '0',
                    ProductID: m.DetailProductID,
                    ProductName: m.DetailProductName,
                    ProductBatchID: m.ProductBatchID || '0',
                    ValueQuantity: m.ValueQuantity || 0,
                    MeasureUnitName: m.MeasureUnitName || '',
                    UnitPrice: Number(m.UnitPrice),
                    AmountTotal: Number(m.AmountTotal),
                    DonateQuantity: m.DonateQuantity || 0,
                    TotalQuantity: Number(m.TotalQuantity),
                    Gift: m.Gift || false,
                    BreedingID: m.BreedingID || '0',
                    Target: m.target,
                });
            });
            if (this.detailInstance.$open == FormOptions.$modify) {
                saveData.YHChickenReceiveDetailDto.push(...value.deleted);
            }
            return saveData;
        } else {
            this.detailInstance.saveDataError();
        }
        return null;
    }

    HenhouseValueChanged() {
        // var DataDate = Date.parse(this.model.conditionPanel.data['DataDate']);
        // var YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
        // var ChickenFarmID = this.model.conditionPanel.data['ChickenFarmID'];
        // var dataSource = [];
        // if (DataDate && YHFarmerID && ChickenFarmID) {
        //     dataSource = this.HenhouseSourceall.filter((o) => (DataDate >= Date.parse(o.StartDate) && DataDate <= Date.parse(o.EndDate)) && o.YHFarmerID == YHFarmerID && o.ChickenFarmID == ChickenFarmID);
        // }
        // (<Array<any>>this.model.dataGrid.props.dataSource).map((m) => {
        //     if (m.HenhouseID) {
        //         let obj = this.HenhouseBydataSource.filter((o) => o.HenhouseID == m.HenhouseID);
        //         if (obj.length == 0) {
        //             // this.modifyVisible = true;
        //             m['HenhouseID'] = '';
        //             m['HenhouseName'] = '';
        //         }
        //     }
        // });
        this.getHenhouse();
        // this.detailInstance.resetDataStatus()
    }

    getHenhouse() {
        let DataDate = this.model.conditionPanel.data['DataDate'];
        let ChickenFarmID = this.model.conditionPanel.data['ChickenFarmID'];
        let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
        let page = '';
        if (DataDate) {
            page += `DataDate=${new DateTime(DataDate).toString('yyyy-MM-dd')}&`
        }
        if (YHFarmerID && YHFarmerID != '0') {
            page += `YHFarmerID=${YHFarmerID}&`
        }
        if (ChickenFarmID && ChickenFarmID != '0') {
            page += `ChickenFarmID=${ChickenFarmID}&`
        }

        if (ChickenFarmID && ChickenFarmID != '0') {
            this.service.getHenhouseByParam(page).then((res:any) => {
                this.HenhouseBydataSource = res;
            })
        }

    }

    typeChickenReceiveByYhBatchID(value) {
        let page = `YHBatch=${value}&`;
        if (this.numericalOrder) {
            page += `NumericalOrder=${this.numericalOrder}`
        }
        this.service.getChickenReceiveByYhBatchID(page).then((res:any) => {
            if (res.length > 0) {
                //不能
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "ProductID")[0].widget.props.readOnly = true;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "BreedingID")[0].widget.props.readOnly = true;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "ChickenType")[0].widget.props.readOnly = true;
            } else {
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "ProductID")[0].widget.props.readOnly = false;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "BreedingID")[0].widget.props.readOnly = false;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "ChickenType")[0].widget.props.readOnly = false;
            }
        })
    }
    //#endregion

    //#region  表头配置
    init_table_header(): YhChickenReceiveDetailComponent {
        this.model.conditionPanel.default = false;
        this.model.conditionPanel.data = {};

        const condition_ChickenFarmID = new NxConditionItem();
        condition_ChickenFarmID.required = false;
        condition_ChickenFarmID.requiredDisable = true;
        condition_ChickenFarmID.label = '养殖场';
        condition_ChickenFarmID.dataField = 'ChickenFarmID';
        condition_ChickenFarmID.type = 'SelectBox';
        condition_ChickenFarmID.widget = new NxSelectBox();
        condition_ChickenFarmID.widget.events.onValueChanged = this.getHenhouse.bind(this);
        condition_ChickenFarmID.widget.props.showClearButton = false;
        condition_ChickenFarmID.widget.props.readOnly = true;
        condition_ChickenFarmID.widget.props.dataSource = this.basicSettingODataContext.getBizChickenFarmDataSource({
            filter: CHICKEN_FARM_CONTEXT.ChickenFarmFilterCondition,
            select: ['ChickenFarmID', 'ChickenFarmName'],
        });
        condition_ChickenFarmID.widget.props.valueExpr = 'ChickenFarmID';
        condition_ChickenFarmID.widget.props.displayExpr = 'ChickenFarmName';
        //日期
        const condition_date = new NxConditionItem();
        condition_date.required = true;
        condition_date.label = this.translator.I18N.YhChickenReceive.DataDate.text;
        condition_date.type = 'DateBox';
        condition_date.dataField = 'DataDate';
        condition_date.requiredDisable = true;
        condition_date.widget = new NxDateBox();
        condition_date.widget.props.disabled = false;
        condition_date.widget.props.readOnly = false;
        condition_date.widget.events.onValueChanged = this.updateDaysOld.bind(this);
        condition_date.widget.props.dateSerializationFormat = 'yyyy-MM-dd';
        condition_date.widget.props.type = 'date';
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 3);
        condition_date.widget.props.max = maxDate;


        // 养户名称
        const condition_YHFarmerID = new NxConditionItem();
        condition_YHFarmerID.label = this.translator.I18N.YhMaterialReceive.YHFarmerID.text;
        condition_YHFarmerID.required = true;
        condition_YHFarmerID.dataField = 'YHFarmerID';
        condition_YHFarmerID.type = 'SelectBox';
        condition_YHFarmerID.requiredDisable = true;
        condition_YHFarmerID.widget = new NxSelectBox();
        // condition_YHFarmerID.widget.props.showClearButton = true;
        condition_YHFarmerID.widget.events.onValueChanged = this.onChickenFarmChange.bind(this);
        condition_YHFarmerID.widget.props.dataSource = this.YHBasicSettingODataContext.getYHFarmerInfoDataSource()
        condition_YHFarmerID.widget.props.valueExpr = 'YHFarmerID';
        condition_YHFarmerID.widget.props.displayExpr = 'YHFarmerName';
        condition_YHFarmerID.widget.props.searchExpr = ['YHFarmerID','YHFarmerName','Phone','YHPersonName','MnemonicCode']

        //养户批次
        const condition_YHBatch = new NxConditionItem();
        condition_YHBatch.label = this.translator.I18N.YhChickenReceive.YHBatch.text;
        condition_YHBatch.required = true;
        condition_YHBatch.dataField = 'YHBatch';
        condition_YHBatch.type = 'SelectBox';
        condition_YHBatch.requiredDisable = true;
        condition_YHBatch.widget = new NxSelectBox();
        // condition_YHBatch.widget.props.showClearButton = false;
        condition_YHBatch.widget.props.dataSource = this.YHBasicSettingODataContext.getYHBatchDataSource();
        condition_YHBatch.widget.props.valueExpr = 'YHBatchID';
        condition_YHBatch.widget.props.displayExpr = 'YHBatchName';
        condition_YHBatch.widget.props.searchExpr = ['YHBatchName','MnemonicCode']
        condition_YHBatch.widget.props.readOnly = false;
        condition_YHBatch.widget.props.placeholder = '请先选养户';
        condition_YHBatch.widget.events.onOpened = (e) => {
            let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
            let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
            if(YHFarmerID){
                let filter = [['TransferDate', '<=', new Date(new Date(new Date(DataDate).getTime()).toLocaleDateString())],['Status', '=', true],['YHFarmerID','=',YHFarmerID]];
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter,
                    select: ['YHBatchID', 'YHBatchName','MnemonicCode'],
                }));
            }else{
                e.component.option('dataSource',this.YHBasicSettingODataContext.getYHBatchDataSource({
                    select: ['YHBatchID', 'YHBatchName','MnemonicCode'],
                }));
            }

        }
        condition_YHBatch.widget.events.onValueChanged = (value) => {
            if (value) {
                this.typeChickenReceiveByYhBatchID(value)
                let filter = [['YHBatchID', '=', value]];
                new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
                    filter: filter
                })).load().then((res:any) => {
                    if(res&&res.length>0){
                        this.YHFarmerContract = res[0].YHFarmerContract;
                        this.model.conditionPanel.data['Abstract'] = res[0].ChickAbstract;
                        this.model.conditionPanel.data['ProductID'] = res[0].ProductID;
                        this.model.conditionPanel.data['BreedingID'] = res[0].BreedingID;
                        this.model.conditionPanel.data['ChickenType'] = res[0].ChickenType;
                        this.model.conditionPanel.data['ChickenFarmID'] = res[0].ChickenFarmID;
                        this.getHenhouse();
                        if (res[0].ChickAbstract == DataDictionary.MaterialSupplyPolicyA) {
                            let list = this.ChickenFarmDataSource.filter(o => o.ChickenFarmID === res[0].ChickenFarmID)[0];
                            if (list) {
                                this.model.conditionPanel.data['InWarehouse'] = list.NWarehouseID;
                            }
                        } else {
                            this.model.conditionPanel.data['InWarehouse'] = '';
                        }
                    }
                })
            }
        }
        const condition_SupplierName = new NxConditionItem();
        condition_SupplierName.label = this.translator.I18N.YhChickenReceive.SupplierID.text;
        condition_SupplierName.type = 'SelectBox';
        condition_SupplierName.dataField = 'SupplierID';
        condition_SupplierName.widget = new NxSelectBox();
        condition_SupplierName.widget.props.showClearButton = false;
        condition_SupplierName.widget.props.disabled = false;
        condition_SupplierName.widget.props.readOnly = false;
        condition_SupplierName.widget.props.dataSource = this.qlwCustomerContext.getSupplierDataSource({
            filter: [['IsUse', '=', true]],
        });
        condition_SupplierName.widget.props.valueExpr = 'SupplierId';
        condition_SupplierName.widget.props.displayExpr = 'SupplierName';
        condition_SupplierName.widget.props.searchExpr = ['SupplierName','MnemonicCode']

        const condition_Abstract = new NxConditionItem();
        condition_Abstract.label = '摘要';
        condition_Abstract.type = 'SelectBox';
        condition_Abstract.dataField = 'Abstract';
        condition_Abstract.requiredDisable = true;
        condition_Abstract.widget = new NxSelectBox();
        condition_Abstract.widget.props.showClearButton = false;
        condition_Abstract.widget.props.disabled = false;
        condition_Abstract.widget.props.readOnly = true;
        condition_Abstract.widget.props.dataSource = DataDictionarySource.MaterialSupplyPolicySource
        condition_Abstract.widget.props.valueExpr = 'MaterialSupplyPolicy';
        condition_Abstract.widget.props.displayExpr = 'MaterialSupplyPolicyName';
        //总部仓库
        const condition_OutWarehouse = new NxConditionItem();
        condition_OutWarehouse.label =  this.translator.I18N.YhChickenReceive.OutWarehouse.text;
        condition_OutWarehouse.required = true;
        condition_OutWarehouse.type = 'SelectBox';
        condition_OutWarehouse.dataField = 'OutWarehouse';
        condition_OutWarehouse.requiredDisable = true;
        condition_OutWarehouse.widget = new NxSelectBox();
        condition_OutWarehouse.widget.props.showClearButton = false;
        condition_OutWarehouse.widget.props.disabled = false;
        condition_OutWarehouse.widget.props.dataSource = this.basicSettingODataContext.getWareHouseDataSource({
            select: ['WarehouseID', 'WarehouseName'],
        });
        condition_OutWarehouse.widget.props.valueExpr = 'WarehouseID';
        condition_OutWarehouse.widget.props.displayExpr = 'WarehouseName';
        //养殖场仓库
        const condition_InWarehouse = new NxConditionItem();
        condition_InWarehouse.label =  this.translator.I18N.YhChickenReceive.WarehouseID.text;
        condition_InWarehouse.required = false;
        condition_InWarehouse.type = 'SelectBox';
        condition_InWarehouse.dataField = 'InWarehouse';
        condition_InWarehouse.requiredDisable = true;
        condition_InWarehouse.widget = new NxSelectBox();
        condition_InWarehouse.widget.props.showClearButton = false;
        condition_InWarehouse.widget.props.disabled = false;
        condition_InWarehouse.widget.props.readOnly = true;
        condition_InWarehouse.widget.props.dataSource = this.basicSettingODataContext.getWareHouseDataSource({
            select: ['WarehouseID', 'WarehouseName'],
        });
        condition_InWarehouse.widget.props.valueExpr = 'WarehouseID';
        condition_InWarehouse.widget.props.displayExpr = 'WarehouseName';


        const condition_ProductID = new NxConditionItem();
        condition_ProductID.label =  '批次商品代号';
        condition_ProductID.required = true;
        condition_ProductID.type = 'SelectBox';
        condition_ProductID.dataField = 'ProductID';
        condition_ProductID.requiredDisable = true;
        condition_ProductID.widget = new NxSelectBox();
        condition_ProductID.widget.props.showClearButton = false;
        condition_ProductID.widget.props.disabled = false;
        condition_ProductID.widget.props.dataSource = this.basicSettingODataContext.getBizProductannexedDataSource({
            filter: [
                ['iSortPlus', '=', DataDictionary.iSortF],
            ],
            select: ['ProductID', 'cProductName'],
        });
        condition_ProductID.widget.props.valueExpr = 'ProductID';
        condition_ProductID.widget.props.displayExpr = 'cProductName';

        //品种
        const condition_BreedName = new NxConditionItem(this.translator.I18N.YhChickenReceive.BreedName.text, 'BreedingID', 'TextBox', false);
        condition_BreedName.headVisible = true;
        condition_BreedName.type = 'SelectBox';
        condition_BreedName.widget = new NxSelectBox();
        condition_BreedName.widget.props.showClearButton = false;
        condition_BreedName.widget.props.disabled = false;
        condition_BreedName.widget.props.readOnly = false;
        condition_BreedName.widget.props.dataSource = this.basicSettingODataContext.getZqBreedingsetDataSource({
            select: ['BreedingID', 'BreedingName'],
        });
        condition_BreedName.widget.props.valueExpr = 'BreedingID';
        condition_BreedName.widget.props.displayExpr = 'BreedingName';
        condition_BreedName.widget.props.searchExpr= ['BreedingName','MnemonicCode'];

        //家禽类型
        const condition_ChickenType = new NxConditionItem(this.translator.I18N.YhChickenReceive.ChickenType.text, 'ChickenType', 'TextBox', false);
        condition_ChickenType.headVisible = true;
        condition_ChickenType.type = 'SelectBox';
        condition_ChickenType.widget = new NxSelectBox();
        condition_ChickenType.widget.props.showClearButton = false;
        condition_ChickenType.widget.props.disabled = false;
        condition_ChickenType.widget.props.readOnly = false;
        condition_ChickenType.widget.props.dataSource = this.basicSettingODataContext.getBizRemindGroupDataSource({
            filter: [
                [ 'PID', '=', DataDictionary.ChickenType ],
                [ 'Status', '=', true ]
            ],
            select: ['RemindID', 'RemindName'],
        })
        condition_ChickenType.widget.props.valueExpr = 'RemindID';
        condition_ChickenType.widget.props.displayExpr = 'RemindName';
        // condition_BreedName.widget.props.readOnly = true;

        //日龄
        const condition_DaysOld = new NxConditionItem(this.translator.I18N.YhChickenReceive.DaysOld.text, 'DaysOld', 'TextBox', false);
        condition_DaysOld.required = true;
        condition_DaysOld.headVisible = true;
        condition_DaysOld.widget = new NxTextBox();
        condition_DaysOld.widget.props.showClearButton = false;
        // condition_DaysOld.widget.props.readOnly = true;

        const condition_Driver = new NxConditionItem();
        condition_Driver.label = '司机';
        condition_Driver.requiredDisable = true;
        condition_Driver.type = 'SelectBox';
        condition_Driver.dataField = 'Driver';
        condition_Driver.widget = new NxSelectBox();
        condition_Driver.widget.props.showClearButton = true;
        condition_Driver.widget.props.disabled = false;
        condition_Driver.widget.props.dataSource = this.qlwOdataContext.getQlWPersonOData({
            select: ['UserID', 'PersonName'],
        });
        condition_Driver.widget.props.valueExpr = 'UserID';
        condition_Driver.widget.props.displayExpr = 'PersonName';

        const condition_ConfirmStatus = new NxConditionItem();
        condition_ConfirmStatus.label = '养户确认';
        condition_ConfirmStatus.required = false;
        condition_ConfirmStatus.requiredDisable = true;
        condition_ConfirmStatus.type = 'SelectBox';
        condition_ConfirmStatus.dataField = 'ConfirmStatus';
        condition_ConfirmStatus.widget = new NxSelectBox();
        condition_ConfirmStatus.widget.props.showClearButton = false;
        condition_ConfirmStatus.widget.props.disabled = false;
        condition_ConfirmStatus.widget.props.readOnly = true;
        condition_ConfirmStatus.widget.props.dataSource = DataDictionarySource.ConfirmStatusSource;
        condition_ConfirmStatus.widget.props.valueExpr = 'value';
        condition_ConfirmStatus.widget.props.displayExpr = 'name';

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

        //是否期初
        const condition_isbegin = new NxConditionItem();
        condition_isbegin.label =  this.translator.I18N.YhChickenReceive.isbegin.text;
        condition_isbegin.required = false;
        condition_isbegin.type = 'SelectBox';
        condition_isbegin.dataField = 'isbegin';
        condition_isbegin.requiredDisable = false;
        condition_isbegin.widget = new NxSelectBox();
        condition_isbegin.widget.props.showClearButton = false;
        condition_isbegin.widget.props.dataSource = this.StatusODataContext.getEggsIsShiftTrayDataSource();
        condition_isbegin.widget.props.valueExpr = 'value';
        condition_isbegin.widget.props.displayExpr = 'name';

        const condition_SourceType = new NxConditionItem();
        condition_SourceType.label =  this.translator.I18N.YhChickenReceive.SourceType.text;
        condition_SourceType.required = true;
        condition_SourceType.type = 'SelectBox';
        condition_SourceType.dataField = 'SourceType';
        condition_SourceType.requiredDisable = true;
        condition_SourceType.widget = new NxSelectBox();
        condition_SourceType.widget.props.showClearButton = false;
        condition_SourceType.widget.props.disabled = false;
        condition_SourceType.widget.props.dataSource = this.basicSettingODataContext.getBizDataDictDataSource({
            filter: [['Pid', '=', "2202371543490000055"]],
            select: ['DictId','DictName']
        });
        condition_SourceType.widget.props.valueExpr = 'DictId';
        condition_SourceType.widget.props.displayExpr = 'DictName';


        this.model.conditionPanel.conditionItems.push(
            ...[
                condition_date,
                condition_OutWarehouse,
                condition_YHFarmerID,
                condition_YHBatch,
                condition_ProductID,
                condition_DaysOld,
                condition_BreedName,
                condition_ChickenType,
                condition_SourceType,
                condition_SupplierName,
                condition_Driver,
                condition_isbegin,
                condition_ChickenFarmID,
                condition_InWarehouse,
                condition_ConfirmStatus,
                condition_Abstract,
                condition_number,
            ]
        );
        return this;
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

        this.model.conditionPanel.data['YHBatch'] = null;
        this.model.conditionPanel.data['Abstract'] = '';
        this.model.conditionPanel.data['ProductID'] = '';
        this.model.conditionPanel.data['BreedingID'] = '';
        this.model.conditionPanel.data['ChickenType'] = '';
        this.model.conditionPanel.data['ChickenFarmID'] = '';
        this.model.conditionPanel.data['InWarehouse'] = '';
        let DataDate = new DateTime(this.model.conditionPanel.data['DataDate']).toString('yyyy-MM-dd');
        let YHFarmerID = this.model.conditionPanel.data['YHFarmerID'];
        let filter = [['DataDate', '<=', new Date(new Date(new Date(DataDate).getTime()).toLocaleDateString())],['Status', '=', true],["YHFarmerID",'=',YHFarmerID]];
        new DataSource(this.YHBasicSettingODataContext.getYHBatchDataSource({
            filter: filter
        })).load().then((res:any) => {
            if(res&&res.length>0){
                if(res.length==1){
                    this.model.conditionPanel.data['YHBatch'] = res[0].YHBatchID;
                }else{
                    this.HenhouseBydataSource = [];
                    let datas = res.filter((m) => m.YHBatchID == this.model.conditionPanel.data['YHBatch']);
                    if(datas==null || datas.length==0){

                    }
                }
            }else{
                this.HenhouseBydataSource = [];
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
         this.getHenhouse();
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
        this.setReadOnly();
    }
    queryDetail(){
        this.service
            .getCustomDataSourceById(this.numericalOrder)
            .load()
            .then((value: Array<any>) => {
                this.editFlag = true;
                this.model.dataGrid.props.dataSource = value;

                this.model.conditionPanel.data = deepCopy(value[0]);
                this.model.conditionPanel.data['ConfirmStatus'] = value[0].ConfirmStatus ? 1 : 0;
                this.detailInstance.cacheSearchData = deepCopy(value[0]);
                this.model.dataGrid.props.dataSource.map((m) => (
                    m.target = DataStatus.none,
                    m['ProductID'] = m.DetailProductID
                ));
                this.detailInstance.cacheBodyData = deepCopy(value);
                //开启审核功能
                this.model.review.visible = true;
                this.model.review.numericalOrder = this.numericalOrder;
                // this.qlwOdataContext.personODataStore
                // .byKey(value[0].OwnerID)
                // .then((value) => {
                //     if(value&&value.length>0&&value[0].PersonName){
                //         this.model.review.ownerName = value[0].PersonName;
                //     }
                // });
                this.model.review.ownerName = value[0].CreatedOwnerName;
                this.typeChickenReceiveByYhBatchID(value[0].YHBatch);
                this.setReadOnly();
                this.getHenhouse();
                setTimeout(() => {
                    this.detailInstance.saveDataAfterStatus();
                    this.editFlag = false;
                    if (value[0].ChickenSource==DataDictionary.ChickenSourceA) {
                        this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = true;
                    }else{
                        this.model.conditionPanel.conditionItems.filter(q => q.dataField == "DataDate")[0].widget.props.readOnly  = false;
                    }
                }, 200);
            });
    }
    //#region 初始化数据源
    initialization(e: NxZlwFormDetailComponent) {

        this.service.getClosedInTheCurrent().then((res)=>{
            if(res){
                // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.visible  = false;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.disabled  = true;
            }else{
                // this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.visible  = true;
                this.model.conditionPanel.conditionItems.filter(q => q.dataField == "isbegin")[0].widget.props.disabled  = false;
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
        if (e.status) {
            if (!this.numericalOrder) {
                Notify.error('未完成单据不支持打印！');
                return
            }
            var tabid1 = [];
            this.detailInstance.dataGrid.dataGrid.instance.getVisibleRows().map((m: any, index) => {
                var obj = {
                    XuHao: index + 1,
                    DetailProductName: m.data.DetailProductName,
                    ProductBatchName:m.data.ProductBatchName,
                    ValueQuantity:m.data.ValueQuantity,
                    MeasureUnitName:m.data.MeasureUnitName,
                    UnitPrice:m.data.UnitPrice,
                    AmountTotal:m.data.AmountTotal,
                    DonateQuantity:m.data.DonateQuantity,
                    TotalQuantity:m.data.TotalQuantity,
                    HenhouseName:m.data.HenhouseName,
                    Gift:m.data.Gift?'是':'否',
                    DetailRemarks:m.data.DetailRemarks,
                    HatchBatchName:m.data.HatchBatchName,
                    FarmName:m.data.FarmName,
                    SouHenhouseName:m.data.SouHenhouseName,
                    BatchName:m.data.BatchName,
                    SouBreedingName:m.data.SouBreedingName,
                    DebeakingName:m.data.DebeakingName,
                    ImmuneSubjectName:m.data.ImmuneSubjectName,
                    BatchRemarks:m.data.BatchRemarks,
                };
                tabid1.push(obj);
            });
            var tabId0 = {
                //日期
                DataDate: new DateTime(this.model.conditionPanel.data['DataDate']).toString(),
                //仓库
                OutWarehouseName:  this.model.conditionPanel.data['OutWarehouseName'] == undefined ? '': this.model.conditionPanel.data['OutWarehouseName'],
                //养户
                YHFarmerName:  this.model.conditionPanel.data['YHFarmerName'] == undefined ? '': this.model.conditionPanel.data['YHFarmerName'],
                //批次
                YHBatchName:  this.model.conditionPanel.data['YHBatchName'] == undefined ? '': this.model.conditionPanel.data['YHBatchName'],
                //批次商品代号
                ProductName:this.model.conditionPanel.data['ProductName'] == undefined ? '': this.model.conditionPanel.data['ProductName'],
                //领苗日龄
                DaysOld:this.model.conditionPanel.data['DaysOld'] == undefined ? '': this.model.conditionPanel.data['DaysOld'],
                //品种
                BreedingName:this.model.conditionPanel.data['BreedingName'] == undefined ? '': this.model.conditionPanel.data['BreedingName'],
                //家禽类型
                ChickenTypeName:this.model.conditionPanel.data['ChickenTypeName'] == undefined ? '': this.model.conditionPanel.data['ChickenTypeName'],
                //苗源类型
                SourceTypeName:this.model.conditionPanel.data['SourceTypeName'] == undefined ? '': this.model.conditionPanel.data['SourceTypeName'],
                //苗供应商
                SupplierName:this.model.conditionPanel.data['SupplierName'] == undefined ? '': this.model.conditionPanel.data['SupplierName'],
                //司机
                DriverName:this.model.conditionPanel.data['DriverName'] == undefined ? '': this.model.conditionPanel.data['DriverName'],
                //摘要
                AbstractName:this.model.conditionPanel.data['AbstractName'] == undefined ? '': this.model.conditionPanel.data['AbstractName'],
                //养殖场
                ChickenFarmName:this.model.conditionPanel.data['ChickenFarmName'] == undefined ? '': this.model.conditionPanel.data['ChickenFarmName'],
                //入库仓库
                InWarehouseName:this.model.conditionPanel.data['InWarehouseName'] == undefined ? '': this.model.conditionPanel.data['InWarehouseName'],
                //期初
                isbegin:this.model.conditionPanel.data['isbegin'] == false ? '否': '是',
                //养户确认
                ConfirmStatus:this.model.conditionPanel.data['ConfirmStatus'] == false ?'否': '是',
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
            };
            let sources = {
                tabId0: tabId0,
                tabId1: tabid1,
            };
            var direct =false;
            if (e.isDirect) {
                direct = true;
            }
            this._printPage.instance.printGeneration(sources, false, false, null, { isDirect: direct,});
        }
    }
}
