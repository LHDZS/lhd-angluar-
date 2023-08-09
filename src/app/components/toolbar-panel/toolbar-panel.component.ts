import { Component, OnInit, NgModule, Input, ElementRef } from '@angular/core';
import {
    DxButtonModule,
    DxDropDownButtonModule,
    DxCheckBoxModule,
    DxPopupModule,
    DxScrollViewModule,
    DxTextBoxModule,
    DxRadioGroupModule
} from 'devextreme-angular';
import { ColumnSetting, NxToolbarPanel, ToolbarCheckIcon } from './toolbar-panel-extend';
import { CommonModule } from '@angular/common';
import { NxButton } from '../component-model/button/model';
import { TokenAuthService } from 'src/app/shared/services';
import { PermissionService } from 'src/app/providers/permission';
import { RXJSService } from 'src/app/shared/services/RXJSService';
import { NxDropDownButton } from '../component-model/drop-down-button/model';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';
import { stringHelper } from 'src/app/providers/common/stringHelper';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TranslateService } from 'src/app/providers/i18n-translate';
@Component({
    selector: 'nx-zlw-toolbar-panel',
    templateUrl: './toolbar-panel.component.html',
    styleUrls: ['./toolbar-panel.component.scss'],
})
export class NxToolbarPanelComponent {
    printQuantityPerLine: string;
    columnName: String;
    constructor(
        private tokenService: TokenAuthService,
        private rxService: RXJSService,
        private http: HttpClient,
        private eleR: ElementRef
    ) { }
    permission: PermissionService = new PermissionService();
    @Input('model')
    model: NxToolbarPanel;
    private checked: Number;
    private infoTimer: any;
    dropdownOpend: boolean = false;
    makingPermission = new PermissionService();
    protected ngOnInit() {
        this.tokenService.getPermission().then((res) => {
            this.permission.refresh(res.permissions);
            this.rxService.publish(this.permission);
            this.printQuantityPerLine = NxTranslateI18N.I18N.commandOptions.printQuantityPerLine.text;
            if (!this.permission.$$manager) {
                
                if (this.model.type == 'list') {
                    let addButton = <NxButton>this.model.getWidgetByKey('create');
                    let delButton = <NxButton>this.model.getWidgetByKey('rangeDelete');
                    if (addButton && addButton.props.visible) {
                        addButton.props.visible = this.permission.$$add;
                    }
                    if (delButton && delButton.props.visible) {
                        delButton.props.visible = this.permission.$$delete;
                        if(this.model.useDelbtn){
                            delButton.props.visible = this.permission.$$edit;
                        }
                    }
                }
            }
        });
        this.tokenService.requestTokenWithAppId('2110201047420003409').then((res) => {
            this.makingPermission.refresh(res);
        });

        this.checked = this.model.checkInfo.checked;
        if (this.model.cacheEnable && this.model.storageKey) {
            this.getconfigfromapi()
                .then((res: any) => {
                    if (res && res.Columns) {
                        let colums: [] = JSON.parse(res.Columns);
                        this.model.settings = [];
                        colums.map((co, index) => {
                            let c = new ColumnSetting(co['caption'], co['dataField']);
                            c.visibled = co['visible'];
                            this.model.settings.push(c);
                        });
                    }
                })
                .catch((err) => {
                    console.error('the api err');
                });
        }
    }

    getconfigfromapi() {
        let params = this.getRequestParams();
        return this.http.post(`${environment.qlwCommonService}/component/getConfigOrUpdate`, params).toPromise();
    }

