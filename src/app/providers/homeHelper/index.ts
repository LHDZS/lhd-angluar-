import { environment } from 'src/environments/environment';
import { DateTime } from '../common/datetime';
import { TranslateI18N } from '../i18n-translate';

export class HomeHelper {
    static open(
        params: { id?: number; url: string; title: string; target?: number; iframeName?: string },
        action?: Function
    ) {
        if (environment.production) {
            let url = params.url;
            if (params.url.indexOf('?') > -1) {
                if (!(params.url.indexOf('appid') > -1)) {
                    url += `&appid=${window['userInfo'].appid}&lang=${TranslateI18N.lang}`;
                }
            } else {
                if (!(params.url.indexOf('appid') > -1)) {
                    url += `?appid=${window['userInfo'].appid}&lang=${TranslateI18N.lang}`;
                }
            }
            
            if (params.url.indexOf('?') > -1) {
                if (!(params.url.indexOf('groupId') > -1)) {
                    url += `&groupId=${window['userInfo'].groupId}`;
                }
            } else {
                if (!(params.url.indexOf('groupId') > -1)) {
                    url += `?groupId=${window['userInfo'].groupId}`;
                }
            }

            if (params.url.indexOf('?') > -1) {
                if (!(params.url.indexOf('enterpriseId') > -1)) {
                    url += `&enterpriseId=${window['userInfo'].enterpriseId}`;
                }
            } else {
                if (!(params.url.indexOf('enterpriseId') > -1)) {
                    url += `?enterpriseId=${window['userInfo'].enterpriseId}`;
                }
            }

            //childEnterpriseId
            if (params.url.indexOf('?') > -1) {
                if (!(params.url.indexOf('childEnterpriseId') > -1)) {
                    url += `&childEnterpriseId=${window['userInfo'].childEnterpriseId}`;
                }
            } else {
                if (!(params.url.indexOf('childEnterpriseId') > -1)) {
                    url += `?childEnterpriseId=${window['userInfo'].childEnterpriseId}`;
                }
            }

            var currentDate = new Date();
            
            if (window.parent == window) {
                window.open(url)
            } else {
                window.parent.postMessage({fn: 'open', data:{
                    id: params.id ? params.id : new DateTime().randomValue,
                    url: url,
                    title: params.title,
                    target: params.target ? params.target : 0,
                    iframeName: params.iframeName,
                }}, '*')
            }
            
        } else {
            action();
        }
    }
    static loginout() {
        if (window.top != null && window.top.document.URL != document.URL) {
            window.top.location.href = environment.token.homePage;
        } else {
            window.top.location.href = environment.token.homePage;
        }
    }
}
