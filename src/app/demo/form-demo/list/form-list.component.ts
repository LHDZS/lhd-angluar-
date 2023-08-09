import { Component, OnInit, ViewChild } from '@angular/core';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxFormListComponent } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxToolbarPanel, ToolbarPanelMainKeysDefault } from 'src/app/components/toolbar-panel/toolbar-panel-extend';
import { NxDataGrid } from 'src/app/components/component-model/data-grid/model';
import {
    NxSearchPanel,
    NxConditionItem,
    NxConditionItemType,
} from 'src/app/components/search-panel/search-panel-extend';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxSearchPanelComponent } from 'src/app/components/search-panel/search-panel.component';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import DataSource from 'devextreme/data/data_source';
import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { NxToolbarPanelComponent } from 'src/app/components/toolbar-panel/toolbar-panel.component';

@Component({
    selector: 'zlw-form-list',
    templateUrl: './form-list.component.html',
    styleUrls: ['./form-list.component.css'],
})
export class FormListComponent {
    // 1.创建列表配置对象
    // 2.创建工具条配置对象
    // 3.创建查询区域配置对象
    dataGridModel: NxDataGrid = new NxDataGrid('list');
    toolbarPanelModel: NxToolbarPanel = new NxToolbarPanel('list');
    searchPanelModel: NxSearchPanel = new NxSearchPanel();
    // 1.获取列表组件实例
    // 2.获取工具条组件实例
    // 3.获取查询区域组件实例
    @ViewChild('list', { static: false })
    list: NxFormListComponent;
    @ViewChild('toolbarPanel', { static: false })
    toolbarPanel: NxToolbarPanelComponent;
    @ViewChild('searchPanel', { static: false })
    searchPanel: NxSearchPanelComponent;
    // 设置查询区域的对象
    searchData: any = {};
    // 在构造函数中初始化配置
    constructor(private tokenService: TokenAuthService) {
        this.init_data_grid().init_search_panel().init_toolbar_panle();
    }
    //#region [表格配置]
    // 初始化表格
    // 设置主键 （必须的）
    // 设置数据源，列表页数据源类型为 DataSource
    // 设置列
    // 绑定列表页行内删除的实现
    // 绑定列表页编辑按钮的实现
    private init_data_grid(): FormListComponent {
        this.dataGridModel.primaryKey = 'RecordId';
        // this.dataGridModel.props.dataSource = this.dataSource;
        this.dataGridModel.columns.push(...this.columns);
        this.dataGridModel.events.onRowDblClick = this.edit.bind(this);
        this.dataGridModel.commandColumn.deleteButton.confirm = this.rowDelete.bind(this);
        this.dataGridModel.commandColumn.editButton.onClick = this.edit.bind(this);
        return this;
    }

    // 编辑跳转详情页
    edit(rowData) {
        this.list.editToDetail('/form-demo/detail', rowData.rowIndex, '标题', { number: rowData.data.iNumericalOrder });
    }
    // 行内删除
    rowDelete(e) {
    }
    // 配置列
    get columns(): Array<NxDataGridColumn> {
        // 1.绑定列的标题名称（必须）
        // 2.绑定列的字段名称（必须）
        // 3.绑定列的字段类型（必须，小写）
        // 4.其他：
        //       1.展开数据源绑定显示名称  ExpandField.Field
        //       2.设置列的最小宽度 min-width
        //       3.设置列的文本对齐方式 alignment
        //       4.设置列是否可以过滤，查询 allowSearch,allowFiltering,allowHeaderFiltering等
        //       5.设置列的默认排序 sortOrder
        //       6.绑定下拉数据源 lookup
        //       7.设置true/false的文本显示 trueText/falseText
        //       8.设置列是否固定 fixed
        //       9.设置日期的显示格式 format
        //       10.设置列是否隐藏 visible
        //       11.设置列是否可排序
        //       12.设置列是否可拖动宽度
        //       等等...
        // const col = new NxDataGridColumn('示例', 'dataField', 'dataType', 'expandField.field');
        // col.props.minWidth = 120;
        // col.props.alignment = 'left';
        // col.props.allowSearch = false;
        // col.props.allowFiltering = false;
        // col.props.allowHeaderFiltering = false;
        // col.props.sortOrder = 'asc';
        // col.props.lookup.enabled = true;
        // col.props.lookup.dataSource = [];
        // col.props.trueText = '真';
        // col.props.falseText = '假';
        // col.props.fixed = true;
        // col.props.format = 'yyyy-MM-dd';
        // col.props.visible = true;
        // col.props.allowReordering = false
        // col.props.allowResizing = false
        return [
            new NxDataGridColumn('单据号', 'iNumericalOrder', 'string'),
            new NxDataGridColumn('喂养日期', 'dDataDate', 'date'),
            new NxDataGridColumn('喂养类型', 'iObjectSort', 'number'),
            new NxDataGridColumn('审核人', 'iPrincipal', 'string'),
            new NxDataGridColumn('制单人', 'iPreparedBy', 'string'),
            new NxDataGridColumn('创建日期', 'dLastModified', 'date'),
        ];
    }
    private get Store(): ODataStore {
        return new ODataStore({
            url: ``,
            key: 'RecordID',
            keyType: 'Int32',
            version: 4,
              beforeSend: (e) => {
            //     e.headers = {
            //         Authorization: this.tokenService.token,
            //     };
               },
        });
    }
    get dataSource() {
        return new DataSource({
            store: this.Store,
        });
    }
    //#endregion

    //#region [工具条配置]
    private init_toolbar_panle(): FormListComponent {
        this.toolbarPanelModel.getWidgetByKey(ToolbarPanelMainKeysDefault.create).events.onClick = this.create.bind(
            this
        );
        this.toolbarPanelModel.getWidgetByKey(
            ToolbarPanelMainKeysDefault.rangeDelete
        ).events.onClick = this.rangeDelete.bind(this);
        return this;
    }
    create() {
        this.list.createToDetail('/form-demo/detail', '详情页');
    }
    rangeDelete() {
        this.list.refresh();
    }
    //#endregion

    //#region [条件筛选组配置]
    private init_search_panel(): FormListComponent {
        this.searchPanelModel.data = this.searchData;
        this.searchPanelModel.searchButton.events.onClick = this.search.bind(this);
        this.searchPanelModel.resetButton.events.onClick = this.reset.bind(this);
        // - 单据号
        const condition_number = new NxConditionItem();
        condition_number.label = '单据号';
        condition_number.dataField = 'number';
        condition_number.type = NxConditionItemType.TextBox;
        condition_number.widget = new NxTextBox();
        // - 日期
        const condition_date = new NxConditionItem();
        condition_date.label = '日期';
        condition_date.type = NxConditionItemType.DateBox;
        condition_date.dataField = 'date';
        condition_date.widget = new NxDateBox();
        this.searchPanelModel.conditionItems.push(...[condition_number, condition_date]);
        return this;
    }
    search(data) {
        this.list.filter([
            ['iNumericalOrder', '=', data.number],
            ['dDataDate', '=', new Date(data.date)],
        ]);
    }
    reset() {
        const o = {
            number: '',
            date: new Date(),
        };
        this.searchPanel.reset();
    }
    //#endregion
}
