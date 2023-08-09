import { Component, OnInit, NgModule, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
    DxSelectBoxModule,
    DxTextBoxModule,
    DxDateBoxModule,
    DxButtonModule,
    DxTagBoxModule,
    DxRadioGroupModule,
    DxPopupModule,
    DxDataGridModule,
    DxCheckBoxModule,
    DxDataGridComponent,
    DxValidatorModule,
    DxNumberBoxModule,
} from 'devextreme-angular';
import { NxSearchPanel } from './search-panel-extend';
import { NxTextBox } from '../component-model/text-box/mode';
import { NxSelectBox } from '../component-model/select-box/model';
import { NxDateBox } from '../component-model/date-box/model';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { DateTime } from 'src/app/providers/common/datetime';
import { NzDatePickerModule, NzToolTipModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ArrayType } from '@angular/compiler';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { NxNumberBox } from '../component-model/number-box/mode';
import { NxDataGridColumnValidationRule } from '../component-model/data-grid/columns/validation-rule/model';

@Component({
    selector: 'nx-zlw-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.scss'],
})
export class NxSearchPanelComponent {
    @ViewChild('SearchPanel', { static: false })
    SearchPanel: any;
    @Input()
    model: NxSearchPanel;
    showModel: any[];
    newDataModel: any[];

