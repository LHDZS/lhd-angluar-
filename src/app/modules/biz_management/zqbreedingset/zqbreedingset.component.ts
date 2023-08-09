import { Component, OnInit, ViewChild } from '@angular/core';
import { BreedingSettingService } from './zqbreedingset.service';
import { DxFormComponent } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import { HttpClient } from '@angular/common/http';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { i18n_pigFarmSetting } from 'src/locale/locale';
import { Notify, NotifyType, MessageBox } from 'src/app/providers/notify';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import { NxToolbarPanel, ColumnSetting } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { QlwODataContext, QlwSystemContext,BasicSettingODataContext } from 'src/app/providers/odataContext';
import { NxButton } from 'src/app/components/component-model/button/model';
import { AppIdDataRel, DataDictionary, FormOptions } from 'src/app/providers/enums';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { Result, ResponseSuccess } from 'src/app/providers/result';
import { BreedingSettingModel } from './zqbreedingset.model';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { DateTime } from 'src/app/providers/common/datetime';
import { RegExps } from 'src/app/providers/regexp';
import { TokenAuthService } from 'src/app/shared/services';
import { NxSearchPanel, NxConditionItem } from 'src/app/components/header-search-panel/header-search-panel-extend';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { NxSelectBox } from 'src/app/components/component-model/select-box/model';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';