    // onUpdatePermission(permissionCode:PermissionService){
    //     if(!permissionCode.$$manager){
    //         if (this.model.type == 'list') {
    //             let addButton = <NxButton>this.model.getWidgetByKey('create');
    //             let delButton = <NxButton>this.model.getWidgetByKey('rangeDelete');
    //             if (addButton && addButton.props.visible) {
    //                 addButton.props.visible = permissionCode.$$add;
    //             }
    //             if (delButton && delButton.props.visible) {
    //                 delButton.props.visible = permissionCode.$$delete;
    //             }
    //         }
    //     }
    // }
    clear() {
        this.resetInfo(0);
        if (this.model.checkInfo.clearClick) {
            this.model.checkInfo.clearClick();
        }
    }
    onColumnSettingHidden(e) {
        this.model.columnSettingDisabled = false;
    }
    getRequestParams() {
        let columns = [];
        this.model.settings.map((item, index) => {
            columns.push({
                caption: item.caption,
                dataField: item.dataField,
                dataType: null, //toolbar不需要这个
                fixed: false, //toolbar不需要这个
                visible: item.visibled != undefined ? item.visibled : true,
                visibleIndex: index,
            });
        });
        var data = {
            moduleKey: this.model.storageKey,
            columns: columns,
        };
        return data;
    }
    onColumnSettingCheckEvent(e, dataField, caption) {
        // 设置缓存
        if (this.model.cacheEnable && this.model.storageKey) {
            localStorage.setItem(this.model.storageKey, JSON.stringify(this.model.settings));
            let params = this.getRequestParams();
            setTimeout(() => {
                this.http.post(`${environment.qlwCommonService}/component`, params).toPromise();
            }, 1000);
        }
        if (this.model.onColumnSetting) {
            this.model.onColumnSetting(e.value, dataField, caption);
        }
    }
    editValueChanged(caption, dataField, i) {
        if (caption == '') {
            this.model.settings[i].caption = this.columnName;
            return;
        }
        this.model.settings[i].edit = false;
        if (this.model.cacheEnable && this.model.storageKey) {
            localStorage.setItem(this.model.storageKey, JSON.stringify(this.model.settings));
            let params = this.getRequestParams();
            setTimeout(() => {
                this.http.post(`${environment.qlwCommonService}/component`, params).toPromise();
            }, 1000);
        }
        if (this.model.onColumnEditing) {
            this.model.onColumnEditing(caption, dataField);
        }
    }
    onSettingDropDownItemClick(e) {
        e.event.preventDefault();
        // this.blur();
        e.component.toggle(true).then((r) => { });
        return false;
    }
    onClickEvent(e, widget) {
        if (widget.events.onClick) {
            widget.events.onClick(e);
        }
    }
    onOtherButtonClickEvent(e, item, index) {
        if (item[index].events.onClick) {
            item[index].events.onClick(e);
        }
    }
    onMoreItemClickEvent(e) {
        if (this.model.moreButton.events.onItemClick) {
            this.model.moreButton.events.onItemClick(e.itemData);
        }
    }
    onButtonClickEvent(e, item) {
        if (item.events.onButtonClick) {
            item.events.onButtonClick(e);
        }
    }
    onItemClickEvent(e, item) {
        if (item.events.onItemClick) {
            item.events.onItemClick(e);
        }
    }
    onValueChanged(e, item) {
        if (item.events.onValueChanged) {
            item.events.onValueChanged(e);
        }
    }
    info(num: number) {
        this.model.checkInfo.message = stringHelper.format(NxTranslateI18N.I18N.commandOptions.selected.text, num + ''); // `已选择 ${num} 项`;
        this.model.checkInfo.checked = num;
        this.model.checkInfo.type = 'info';
        this.model.checkInfo.icon = ToolbarCheckIcon.info;
        this.checked = num;
        if (num <= 0) {
            (<NxButton>this.model.getWidgetByKey('rangeDelete')).props.disabled = true;
        } else {
            (<NxButton>this.model.getWidgetByKey('rangeDelete')).props.disabled = false;
        }
    }
    checkChange(num) {
        this.checked = num;
        if (!this.infoTimer) {
            this.model.checkInfo.type = 'info';
            this.model.checkInfo.message = stringHelper.format(NxTranslateI18N.I18N.commandOptions.selected.text, num); //`已选择 ${num} 项`;
            this.model.checkInfo.icon = ToolbarCheckIcon.info;
        }
        if (num <= 0) {
            (<NxButton>this.model.getWidgetByKey('rangeDelete')).props.disabled = true;
            (<NxButton>this.model.getWidgetByKey('rangeReview')).props.disabled = true;
            (<NxDropDownButton>this.model.getWidgetByKey('review')).props.disabled = true;
        } else {
            (<NxButton>this.model.getWidgetByKey('rangeDelete')).props.disabled = false;
            (<NxButton>this.model.getWidgetByKey('rangeReview')).props.disabled = false;
            (<NxDropDownButton>this.model.getWidgetByKey('review')).props.disabled = false;
        }
    }
    error(message: string, timeout: number = 3000) {
        this.model.checkInfo.type = 'error';
        this.model.checkInfo.message = message;
        this.model.checkInfo.icon = ToolbarCheckIcon.error;
        this.resetInfo(timeout);
    }
    success(message: string, timeout: number = 3000) {
        this.model.checkInfo.type = 'success';
        this.model.checkInfo.message = message;
        this.model.checkInfo.icon = ToolbarCheckIcon.success;
        this.resetInfo(timeout);
    }
    private resetInfo(timeout: number) {
        if (this.infoTimer) {
            clearTimeout(this.infoTimer);
        }
        this.infoTimer = setTimeout(() => {
            this.model.checkInfo.type = 'info';
            this.model.checkInfo.message = stringHelper.format(
                NxTranslateI18N.I18N.commandOptions.selected.text,
                this.checked + ''
            ); //`已选择 ${this.checked} 项`;
            this.model.checkInfo.icon = ToolbarCheckIcon.info;
            this.infoTimer = null;
        }, timeout);
    }

    showEdit(i) {
        if (!this.model.onColumnEditing) return;
        this.model.settings[i].edit = true;
        setTimeout(() => {
            let dom = document.querySelector('.textBox' + i + ' .dx-texteditor-input') as HTMLElement;
            dom.focus();
            this.columnName = this.model.settings[i].caption;
        }, 300);
    }
}

@NgModule({
    imports: [
        DxButtonModule,
        CommonModule,
        DxDropDownButtonModule,
        DxCheckBoxModule,
        DxPopupModule,
        DxScrollViewModule,
        SafeHtmlModule,
        DxTextBoxModule,
        DxRadioGroupModule,
    ],
    declarations: [NxToolbarPanelComponent],
    exports: [NxToolbarPanelComponent],
    providers: [RXJSService],
})
export class NxToolbarPanelModule { }
