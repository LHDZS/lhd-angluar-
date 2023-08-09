import {
    Component,
    OnInit,
    NgModule,
    ViewChild,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    ViewChildren,
    QueryList,
} from '@angular/core';
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
    DxFormModule,
    DxFormComponent,
    DxValidatorComponent,
    DxNumberBoxModule,
    DxSwitchModule,
} from 'devextreme-angular';
import { NxSearchPanel } from './form-panel-extend';
import { NxTextBox } from '../component-model/text-box/mode';
import { NxSelectBox } from '../component-model/select-box/model';
import { NxDateBox } from '../component-model/date-box/model';
import { deepCopy } from 'src/app/providers/common/deepCopy';
import { DateTime } from 'src/app/providers/common/datetime';
import { NzDatePickerModule, NzToolTipModule } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { PermissionService } from 'src/app/providers/permission';
import { TokenAuthService } from 'src/app/shared/services';
import { RXJSService } from 'src/app/shared/services/RXJSService';
import { AppIdEnum } from 'src/app/providers/appids';
@Component({
    selector: 'app-form-panel',
    templateUrl: './form-panel.component.html',
    styleUrls: ['./form-panel.component.scss'],
})
export class FormPanelComponent {
    @ViewChild('SearchPanel', { static: false })
    SearchPanel: any;
    @ViewChild('dataGrid', { static: false })
    _dataGrid: DxDataGridComponent;
    @ViewChild('form', { static: false })
    formInstance: DxFormComponent;
    @ViewChildren('validator')
    _validator: QueryList<DxValidatorComponent>;
    @Input()
    model: NxSearchPanel;
    showModel: any[];
    newDataModel: any[];

    inited: { dataField: string; status: boolean }[] = [];
    conditionArr: any[] = [];
    oid: string;
    settingButtonOptions: any;
    protected oldData: Object;
    protected textBox: NxTextBox;
    protected selectBox: NxSelectBox;
    protected dateBox: NxDateBox;

    makingPermission: PermissionService = new PermissionService();

    constructor(private tokenService: TokenAuthService, private rxService: RXJSService, private http: HttpClient) {
        this.onReorder = this.onReorder.bind(this);
        this.settingButtonOptions = {
            onClick: () => {},
        };
    }

    protected ngOnInit() {
        this.tokenService.requestTokenWithAppId('2110201047420003409').then((res) => {
            this.makingPermission.refresh(res);
        });
        this.modelValidator();
        if (this.model.initialization) {
            this.model.initialization(this);
        }
        this.http
            .get(`${environment.qlwAssem}/settings?page_index=0&page_size=999&key=${this.model.key}`)
            .toPromise()
            .then((res: { data }) => {
                if (res.data && res.data.items && res.data.items.length) {
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
                        if (
                            item['dataField'] === 'Code' ||
                            item['dataField'] === 'Grade' ||
                            item['dataField'] === 'BreedingFarmIdentifiy'
                        ) {
                            item['headVisible'] = item['visible'];
                            item['required'] = item['required'];
                        } else {
                            item['headVisible'] = value[index].headVisible;
                            item['required'] = value[index].required;
                        }
                        item['label'] = value[index].label;
                        // item['required'] = value[index].required;
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
                this._dataGrid.instance.refresh();
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
        this.inited = [];
        this.model.conditionItems.map((m) => {
            this.inited.push({
                dataField: m.dataField,
                status: false,
            });
        });
        this.conditionArr = [];
        this.model.conditionItems.forEach((obj) => {
            if (obj.hasOwnProperty('headVisible') && !obj.headVisible) return;
            this.conditionArr.push(obj);
        });
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
    onFieldDataChanged(e) {
        if (this.model['onFieldDataChanged']) {
            this.model.onFieldDataChanged(e);
        }
    }
    onDragStart(e) {
        if (!e.itemData.visible) {
            e.cancel = true;
            return;
        }
    }
    onReorder(e) {
        var visibleRows = e.component.getVisibleRows(),
            toIndex = this.model.conditionItems.indexOf(visibleRows[e.toIndex].data),
            fromIndex = e.fromIndex;
        this.model.conditionItems.splice(fromIndex, 1);
        this.model.conditionItems.splice(toIndex, 0, e.itemData);
    }
    //头部设置
    onEditorPreparing(e) {
        if (!this.inited || !this.inited.length) return;
        if (e.dataField && e.row.rowType == 'data') {
            //显隐
            if (e.dataField == 'headVisible') {
                e.editorOptions.disabled =
                    e.row.data.required || e.row.data.requiredDisable || !e.row.data.visible ? true : false;
                if (this.model.conditionItems[e.row.rowIndex].required) {
                    e.editorOptions.value = true;
                    this.model.conditionItems[e.row.rowIndex].headVisible = true;
                }
                const _defaultValueChanged = e.editorOptions.onValueChanged;
                e.editorOptions.onValueChanged = (_e) => {
                    _defaultValueChanged(_e);
                };
            }
            if (e.dataField == 'required') {
                e.editorOptions.disabled = e.row.data.requiredDisable || !e.row.data.visible ? true : false;
                const _defaultValueChanged = e.editorOptions.onValueChanged;
                e.editorOptions.onValueChanged = (_e) => {
                    _defaultValueChanged(_e);
                };
            }
        }
    }
    _hidden() {
        this._dataGrid.instance.saveEditData();
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
    _onSave() {
        this._dataGrid.instance.saveEditData();
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
            key: this.model.key,
            value: arr,
        };
        if (this.oid) {
            params['_id'] = { $oid: this.oid };
        }
        this.http
            .put(`${environment.qlwAssem}/setting`, params)
            .toPromise()
            .then((res) => {
                this.newDataModel = [];
                this.model.conditionItems.forEach((m) => {
                    this.newDataModel.push(Object.assign({}, m));
                });
                this.model.columnSettingDisabled = false;
            });
    }
    getValidation() {
        let statusArr = [];
        this._validator.forEach((item) => {
            statusArr.push(item.instance.validate().isValid);
        });
        let status = true;
        for (const item of statusArr) {
            if (item === false) {
                status = false;
                break;
            }
        }
        return this.formInstance.instance.validate().isValid && status;
    }
    resetValue() {
        if (this._validator) {
            this._validator.forEach((item) => {
                item.instance.reset();
            });
        }
        this.formInstance.instance.resetValues();
    }
    onValueChanged(e, item) {
        if (item.conditionFun['onValueChanged']) {
            item.conditionFun.onValueChanged(e);
        }
    }
}
@NgModule({
    imports: [
        CommonModule,
        DxFormModule,
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
        DxNumberBoxModule,
        DxSwitchModule
    ],
    declarations: [FormPanelComponent],
    exports: [FormPanelComponent],
})
export class FormPanelModule {}
