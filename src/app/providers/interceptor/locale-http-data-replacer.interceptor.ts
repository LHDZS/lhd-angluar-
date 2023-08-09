import { LanguageType } from './../../nxin/i18n/index';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { TokenAuthService } from '../../shared/services';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';
import getHtmlData from 'src/assets/i18n/http-data/index'
import { TranslateI18N } from '../i18n-translate';
import { isString } from 'util';

/*
 * @ TokenInterceptor implements HttpInterceptor
 * 请求拦截器
 * 1.获取token
 * 2.在headers中添加Jwt Token认证信息
 * 3.ignore过滤不需要认证的请求
 * 4.rxjs - [from,pipe,mergeMap] https://cloud.tencent.com/developer/doc/1257
 */
@Injectable()
export class LocaleHttpDataReplacerInterceptor implements HttpInterceptor {
    private htmlData: any;
    constructor(private authService: TokenAuthService) {
        this.htmlData = getHtmlData();
    }

    private getKey(value) {
        for (var key in this.htmlData) {
            if (key == value) {
                return this.htmlData[key];
            }
        }

        return null;
    }
    private testFormTran(data) {
        for (var i in data) {
            if (data.hasOwnProperty(i)) {
                let item = data[i];

                if (isString(item)) {
                    let translateValue = this.getKey(item);
                    if (!translateValue) {
                        continue;
                    }
                    if (translateValue) {
                        data[i] = translateValue;
                    }

                    continue;
                }
                if (item instanceof Function) {
                    continue;
                }
                if (item instanceof Object) {
                    this.testFormTran(item);
                    continue;
                }
                if (item instanceof Array) {
                    item.forEach((child) => {
                        this.testFormTran(child);
                    });
                    continue;
                }
            }
        }
    }

    translater(event: HttpEvent<any>) {
        if (event instanceof HttpResponse && event.status == 200) {
            const body: any = event.body;
            if (body instanceof Object) {
                // console.log(body);
                if (TranslateI18N.lang != LanguageType.zh_cn && TranslateI18N.lang != LanguageType.zh) {
                    this.testFormTran(body);
                }
            }
        }
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let needAuth = true;
        environment.token.requestIgnore.map((m) => {
            if (request.url.indexOf(m) > -1) {
                needAuth = false;
            }
        });
        // console.log(request.url);
        // if (!needAuth) {
        //     return next.handle(request).pipe(tap(event => {
        //         this.translater(event);
        //     }));
        // }
        // if (request.headers.get('Authorization')) {
        //     return next.handle(request);
        // }

        if (!needAuth || request.headers.get('Authorization')) {
            return next.handle(request).pipe(tap(event => {
                this.translater(event);
            }));
        }

        return from(this.authService.tryGetCacheTokenOrRequest()).pipe(
            mergeMap((access_token) => {
                if (access_token) {
                    console.log('locale', access_token)
                    // if (request.headers.get('Authorization')) {
                    //   return next.handle(request);
                    // }

                    const authorizedRequest = request.clone({
                        headers: request.headers.set('Authorization', access_token),
                    });
                    return next.handle(authorizedRequest).pipe(
                        tap(event => {
                            this.translater(event);
                        })
                    );
                }

                return next.handle(request);
            })
        );
    }
}
