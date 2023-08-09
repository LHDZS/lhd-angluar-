import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppComponent } from './app.component';
import { RouterAuthService, ScreenService, AppInfoService, TokenAuthService } from './shared/services';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { TokenInterceptor } from 'src/app/providers/interceptor/token.interceptor';
import { HttpProviderModule } from 'src/app/common/http';
import { LocaleHttpDataReplacerInterceptor } from 'src/app/providers/interceptor/locale-http-data-replacer.interceptor';
// import zhMessages from 'devextreme/localization/messages/zh.json';
// import enMessages from 'devextreme/localization/messages/en.json';
// import viMessages from 'devextreme/localization/messages/vi.json';
// import { locale, loadMessages } from 'devextreme/localization';
import { sendRequestFactory } from './providers/interceptor/ng-http-client-helper';
import { LocationStrategy, HashLocationStrategy, registerLocaleData, PathLocationStrategy } from '@angular/common';
import {
    QlwODataContext,
    // ZlwBasicSettingODataContext,
    ZlwProductionODataContext,
    ZlwMaterialsODataContext,
    ZlwProductionSowODataContext,
    QlwProductContext,
    AuditReviewService,
    QlwCustomerContext,
    QlwSystemContext,
    ZbtGatewayContext,
    PermissionContext,
    ZlwBasicSemaningODataContext,
    ZlwBreedingODataContext,
    ProductODataContext,
} from './providers/odataContext';
import { environment } from 'src/environments/environment';
import { StatusODataContext } from './providers/odataContext/status.odataContext';
import { TranslateService, TranslateModule } from './providers/i18n-translate';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { USER_GUIDE_CONTEXT } from './providers/context';
import { NgZorroAntdModule, NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { FormsModule } from '@angular/forms';
import { QlwImportTemplateService } from './providers/data/excel-import-templates';
import { DataSourceAccessor } from './providers/common/DataSourceAccessor';
import { BasicSettingODataContext } from './providers/odataContext/q.odataContext';
import { LanguageType, NxTranslateI18N } from './nxin/i18n';
import * as devextremeAjax from 'devextreme/core/utils/ajax.js';
import { FmODataContext } from './providers/odataContext/fm.odataContext';
import { YHBasicSettingODataContext } from './providers/odataContext/yh.odataContext';
import { YHProductionODataContext } from './providers/odataContext/yhp.odataContext';

function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    if (window.location.href.indexOf('?') < 0) {
        return null;
    }
    let r = window.location.href.split('?')[1].match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}
/** 国际化 */
function i18nInitialization(translator: TranslateService) {
    let lang = getQueryString('lang');
    translator.initialization(lang);
    // if (lang == 'zhcn') {
    //   lang = 'zh_cn';
    // }
    NxTranslateI18N.initialization(lang as LanguageType);
}
const setDomain = () => {
    document.domain = environment.domain;
};
/** 应用初始化 */
export function __init__(tokenService: TokenAuthService, translator: TranslateService) {
    setDomain();
    // 国际化
    i18nInitialization(translator);
    // sessionStorage.clear();
    if (window.location.href.indexOf('pigproduct-homepage') >= 0) {
        return () => {};
    } else {
        return ()=>tokenService.requestToken();
        //return () => startCheckToken(tokenService);
    }
}

export function startCheckToken(tokenService: TokenAuthService) {
    let retryCount = 0;
    tokenService.tokenTimer = setInterval(() => {
        if (tokenService.validTokenIsExpire()) {
            if (retryCount > 3) {
                clearInterval(tokenService.tokenTimer);
                return;
            }
            tokenService.requestToken().then((res) => {
                if (!res) {
                    retryCount++;
                    // console.error('get token faild');
                } else {
                    clearInterval(tokenService.tokenTimer);
                }
            });
        }else{
            clearInterval(tokenService.tokenTimer);
        }
    }, environment.token.validationTiming);
}

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        HttpClientModule,
        TranslateModule,
        NgZorroAntdModule,
        FormsModule,
        HttpProviderModule
    ],
    providers: [
        ScreenService,
        AppInfoService,
        RouterAuthService,
        TokenAuthService,
        TranslateService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: LocaleHttpDataReplacerInterceptor,
            multi: true,
        },
        {
            provide: APP_INITIALIZER,
            useFactory: __init__,
            multi: true,
            deps: [TokenAuthService, TranslateService],
        },
        { provide: LocationStrategy, useClass: PathLocationStrategy },

        //#region [ODataContext]
        QlwODataContext,
        // ZlwBasicSettingODataContext,
        ZlwProductionODataContext,
        ZlwMaterialsODataContext,
        ZlwProductionSowODataContext,
        StatusODataContext,
        QlwProductContext,
        AuditReviewService,
        QlwCustomerContext,
        QlwSystemContext,
        ZbtGatewayContext,
        USER_GUIDE_CONTEXT,
        PermissionContext,
        QlwImportTemplateService,
        DataSourceAccessor,
        ZlwBasicSemaningODataContext,
        BasicSettingODataContext,
        ProductODataContext,
        ZlwBreedingODataContext,
        FmODataContext,
        YHBasicSettingODataContext,
        YHProductionODataContext,
        { provide: NZ_I18N, useValue: zh_CN },
        //#endregion
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(httpClient: HttpClient) {
        devextremeAjax.inject({ sendRequest: sendRequestFactory(httpClient) });
    }
}
