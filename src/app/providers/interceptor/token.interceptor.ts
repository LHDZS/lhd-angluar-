import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { mergeMap } from 'rxjs/operators/mergeMap';
import { TokenAuthService } from '../../shared/services';
import { environment } from 'src/environments/environment';
import { TranslateI18N } from '../i18n-translate';

/*
 * @ TokenInterceptor implements HttpInterceptor
 * 请求拦截器
 * 1.获取token
 * 2.在headers中添加Jwt Token认证信息
 * 3.ignore过滤不需要认证的请求
 * 4.rxjs - [from,pipe,mergeMap] https://cloud.tencent.com/developer/doc/1257
 */
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(private authService: TokenAuthService) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const langReq = request.clone({
            headers:
                TranslateI18N.lang.indexOf('zh') > -1
                    ? request.headers.set('Accept-Language', 'zh')
                    : request.headers.set('Accept-Language', TranslateI18N.lang),
        });
        let needAuth = true;
        environment.token.requestIgnore.map((m) => {
            if (langReq.url.indexOf(m) > -1) {
                needAuth = false;
            }
        });
        if (!needAuth) {
            return next.handle(langReq);
        } else {
            if (request.headers.get('Authorization')) {
                if (request.url.indexOf('oq/BizPigHouseUnitWithPersonExpand') > -1) {
                    console.log(request.headers);
                }
                return next.handle(langReq);
            }
            return from(this.authService.tryGetCacheTokenOrRequest()).pipe(
                mergeMap((access_token) => {
                    if (access_token) {
                        const authorizedRequest = langReq.clone({
                            headers: langReq.headers.set('Authorization', access_token),
                        });
                        return next.handle(authorizedRequest);
                    } else {
                        return next.handle(langReq);
                    }
                })
            );
        }
    }
}
