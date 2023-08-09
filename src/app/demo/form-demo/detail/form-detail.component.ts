import { Component, OnInit, ViewChild } from '@angular/core';
import { NxFormDetail } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail-extend';
import { NxDataGridColumn } from 'src/app/components/component-model/data-grid/columns/model';
import { NxConditionItem } from 'src/app/components/search-panel/search-panel-extend';
import { NxTextBox } from 'src/app/components/component-model/text-box/mode';
import { NxDateBox } from 'src/app/components/component-model/date-box/model';
import { NxZlwFormDetailComponent } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';

@Component({
    selector: 'app-form-detail',
    templateUrl: './form-detail.component.html',
    styleUrls: ['./form-detail.component.css'],
})
export class FormDetailComponent {
    @ViewChild('instance', { static: false })
    instance: NxZlwFormDetailComponent;
    model: NxFormDetail = new NxFormDetail();
    constructor() {
        // this.model.init = this.init.bind(this);
        this.init_toolbar();
        this.init_conditions();
        this.init_dataGrid();
    }
    //#region  工具条配置
    private init_toolbar() {
        this.model.toolbar.checkInfo.visible = false;
        this.model.toolbar.moreButton.props.visible = false;
        this.model.toolbar.getWidgetByKey('save').events.onClick = this.save.bind(this);
        // this.model.toolbar.getWidgetByKey('prev').events.onClick = this.prev.bind(this);
        // this.model.toolbar.getWidgetByKey('next').events.onClick = this.next.bind(this);
    }
    save(e) {
        this.instance.dataGrid.dataGrid.instance.saveEditData()
    }
    prev() {
        this.instance.prev('').then((value) => {
            this.instance.toolbarPanel.model.getWidgetByKey('prev').props.disabled = value.allowPrev;
        });
    }
    next() {
        this.instance.next('').then((value) => {
            this.instance.toolbarPanel.model.getWidgetByKey('next').props.disabled = value.allowNext;
        });
    }
    //#endregion

    //#region  表头配置
    private init_conditions() {
        this.model.conditionPanel.data = {};
        this.model.conditionPanel.default = false;
        const condition_number = new NxConditionItem('单据号', 'number', 'TextBox');
        condition_number.dataField = 'number';
        condition_number.widget = new NxTextBox();
        const condition_date = new NxConditionItem('期初日期', 'startDate', 'DateBox');
        condition_date.dataField = 'startDate';
        condition_date.widget = new NxDateBox();
        const condition_create_date = new NxConditionItem('创建日期', 'createDate', 'DateBox');
        condition_create_date.dataField = 'createDate';
        condition_create_date.widget = new NxDateBox();
        this.model.conditionPanel.conditionItems = [condition_number, condition_date, condition_create_date];
    }
    //#endregion

    //#region  表体配置
    private init_dataGrid() {
        this.model.dataGrid.editing.enabled = true;
        this.model.dataGrid.props.dataSource = [{}];
        this.model.dataGrid.primaryKey = 'recordId';
        this.model.initialization = this.initialization.bind(this);
        this.model.dataGrid.columns.push(...this.columns);
    }
    private get columns() {
        return [
            new NxDataGridColumn('栋舍类型', 'A', 'string'),
            new NxDataGridColumn('栋舍名称', 'B', 'string'),
            new NxDataGridColumn('容量', 'C', 'string'),
            new NxDataGridColumn('负责人', 'D', 'string'),
            new NxDataGridColumn('状态', 'E', 'String'),
        ];
    }
    //#endregion

    //#region 数据初始化
    initialization(e: NxZlwFormDetailComponent) {
        // 设置表头数据
        e.model.conditionPanel.data = { number: '333', startDate: new Date(), createDate: new Date() };
    }
    //#endregion
}