@Component({
    selector: 'app-zqbreedingset',
    templateUrl: './zqbreedingset.component.html',
    styleUrls: ['./zqbreedingset.component.css'],
    providers: [BreedingSettingService],
})
export class BreedingSettingComponent {
    PoultryTypeSource: any = [];
    PersonSource: any = [];
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
    pigFarmScaleSource: any;
    formData: any = {};
    $option: FormOptions = FormOptions.$create;
    $modifyProvince: boolean = false;
    $modifyCity: boolean = false;
    provinceSource: any = [];
    provinceId: string;
    citySource: any = [];
    cityId: string;
    areaSource: any = [];
    areaId: string;
    currentDate: Date = new Date();
    saveDisabled: boolean = false;
    title: string;
    limitCharacter = RegExps.Forbidcharacter;
    PoultryTypeFlag: boolean = false;
    constructor(
        private service: BreedingSettingService,
        private qlwOdataContext: QlwODataContext,
        // private zlwBasicOdataContext: ZlwBasicSettingODataContext,
        private BasicOdataContext: BasicSettingODataContext,
        private tokenService: TokenAuthService,
        private qlwSystemContext: QlwSystemContext,
        private translator: TranslateService
    ) {

        this.PoultryTypeFlag = true;
        //获取禽别字典表数据
        this.PoultryTypeSource = this.BasicOdataContext.getBizDataDictDataSource({
            select: ['DictId', 'DictName'],
            filter: [[
                ['DictId', '=', DataDictionary.PoultryTypeA],
                'or',
                ['DictId', '=', DataDictionary.PoultryTypeB],
                'or',
                ['DictId', '=', DataDictionary.PoultryTypeC],
                'or',
                ['DictId', '=', DataDictionary.PoultryTypeD],
            ]],
        });
        
        this.PersonSource = this.qlwOdataContext.getQlWPersonOData({
            select: ['UserID','PersonName'],
        });
        this.init_data_grid();
        this.init_toolbar();
        this.init_search_panel();
    }
    //#region [初始化列表配置]
    init_data_grid() {
        this.model.primaryKey = 'BreedingID';
        this.model.export.fileName = `${this.translator.I18N.breedingSetting.title}-${new DateTime().toString()}`;
        this.model.props.columnAutoWidth = true;
        this.model.columns.push(...this.columns);
        this.datasource = this.service.getDataSource();
        let filter = this.getFilter();
        this.datasource.filter(filter);
        this.model.props.dataSource = this.datasource;
        this.model.events.onSelectionChanged = this.onSelectionChanged.bind(this);
        this.model.commandColumn.deleteButton.confirm = this.delete.bind(this);
        this.model.commandColumn.editButton.onClick = this.edit.bind(this);
        this.model.stateStoring.enabled = true;
        this.model.stateStoring.storageKey = 'yhbreedingset-storage';
        this.model.events.onRowDblClick = this.edit.bind(this);
        return this;
    }
    get columns() {
        //名称
        const col_BreedingName = new NxDataGridColumn(this.translator.I18N.breedingSetting.BreedingName.text, 'BreedingName','string');

        col_BreedingName.props.filterOperations = ['contains'];
        col_BreedingName.props.allowHeaderFiltering = false;
        col_BreedingName.props.allowFiltering = false;

        //编码
        const col_BreedingNo = new NxDataGridColumn(this.translator.I18N.breedingSetting.BreedingNo.text, 'BreedingNo','string');
        col_BreedingNo.props.allowHeaderFiltering = false;
        col_BreedingNo.props.allowFiltering = false;
        col_BreedingNo.props.filterOperations = ['contains'];

        //禽别
        const col_PoultryType = new NxDataGridColumn(this.translator.I18N.breedingSetting.PoultryType.text,'PoultryType','string');
        col_PoultryType.props.allowHeaderFiltering = false;
        col_PoultryType.props.lookup.enabled = true;
        // col_PoultryType.props.allowSorting = false;
        col_PoultryType.props.lookup.dataSource = this.PoultryTypeSource;
        col_PoultryType.props.lookup.valueExpr = 'DictId';
        col_PoultryType.props.lookup.displayExpr = 'DictName';

        //状态
        const col_Status = new NxDataGridColumn(this.translator.I18N.breedingSetting.Status.text, 'Status');
        col_Status.props.trueText = this.translator.I18N.breedingSetting.Status.trueText;
        col_Status.props.falseText = this.translator.I18N.breedingSetting.Status.falseText;
        col_Status.props.dataType = 'boolean';

        //创建人
        const col_creator = new NxDataGridColumn(this.translator.I18N.commonColumns.createdOwnerName.text,'CreatedOwnerName','string');
        col_creator.props.allowHeaderFiltering = false;
        col_creator.props.lookup.enabled = true;
        col_creator.props.filterOperations = ['contains'];
        col_creator.props.allowSorting = false;
        col_creator.props.lookup.dataSource = this.PersonSource;
        col_creator.props.lookup.valueExpr = 'UserID';
        col_creator.props.lookup.displayExpr = 'PersonName';

        //创建时间
        const col_create_date = new NxDataGridColumn(i18n_pigFarmSetting.CreatedDate, 'CreatedDate', 'date');
        col_create_date.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_create_date.props.selectedFilterOperation = 'between';
        col_create_date.props.sortOrder = 'desc';
        //修改时间
        const col_modifyDate = new NxDataGridColumn(i18n_pigFarmSetting.ModifiedDate, 'ModifiedDate', 'date');
        col_modifyDate.props.format = 'yyyy/MM/dd HH:mm:ss';
        col_modifyDate.props.selectedFilterOperation = 'between';

        const col_Remarks = new NxDataGridColumn(this.translator.I18N.breedingSetting.remarks.text,'Remarks','string');
        col_Remarks.props.filterOperations = ['contains'];
        return [
            col_BreedingName,
            col_BreedingNo,
            col_PoultryType,
            col_Status,
            // col_creator,
            col_create_date,
            col_modifyDate,
            col_Remarks
        ];
       
    }
    //编辑
    onSelectionChanged(keys) {
        this.toolbarInstance.checkChange(keys.length);
    }
    //删除
    delete(rowData) {
        if(rowData.data.GroupID=="0"){
            Notify.toast("内置的品种，不允许删除！", NotifyType.Error);
            return;
        }
        this.service.delete([{ BreedingID: rowData.data.BreedingID }]).then((result: Result) => {
            const response = ResponseSuccess.handle(result);
            if (response.status) {
                this.toolbarInstance.success(`${this.translator.I18N.commandOptions.delete.text}${response.message}`);
                this.formListInstance.dataGrid.instance.clearSelection();
                this.formListInstance.dataGrid.instance.refresh();
            } else {
                // this.toolbarInstance.error(`${response.message}`);
                Notify.toast(response.message, NotifyType.Error);
            }
        });
    }
    //修改
    edit(rowData) {
        if(rowData.data.GroupID=="0"){
            Notify.toast("内置的品种，不允许修改！", NotifyType.Error);
            return;
        }
        this.title = this.translator.I18N.breedingSetting.editPageTitle;
        this.saveDisabled = false;
        this.formData = deepCopy(rowData.data);
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
        this.toolbarPanelModel.checkInfo.visible = false;
        this.toolbarPanelModel.moreButton.props.visible = false;
        this.toolbarPanelModel.getOtherWidgetByKey('setting').events.onClick = this.columnchooser.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('refresh').events.onClick = this.refresh.bind(this);
        this.toolbarPanelModel.getOtherWidgetByKey('filterRow').events.onClick = this.toogleFilterRow.bind(this);
        this.toolbarPanelModel.settings.push(
            ...[
                new ColumnSetting(this.translator.I18N.breedingSetting.BreedingName.text, 'BreedingName'),
                new ColumnSetting(this.translator.I18N.breedingSetting.BreedingNo.text, 'BreedingNo'),
                new ColumnSetting(this.translator.I18N.breedingSetting.PoultryType.text, 'PoultryType'),
                new ColumnSetting(this.translator.I18N.breedingSetting.Status.text, 'Status'),
                new ColumnSetting(this.translator.I18N.breedingSetting.remarks.text, 'Remarks'),
                // new ColumnSetting(this.translator.I18N.commonColumns.createdOwnerName.text, 'CreatedOwnerName'),
                new ColumnSetting(this.translator.I18N.commonColumns.createdDate.text, 'CreatedDate'),
                // new ColumnSetting(this.translator.I18N.commonColumns.ownerName.text, 'OwnerName'),
                new ColumnSetting(this.translator.I18N.commonColumns.modifiedDate.text, 'ModifiedDate'),
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
        this.toolbarPanelModel.storageKey = 'yhbreedingset-columns-storage';
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

        const condition_PoultryType = new NxConditionItem();
        condition_PoultryType.label = this.translator.I18N.breedingSetting.PoultryType.text;
        condition_PoultryType.type = 'SelectBox';
        condition_PoultryType.dataField = 'PoultryType';
        condition_PoultryType.widget = new NxSelectBox();
        condition_PoultryType.widget.props.dataSource = this.PoultryTypeSource;
        condition_PoultryType.widget.props.valueExpr = 'DictId';
        condition_PoultryType.widget.props.displayExpr = 'DictName';


        const condition_BreedingName = new NxConditionItem();
        condition_BreedingName.label = this.translator.I18N.breedingSetting.BreedingName.text;
        condition_BreedingName.type = 'TextBox';
        condition_BreedingName.dataField = 'BreedingName';
        condition_BreedingName.widget = new NxTextBox();

        this.searchPanelModel.conditionItems.push(condition_PoultryType, condition_BreedingName);
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        return this;
    }
    reset(data) {
        let filter = this.getFilter();
        this.datasource.filter(filter);
        this.datasource.reload();
    }
    getFilter(){
        let filter = [];
        filter.push([[
            ['PoultryType', '=', DataDictionary.PoultryTypeA],
            'or',
            ['PoultryType', '=', DataDictionary.PoultryTypeB],
            'or',
            ['PoultryType', '=', DataDictionary.PoultryTypeC],
            'or',
            ['PoultryType', '=', DataDictionary.PoultryTypeD],
        ]]);
        return filter;
    }
    search(data) {
        let filter = [];
        //禽别筛选
        if (data['PoultryType']) {
            filter.push(['PoultryType', '=', data['PoultryType']]);
        }
        else{
            filter.push([[
                ['PoultryType', '=', DataDictionary.PoultryTypeA],
                'or',
                ['PoultryType', '=', DataDictionary.PoultryTypeB],
                'or',
                ['PoultryType', '=', DataDictionary.PoultryTypeC],
                'or',
                ['PoultryType', '=', DataDictionary.PoultryTypeD],
            ]]);
        }
         //名称筛选
        if (data['BreedingName']) {
            filter.push([['BreedingName', 'contains', data['BreedingName']],'or',['MnemonicCode', 'contains', data['BreedingName']]]);
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
        this.title = this.translator.I18N.breedingSetting.createPageTitle;
        this.saveDisabled = false;
        this.popupVisible = true;
        this.$option = FormOptions.$create;
        this.formData = new BreedingSettingModel();
    }
    rangeDelete() {
        const deleteKeys = [];
        this.formListInstance.getSelectedRowsData().map((m) => {
            deleteKeys.push({
                BreedingID: m.BreedingID,
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
    //#endregion
    onFormSubmit() {
        let validation = this.formInstance.instance.validate().isValid;
        if (validation) {
            this.saveDisabled = true;
            this.formData.ComboPack = DataDictionary.ComboPackF;
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
                    this.popupVisible = false;
                    this.formListInstance.dataGrid.instance.refresh();
                    this.formInstance.instance.resetValues();
                } else {
                    this.saveDisabled = false;
                    Notify.toast(response.message, NotifyType.Error);
                }
            });
        }
    }
    ngOnInit() {
        this.PoultryTypeFlag = true;
        //获取禽别字典表数据
        this.PoultryTypeSource = this.BasicOdataContext.getBizDataDictDataSource({
            select: ['DictId', 'DictName'],
            filter: [[
                ['DictId', '=', DataDictionary.PoultryTypeA],
                'or',
                ['DictId', '=', DataDictionary.PoultryTypeB],
                'or',
                ['DictId', '=', DataDictionary.PoultryTypeC],
                'or',
                ['DictId', '=', DataDictionary.PoultryTypeD],
            ]],
        });
       

    }
    onHiding(e) {
        this.formInstance.instance.resetValues();
    }
}
