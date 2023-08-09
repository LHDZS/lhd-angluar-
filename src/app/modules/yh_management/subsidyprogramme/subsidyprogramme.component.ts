import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SubsidyProgrammeService } from './subsidyprogramme.service';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { HttpClient } from '@angular/common/http';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { Notify, NotifyType, MessageBox } from 'src/app/providers/notify';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import { NxToolbarPanel, ColumnSetting } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { BasicSettingODataContext } from 'src/app/providers/odataContext';
import { NxButton } from 'src/app/components/component-model/button/model';
import { FormOptions, DataDictionary, DataDictionarySource } from 'src/app/providers/enums';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { SubsidyProgrammeModel } from './subsidyprogramme.model';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { DateTime } from 'src/app/providers/common/datetime';
import { RegExps } from 'src/app/providers/regexp';
import { TokenAuthService } from 'src/app/shared/services';
import { NxSearchPanel, NxConditionItem } from 'src/app/components/header-search-panel/header-search-panel-extend';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { FormulaComputingComponent } from 'src/app/components/formula-computing/formula-computing.component';
import ArrayStore from 'devextreme/data/array_store';
import { groupBy } from 'src/app/providers/groupby';

@Component({
    selector: 'app-strain-line',
    templateUrl: './subsidyprogramme.component.html',
    styleUrls: ['./subsidyprogramme.component.css'],
    providers: [SubsidyProgrammeService],
})
export class SubsidyProgrammeComponent {
    DescendantManagementSource: any = [];
    datasource: any = null;
    model: NxDataGrid = new NxDataGrid();
    toolbarPanelModel: NxToolbarPanel = new NxToolbarPanel('list');
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    dataSource: DataSource;
    @ViewChild('formListInstance', { static: false })
    formListInstance: NxFormListComponent;
    @ViewChild('toolbarPanel', { static: false })
    toolbarInstance: NxToolbarPanelComponent;
    @ViewChild('form', { static: false })
    formInstance: DxFormComponent;
    popupVisible: boolean = false;
    submitOption: any;
    personSource: any;
    subsidyTypeSource: any;
    formData: any = {};
    calculatorParams: any = {};
    $option: FormOptions = FormOptions.$create;
    currentDate: Date = new Date();
    saveDisabled: boolean = false;
    visible: boolean = false;
    title: string;
    limitCharacter = RegExps.Forbidcharacter;
    limitNumberCharacter = RegExps.IntNumber;
    limitNumber2Character = RegExps.AllNumber4;
    limitNumber3Character= RegExps.AllNumber;
    @ViewChild('formulaComputing', { static: false })
    formulaComputing: FormulaComputingComponent;
    ExpType: number = 0;
    Expression: string = "";
    statusSource: any = [
        { fieldName: '启用', fieldType: 1 },
        { fieldName: '禁用', fieldType: 2 },
    ];
    fieldsSource: any = [];
    fieldsSource2: any = [];
    constructor(
        private service: SubsidyProgrammeService,
        private basicSettingODataContext: BasicSettingODataContext,
        private tokenService: TokenAuthService,
        private translator: TranslateService,
        public changeDetectorRef: ChangeDetectorRef
    ) {
        this.submitOption = {
            text: this.translator.I18N.commandOptions.save.text,
            type: 'default',
            onClick: this.onFormSubmit.bind(this),
            disabled: false,
        };

        this.subsidyTypeSource = this.basicSettingODataContext.getBizDataDictDataSource({
            filter: [['pid', '=', "2201051734480004380"]],
            select: ['DictId', 'DictName'],
        });

        this.fieldsSource2 = new DataSource({
            store: new ArrayStore({
              data: DataDictionarySource.fieldsSource,
              key: 'fieldText',
            }),
            group: 'Category',
        });
        let _groupBy = groupBy(DataDictionarySource.fieldsSource, (item) => {
            return item.Category;
        });
        _groupBy.forEach(g => {
            this.fieldsSource.push({
                fieldText: g[0].Category,
                children : g
            })
        });
        this.init_data_grid();
        this.init_toolbar();
        this.init_search_panel();
        var _this = this;
        //在页面初始化的时候监听message事件
        window.parent.addEventListener('message',(obj) => {
            let data = obj.data;
            if (data && data.calculatorParams) {
                //反序列化组件返回值，返回参数详见下表
                let { calculatorParams, closeIframe } = data;
                _this.calculatorParams = JSON.parse(calculatorParams);
                _this.Expression = _this.calculatorParams.script;
                _this.formData.Expression = _this.calculatorParams.script;
                if (closeIframe) {
                    _this.sureFormula("");
                }
            }
        },false);
    }
    //#region [初始化列表配置]
    init_data_grid() {
        this.model.primaryKey = 'YHSubsidyID';
        this.model.export.fileName = `补扣项目设置-${new DateTime().toString()}`;
        this.model.props.columnAutoWidth = true;
        this.model.columns.push(...this.columns);
        this.datasource = this.service.getDataSource();
        this.model.props.dataSource = this.datasource;
        this.model.events.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.model.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.model.commandColumn.editButton.onClick = this.edit.bind(this);
        this.model.events.onRowDblClick = this.edit.bind(this);
        this.model.stateStoring.enabled = true;
        this.model.stateStoring.storageKey = 'subsidyprogramme-storage';
    }
    get columns() {

        const col_YHSubsidyName = new NxDataGridColumn("项目名称", 'YHSubsidyName');
        col_YHSubsidyName.props.allowHeaderFiltering = false;
        col_YHSubsidyName.props.allowFiltering = true;
        col_YHSubsidyName.props.filterOperations = ['contains'];

        const col_YhSubsidyCode = new NxDataGridColumn("项目编码", 'YhSubsidyCode');
        col_YhSubsidyCode.props.sortOrder = 'desc';
        col_YhSubsidyCode.props.allowHeaderFiltering = false;
        col_YhSubsidyCode.props.allowFiltering = true;
        col_YhSubsidyCode.props.filterOperations = ['contains'];

        const col_YhSubsidyType = new NxDataGridColumn("补扣类型",'YhSubsidyType','string');
        col_YhSubsidyType.props.allowHeaderFiltering = false;
        col_YhSubsidyType.props.lookup.enabled = true;
        col_YhSubsidyType.props.allowSorting = false;
        col_YhSubsidyType.props.lookup.dataSource = this.subsidyTypeSource;
        col_YhSubsidyType.props.lookup.valueExpr = 'DictId';
        col_YhSubsidyType.props.lookup.displayExpr = 'DictName';

        const col_ExpType = new NxDataGridColumn("公式类型", 'ExpType');
        col_ExpType.props.allowHeaderFiltering = false;
        col_ExpType.props.allowFiltering = true;
        col_ExpType.props.filterOperations = ['contains'];
        col_ExpType.props.calculateDisplayValue = (row) => {
            return row.ExpType==1?"指标系数":row.ExpType==2?"固定金额":"自定义公式";
        };

        const col_Expression = new NxDataGridColumn("计算公式", 'Expression');
        col_Expression.props.allowHeaderFiltering = false;
        col_Expression.props.allowFiltering = true;
        col_Expression.props.filterOperations = ['contains'];
        col_Expression.props.calculateDisplayValue = (row) => {
            return row.ExpType==1?"["+row.Indicator+"]"+"*"+row.Factor:row.ExpType==2?row.Amount:row.Expression;
        };

        const col_AllowAdjust = new NxDataGridColumn("允许调整", 'AllowAdjust');
        col_AllowAdjust.props.falseText = "禁止";
        col_AllowAdjust.props.trueText = "允许";
        col_AllowAdjust.props.dataType = 'boolean';

        const col_status = new NxDataGridColumn("状态", 'Status');
        col_status.props.falseText = "禁用";
        col_status.props.trueText = "启用";
        col_status.props.dataType = 'boolean';

        const col_Remarks = new NxDataGridColumn("备注", 'Remarks');
        col_Remarks.props.allowHeaderFiltering = false;
        col_Remarks.props.allowFiltering = true;
        col_Remarks.props.filterOperations = ['contains'];


        const col_GrossProfit = new NxDataGridColumn("是否计入毛利", 'GrossProfit');
        col_GrossProfit.props.falseText = "否";
        col_GrossProfit.props.trueText = "是";
        col_GrossProfit.props.dataType = 'boolean';

        return [
            col_YHSubsidyName,
            col_YhSubsidyCode,
            col_YhSubsidyType,
            col_ExpType,
            col_GrossProfit,
            col_Expression,
            col_AllowAdjust,
            col_status,
            col_Remarks
        ];
    }
    onSelectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }
    delete(rowData) {
        this.service.delete([{ YHSubsidyID: rowData.data.YHSubsidyID }]).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            if (response.status) {
                this.toolbarInstance.success(`${this.translator.I18N.commandOptions.delete.text}${response.message}`);
                this.formListInstance.dataGrid.instance.clearSelection();
                this.formListInstance.dataGrid.instance.refresh();
            } else {
                this.toolbarInstance.error(`${response.message}`);
            }
        });
    }
    edit(rowData) {
        this.title = "补扣项目设置-编辑";
        this.saveDisabled = false;
        this.formData = deepCopy(rowData.data);
        this.Expression = this.formData.Expression;
        this.$option = FormOptions.$modify;
        this.popupVisible = true;
    }
    //#endregion
    //#region [初始化工具条]
    init_toolbar() {
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('create')).events.onClick = this.create.bind(this);
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('rangeDelete')).events.onClick = this.rangeDelete.bind(this);
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('review')).props.visible = false;
        (<NxButton>this.toolbarPanelModel.getWidgetByKey('rangeDelete')).props.visible = false;
        // this.toolbarPanelModel.checkInfo.visible = false;
        // this.toolbarPanelModel.moreButton.props.visible = false;
        this.toolbarPanelModel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('filterRow').events.onClick = this.toogleFilterRow.bind(this);
        this.toolbarPanelModel.settings.push(
            ...[
                new ColumnSetting("项目名称", 'YHSubsidyName'),
                new ColumnSetting("项目编码", 'YhSubsidyCode'),
                new ColumnSetting("补扣类型",'YhSubsidyType'),
                new ColumnSetting("公式类型", 'ExpType'),
                new ColumnSetting("是否计入毛利", 'GrossProfit'),
                new ColumnSetting("计算公式", 'Expression'),
                new ColumnSetting("允许调整", 'AllowAdjust'),
                new ColumnSetting("状态", 'Status'),
                new ColumnSetting("备注", 'Remarks'),
            ]
        );
        this.toolbarPanelModel.onColumnSetting = (hiding, dataField) => {
            for (let index = 0; index < this.model.columns.length; index++) {
                const col = this.model.columns[index];
                if (col.props.dataField == dataField) {
                    this.formListInstance.model.columns[index].props.visible = hiding;
                    break;
                }
            }
        };
        // 设置隐藏列缓存
        this.toolbarPanelModel.storageKey = 'subsidyprogramme-columns-storage';
        const columnSettingStorage = JSON.parse(localStorage.getItem(this.toolbarPanelModel.storageKey));
        this.model.columns.map((m) => {
            if (columnSettingStorage && columnSettingStorage[`${m.props.dataField}`]) {
                m.props.visible = columnSettingStorage[`${m.props.dataField}`].visible;
            }
        });
        this.toolbarPanelModel.moreButton.events.onItemClick = (e) => {
            if (e.type == 'export') {
                this.export();
            }
        };
    }
    init_search_panel() {
        const condition_name = new NxConditionItem();
        condition_name.label = "项目名称";
        condition_name.type = 'TextBox';
        condition_name.dataField = 'YHSubsidyName';
        condition_name.widget = new NxTextBox();
        condition_name.widget.props.showClearButton = true;

        const condition_Status = new NxConditionItem();
        condition_Status.label = "状态";
        condition_Status.type = 'SelectBox';
        condition_Status.dataField = 'Status';
        condition_Status.widget = new NxSelectBox();
        condition_Status.widget.props.dataSource = this.statusSource
        condition_Status.widget.props.valueExpr = 'fieldType';
        condition_Status.widget.props.displayExpr = 'fieldName';

        this.searchPanelModel.conditionItems.push(condition_name,condition_Status);
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
    }
    reset(data) {
        this.datasource.filter('');
        this.datasource.reload();
    }
    search(data) {
        let filter = [];
        if (data['YHSubsidyName']) {
            filter.push(['YHSubsidyName', 'contains', data['YHSubsidyName']]);
        }
        if (data['Status']) {
            if(data['Status']=="1"){
                filter.push(['Status', '=', true]);
            }else if(data['Status']=="2"){
                filter.push(['Status', '=', false]);
            }
           
        }
        if (filter.length > 0) {
            this.datasource.filter(filter);
        } else {
            this.datasource.filter('');
        }
        this.datasource.reload();
    }
    export() {
        if (this.formListInstance.getSelectedRowsData().length > 0) {
            this.formListInstance.dataGrid.instance.exportToExcel(true);
        } else {
            this.formListInstance.dataGrid.instance.exportToExcel(false);
        }
    }
    toogleFilterRow() {
        this.formListInstance.toggleFilterRow();
    }
    columnchooser() {
        this.toolbarInstance.model.columnSettingDisabled = !this.toolbarInstance.model.columnSettingDisabled;
    }
    refresh() {
        this.formListInstance.dataGrid.instance.refresh();
    }
    create() {
        this.title = "补扣项目设置-新增";
        this.saveDisabled = false;
        this.popupVisible = true;
        this.$option = FormOptions.$create;
        this.formData = new SubsidyProgrammeModel();
        this.Expression = '';
        this.formData.ExpType = 1;
    }
    sureFormula(e) {
        this.visible = false;
        this.changeDetectorRef.detectChanges();
    }
    rangeDelete() {
        const deleteKeys = [];
        this.formListInstance.getSelectedRowsData().map((m) => {
            deleteKeys.push({
                YHSubsidyID: m.YHSubsidyID,
            });
        });
        MessageBox.confirm(
            this.translator.I18N.commandOptions.delete.confirmFormat.replace(
                '{0}',
                `<strong>${deleteKeys.length}</strong>`
            )
        ).then((require) => {
            if (require) {
                this.service.delete(deleteKeys).then((result: Result) => {
                    const response = ResponseSuccess.handle(result);
                    if (response.status) {
                        this.toolbarInstance.success(
                            `${this.translator.I18N.commandOptions.delete.text}${response.message}`
                        );
                        this.formListInstance.dataGrid.instance.clearSelection();
                        this.formListInstance.dataGrid.instance.refresh();
                    } else {
                        this.toolbarInstance.error(`${response.message}`);
                    }
                });
            }
        });
    }
    openFormula(){
        this.visible = true;
        console.log(this.Expression),
        console.log(this.fieldsSource)
        setTimeout(() => {
            this.formulaComputing.script = this.Expression;
            this.formulaComputing.fields = this.fieldsSource;
            this.formulaComputing.isGroup = true;
            this.formulaComputing.sureFormula(); 
        }, 0);
    }
    //#endregion
    onFormSubmit(flag) {
        let validation = this.formInstance.instance.validate().isValid;
        if (validation) {
            this.saveDisabled = true;
            this.service.save(this.formData, this.$option).then((result: Result) => {
                const response = ResponseSuccess.handle(result);
                if (response.status) {
                    Notify.toast(
                        `${
                            this.$option == FormOptions.$create
                                ? this.translator.I18N.commandOptions.save.text
                                : this.translator.I18N.commandOptions.edit.text
                        }${response.message}`,
                        NotifyType.Success
                    );
                    this.formInstance.instance.resetValues();
                    if(flag){
                        this.create();
                    }else{
                        this.popupVisible = false;
                    }
                    this.formListInstance.dataGrid.instance.refresh();
                } else {
                    this.saveDisabled = false;
                    Notify.toast(response.message, NotifyType.Error);
                }
            });
        }
    }
    ngOnInit() {
        this.onExpTypeChanged= this.onExpTypeChanged.bind(this);
    }
    onHiding(e) {
        this.formInstance.instance.resetValues();
    }
    onExpTypeChanged(e){
        this.ExpType = e.value;
    }
}
