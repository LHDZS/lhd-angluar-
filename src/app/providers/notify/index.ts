/**
 * 消息通知服务方法
 */

import notify from 'devextreme/ui/notify';
import { custom, alert } from 'devextreme/ui/dialog';
import { TranslateI18N, TranslateService } from '../i18n-translate';

export class MessageBox {
    static info(message) {
        notify(message, 'info', 5000);
    }
    // '提示'
    static confirm(message: string, title: string = TranslateI18N.I18N.component.tips): Promise<boolean> {
        let customConfirm = custom({
            title: title,
            messageHtml: message,
            buttons: [
                {
                    text: TranslateI18N.I18N.component.confirm, //确认
                    stylingMode: 'contained',
                    type: 'default',
                    onClick: e => {
                        return true;
                    },
                },
                {
                    text: TranslateI18N.I18N.component.cancel, //'取消',
                    onClick: e => {
                        return false;
                    },
                },
            ],
        });

        return customConfirm.show();
    }
}
export class Notify {
    static custom(
        config: {
            message: string;
            width: string;
            height: string;
            position: {
                at: string;
                of: string;
                offset: string;
            };
        },
        type?: string,
        displayTime?: number
    ) {
        notify(config, type, displayTime);
    }
    static alert(messageHtml: string, title: string) {
        alert(messageHtml, title);
    }
    static toast(message: string, type: NotifyType = NotifyType.Success, width: string = '400', delay: number = 5000) {
        const option = {
            message: message,
            position: 'top right',
            width: 'auto',
            minWidth: '220',
            closeOnClick: true,
        };
        notify(option, type.toString(), delay);
    }
    static customToast(option?: any, type?: string, delay: number = 5000) {
        notify(option, type, delay);
    }
    static success(message: string) {
        Notify.toast(message, NotifyType.Success);
    }
    static error(message: string) {
        Notify.toast(message, NotifyType.Error);
    }
    static warning(message: string) {
        Notify.toast(message, NotifyType.Warning);
    }
}
export enum NotifyType {
    Success = 'success',
    Warning = 'warning',
    Error = 'error',
}
