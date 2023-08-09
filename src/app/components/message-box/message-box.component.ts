import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { DxPopupModule, DxScrollViewModule } from 'devextreme-angular';
import { NxTranslateI18N } from 'src/app/nxin/i18n';
import { SafeHtmlModule } from 'src/app/providers/pipes/safe-html.pipe';

@Component({
    selector: 'message-box-component',
    templateUrl: './message-box.component.html',
    styleUrls: ['./message-box.component.scss'],
})
export class MessageBoxComponent {
    messageBoxInfo: string[] = [];
    messageBoxVisible: boolean;
    messageBoxDisplayText = NxTranslateI18N.I18N.messageBox.text;
    notMessageDisplayText = NxTranslateI18N.I18N.messageBox.noMessage;

    /** 构造函数 */
    constructor() {

    }
    /** 消息盒子 */
    get messageBox() {
        let _this = this;
        return {
            show(message?) {
                _this.messageBoxVisible = true;

                if (message) {
                    if (message instanceof Array) {
                        _this.messageBoxInfo = message;
                        //if (_this.toolbarPanel) {
                        //    _this.toolbarPanel.model.getOtherWidgetByKey('messageBox').props.text = `${message.length}`;
                        //}
                    }
                }
            },
            clear() {
                _this.messageBoxInfo = [];
                //if (_this.toolbarPanel) {
                //    _this.toolbarPanel.model.getOtherWidgetByKey('messageBox').props.text = `0`;
                //}
            },
            hide() {
                _this.messageBoxVisible = false;
            },
            get info(): string[] {
                return _this.messageBoxInfo;
            },
            get infoNums(): number {
                return _this.messageBoxInfo.length;
            },
            get visible(): boolean {
                return _this.messageBoxVisible;
            },
        };
    }
}

@NgModule({
    imports: [
        CommonModule,
        DxPopupModule,
        DxScrollViewModule,
        SafeHtmlModule,
    ],
    declarations: [MessageBoxComponent],
    exports: [MessageBoxComponent],
    providers: [],
})
export class NxMessageBoxModule { }
