import { Component, OnInit, NgModule, ViewChild, Input, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    DxSelectBoxModule,
    DxTextBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxTagBoxModule,
    DxRadioGroupModule,
    DxCalendarModule,
    DxSelectBoxComponent,
    DxTagBoxComponent,
} from 'devextreme-angular';
import { NxConditionItem, NxSearchPanel } from './header-float-panel-extend';
import { NxTextBox } from '../component-model/text-box/mode';
import { NxSelectBox } from '../component-model/select-box/model';
import { NxDateBox } from '../component-model/date-box/model';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { DateTime } from 'src/app/providers/common/datetime';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'nx-zlw-header-float-panel',
    templateUrl: './header-float-panel.component.html',
    styleUrls: ['./header-float-panel.component.scss'],
})
export class NxHeaderFloatPanelComponent {
    @ViewChild('HeaderFloatPanel', { static: false })
    SearchPanel: any;

    @ViewChildren(DxSelectBoxComponent)
    _selectQuery:QueryList<DxSelectBoxComponent>
    @ViewChildren(DxTagBoxComponent)
    _tagQuery:QueryList<DxTagBoxComponent>
    @Input()
    model: NxSearchPanel = new NxSearchPanel();

    inited: { dataField: string; status: boolean }[] = [];

    protected oldData: Object;
    protected textBox: NxTextBox;
    protected selectBox: NxSelectBox;
    protected dateBox: NxDateBox;
    show: boolean = false;
    showCalendar: boolean = false;
    constructor() {
    }
    protected ngOnInit() {
        this.modelValidator();
        if (this.model.initialization) {
            this.model.initialization(this);
        }
        this.model.conditionItems.map((m) => {
            this.inited.push({
                dataField: m.dataField,
                status: false,
            });
        });
        let i = 0;
        let arr = [];
        arr.push([]);
        this.model.conditionItems.forEach((obj) => {
            if (i < this.model.lineShowCount) {
                arr[arr.length - 1].push(obj);
                i++;
            } else {
                i = 0;
                arr.push([]);
                arr[arr.length - 1].push(obj);
                i++;
            }
        });
        this.model.conditionItems = arr;
        this.oldData = deepCopy(this.model.data);
    }
    private modelValidator() {
        if (!this.model) {
            throw new Error('[NxSearchPanelComponent] model is undefined');
        }
        if (this.model.conditionItems.length <= 0) {
            console.warn('[NxSearchPanelComponent] conditionItems is empty');
        }
        return this;
    }
    search() {
        if (this.model.searchButton.events.onClick) {
            this.model.searchButton.events.onClick(this.model.data);
        }
    }
    open() {
        this.show = !this.show;

        if (this.show) {
            this.model.openButton.props.text = '收起';
        } else {
            this.model.openButton.props.text = '展开';
        }
    }
    openCalendar(e) {
        e.stopPropagation();
        this.showCalendar = !this.showCalendar;
    }
    stop(e) {
        e.stopPropagation();
    }
    clearStart(e) {
        e.stopPropagation();
        this.model.data['date'][0] = null;
    }
    clearEnd(e) {
        e.stopPropagation();
        this.model.data['date'][1] = null;
    }

    /**
     * 重置查询条件
     * @param value 传入的默认值（可选）
     */
    reset() {
        if (this.oldData) {
            this.model.data = deepCopy(this.oldData);
            if (this.model.resetButton.events.onClick) {
                this.model.resetButton.events.onClick(this.model.data);
            }
        }
    }
    onValueChangedEvent(e, index, j) {
        const widgetType = this.model.conditionItems[index][j].type;
        switch (widgetType) {
            case 'TextBox':
            case 'DateBox':
            case 'SelectBox':
            case 'TagBox':
            case 'RadioGroup':
                if (this.model.conditionItems[index][j].widget.events.innerOnValueChanged) {
                    this.model.conditionItems[index][j].widget.events.innerOnValueChanged();
                }
                if (this.model.conditionItems[index][j].widget.events['onValueChanged']) {
                    this.model.conditionItems[index][j].widget.events['onValueChanged'](e.value, e.previousValue);
                }
                break;
        }
    }
    onTagBoxSelectionChangedEvent(e, index, j) {
        if (this.model.conditionItems[index][j].widget) {
            if (this.model.conditionItems[index][j].widget.events.innerOnValueChanged) {
                this.model.conditionItems[index][j].widget.events.innerOnValueChanged();
            }
            if (this.model.conditionItems[index][j].widget.events['onValueChanged']) {
                this.model.conditionItems[index][j].widget.events['onValueChanged'](e);
            }
        }
    }
    onFocusInEvent(e, index, j) {
        if (this.model.conditionItems[index][j].widget) {
            if ((<NxTextBox>this.model.conditionItems[index][j].widget).events.onFocusIn) {
                (<NxTextBox>this.model.conditionItems[index][j].widget).events.onFocusIn(e);
            }
        }
    }
    onClickEvent(e, index, j) {
        if (this.model.conditionItems[index][j].widget) {
            if ((<NxTextBox>this.model.conditionItems[index][j].widget).events.onClick) {
                (<NxTextBox>this.model.conditionItems[index][j].widget).events.onClick(e);
            }
        }
    }
    convertToDate(value, format) {
        if (value) {
            return new DateTime(value).toString(format);
        }
        return '-- --';
    }
    ngAfterViewInit() {
        var self = this;
        window.addEventListener('click', function () {
            self.showCalendar = false;
        });
    }
    getWidget(widget:'SelectBox'|'TagBox',dataField:string){
        switch(widget){
            case 'SelectBox':
                return this._selectQuery.find(m=>m.valueExpr == dataField);
            case 'TagBox':
                return this._tagQuery.find(m=>m.valueExpr == dataField)
            default:
                return null
        }
    }
}
@NgModule({
    imports: [
        CommonModule,
        DxSelectBoxModule,
        DxTextBoxModule,
        DxDateBoxModule,
        DxButtonModule,
        DxTagBoxModule,
        DxRadioGroupModule,
        DxCalendarModule,
        NzDatePickerModule,
        FormsModule,
    ],
    declarations: [NxHeaderFloatPanelComponent],
    exports: [NxHeaderFloatPanelComponent],
})
export class NxHeaderFloatPanelModule {}