    inited: { dataField: string; status: boolean }[] = [];
    conditionArr: any[] = [];
    oid: string;
    HeaderKey: string;
    protected oldData: Object;
    protected textBox: NxTextBox;
    protected selectBox: NxSelectBox;
    protected dateBox: NxDateBox;
    protected numberBox: NxNumberBox;
    constructor(private http?: HttpClient) {}
    protected ngOnInit() {
        this.HeaderKey = window.location.pathname.match('/[^/]+(?=/)')[0].replace('/', '') + '-header1';
        this.modelValidator();
        if (this.model.initialization) {
            this.model.initialization(this);
        }
        this.inited = [];
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
            if (obj.hasOwnProperty('headVisible') && !obj.headVisible) return;
            if (i < 4) {
                arr[arr.length - 1].push(obj);
                i++;
            } else {
                i = 0;
                arr.push([]);
                arr[arr.length - 1].push(obj);
                i++;
            }
        });
        this.conditionArr = arr;
        this.http
            .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${this.HeaderKey}`)
            .toPromise()
            .then((res: { data }) => {
                if (res.data && res.data.items) {
                    const json = res.data.items[0];
                    const { key, value, _id } = json;
                    this.oid = _id.$oid;
                    let order = [];
                    value.forEach((item) => {
                        order.push(item.dataField);
                    });
                    this.model.conditionItems.sort((a, b) => {
                        return order.indexOf(a.dataField) - order.indexOf(b.dataField);
                    });
                    this.newDataModel = [];
                    this.model.conditionItems.forEach((item, index) => {
                        item['headVisible'] = value[index].headVisible;
                        item['label'] = value[index].label;
                        item['required'] = value[index].required;
                        this.newDataModel.push(Object.assign({}, item));
                    });
                } else {
                    this.newDataModel = [];
                    this.model.conditionItems.forEach((item) => {
                        this.newDataModel.push(Object.assign({}, item));
                    });
                }
                this.init();
                this.oldData = deepCopy(this.model.data);
            })
            .catch((err) => {
                this.init();
                this.newDataModel = [];
                this.model.conditionItems.forEach((item, index) => {
                    this.newDataModel.push(Object.assign({}, item));
                });
                this.oldData = deepCopy(this.model.data);
            });
    }
    init() {
        let dataFieldArr = [];
        this.model.conditionItems.map((m) => {
            dataFieldArr.push(m.dataField);
        });
        this.inited.sort((a, b) => {
            return dataFieldArr.indexOf(a.dataField) - dataFieldArr.indexOf(b.dataField);
        });
        let i = 0;
        let arr = [];
        arr.push([]);
        this.model.conditionItems.forEach((obj) => {
            if (obj.hasOwnProperty('headVisible') && !obj.headVisible) return;
            if (i < 4) {
                arr[arr.length - 1].push(obj);
                i++;
            } else {
                i = 0;
                arr.push([]);
                arr[arr.length - 1].push(obj);
                i++;
            }
        });
        this.conditionArr = arr;
    }
    private modelValidator() {
        if (!this.model) {
            throw new Error('[NxSearchPanelComponent] model is undefined');
        }
        if (this.model.conditionItems.length <= 0) {
            console.warn('[NxSearchPanelComponent] conditionItems is empty');
        }
        this.showModel = [];
        this.model.conditionItems.forEach((m) => {
            m['showLabel'] = m.label;
            this.showModel.push(Object.assign({}, m));
        });
        return this;
    }
    search() {
        if (this.model.searchButton.events.onClick) {
            this.model.searchButton.events.onClick(this.model.data);
        }
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
    onValueChangedEvent(e, index) {
        if (!this.inited[index].status) {
            this.inited[index].status = true;
        } else {
            const widgetType = this.model.conditionItems[index].type;
            switch (widgetType) {
                case 'TextBox':
                case 'DateBox':
                case 'SelectBox':
                case 'TagBox':
                case 'RadioGroup':
                case 'NumberBox':
                    if (this.model.conditionItems[index].widget.events.innerOnValueChanged) {
                        this.model.conditionItems[index].widget.events.innerOnValueChanged();
                    }
                    if (this.model.conditionItems[index].widget.events['onValueChanged']) {
                        this.model.conditionItems[index].widget.events['onValueChanged'](e.value, e.previousValue);
                    }
                    break;
            }
        }
    }
    onOpened(e, index) {
        if (this.model.conditionItems[index].widget.events['onOpened']) {
            this.model.conditionItems[index].widget.events['onOpened'](e);
        }
    }
    onClosed(e, index) {
        if (this.model.conditionItems[index].widget.events['onClosed']) {
            this.model.conditionItems[index].widget.events['onClosed'](e);
        }
    }
    onTagBoxSelectionChangedEvent(e, index) {
        if (this.model.conditionItems[index].widget.events.innerOnValueChanged) {
            this.model.conditionItems[index].widget.events.innerOnValueChanged();
        }
        if (this.model.conditionItems[index].widget.events['onValueChanged']) {
            this.model.conditionItems[index].widget.events['onValueChanged'](e);
        }
    }
    onFocusInEvent(e, index) {
        if ((<NxTextBox>this.model.conditionItems[index].widget).events.onFocusIn) {
            (<NxTextBox>this.model.conditionItems[index].widget).events.onFocusIn(e);
        }
    }
    onMouseleave(e, index) {
        if ((<NxTextBox>this.model.conditionItems[index].widget).events.mouseleave) {
            (<NxTextBox>this.model.conditionItems[index].widget).events.mouseleave(e);
        }
    }
    onMouseenter(e, index) {
        if ((<NxTextBox>this.model.conditionItems[index].widget).events.mouseenter) {
            (<NxTextBox>this.model.conditionItems[index].widget).events.mouseenter(e);
        }
    }
    onClickEvent(e, index) {
        if ((<NxTextBox>this.model.conditionItems[index].widget).events.onClick) {
            (<NxTextBox>this.model.conditionItems[index].widget).events.onClick(e);
        }
    }

    onFocusInEvent2(e, index) {
        if ((<NxNumberBox>this.model.conditionItems[index].widget).events.onFocusIn) {
            (<NxNumberBox>this.model.conditionItems[index].widget).events.onFocusIn(e);
        }
    }
    onClickEvent2(e, index) {
        if ((<NxNumberBox>this.model.conditionItems[index].widget).events.onClick) {
            (<NxNumberBox>this.model.conditionItems[index].widget).events.onClick(e);
        }
    }

    onAddEvent(e, item) {
        if (item.addOperation) {
            item.addOperation(e);
        }
    }
    onBtnEvent(e, item) {
        if (item.btnOperation) {
            item.btnOperation(e);
        }
    }
    convertToDate(value, format) {
        if (value) {
            return new DateTime(value).toString(format);
        }
        return '-- --';
    }
    /**
     * 通过字段名称获取组件实例
     */
    getWidget(dataField: string) {
        const conditionItem = this.model.conditionItems.find((m) => m.dataField == dataField);
        return conditionItem.widget;
    }
    //头部设置
    onEditorPreparing(e) {
        if (!this.inited || !this.inited.length) return;
        if (e.dataField && e.row.rowType == 'data') {
            //显隐
            if (e.dataField == 'headVisible') {
                e.editorOptions.disabled = e.row.data.required || e.row.data.requiredDisable ? true : false;
                if (this.model.conditionItems[e.row.rowIndex].required) {
                    e.editorOptions.value = true;
                    this.model.conditionItems[e.row.rowIndex].headVisible = true;
                }
            }
            if (e.dataField == 'required') {
                e.editorOptions.disabled = e.row.data.requiredDisable ? true : false;
            }
        }
    }
    _hidden() {
        this.model.conditionItems = [];
        this.newDataModel.forEach((m) => {
            this.model.conditionItems.push(Object.assign({}, m));
        });
        this.showModel.forEach((m) => {
            let index = this.model.conditionItems.findIndex((x) => x.dataField == m.dataField);
            this.model.conditionItems[index]['showLabel'] = m.showLabel;
        });
        this.init();
    }
    _onCancel() {
        this.model.columnSettingDisabled = false;
    }
    _onSave(callBack?: Function) {
        this.init();
        let arr = [];
        this.model.conditionItems.forEach((item) =>
            arr.push({
                headVisible: item.headVisible,
                label: item.label,
                required: item.required,
                dataField: item.dataField,
            })
        );
        let params = {
            key: this.HeaderKey,
            value: arr,
        };
        if (this.oid) {
            params['_id'] = { $oid: this.oid };
        }
        this.http
            .put(`${environment.qlwAssem}/setting`, params)
            .toPromise()
            .then((res: { data }) => {
                this.oid = res.data._id.$oid;
                this.newDataModel = [];
                this.model.conditionItems.forEach((m) => {
                    this.newDataModel.push(Object.assign({}, m));
                });
                if (callBack) callBack();
                this.model.columnSettingDisabled = false;
            });
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
        NzDatePickerModule,
        FormsModule,
        NzToolTipModule,
        DxPopupModule,
        DxDataGridModule,
        DxCheckBoxModule,
        DxValidatorModule,
        DxNumberBoxModule
    ],
    declarations: [NxSearchPanelComponent],
    exports: [NxSearchPanelComponent],
})
export class NxSearchPanelModule {}
