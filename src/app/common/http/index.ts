import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Injectable, NgModule } from '@angular/core';

@Injectable()
export class HttpProvider {
    constructor(private _http: HttpClient) {}
    /** GET */
    get(url, params?) {
        let _options = {};
        if (params) {
            let _param = {};
            for (const key in params) {
                if (params[key] != undefined) {
                    _param[key] = params[key];
                }
            }
            _options['params'] = _param;
        }

        return this._http.get(url, _options).toPromise();
    }
    /** POST */
    post(url, params?) {
        return this._http.post(url, params).toPromise();
    }
    /** PUT */
    put(url, params?) {
        return this._http.put(url, params).toPromise();
    }
    /** DELETE */
    delete(url, params?) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: params,
        };
        return this._http.delete(url, options).toPromise();
    }
    /** FORM DATA */
    form(url, params, header?: { [name: string]: string | string[] }) {
        return this._http
            .post(url, params, {
                headers: Object.assign(
                    {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    header
                ),
            })
            .toPromise();
    }
    /** 文件上传 */
    upload(url, params, header?: { [name: string]: string | string[] }) {
        return this._http
            .post(url, params, {
                headers: header,
            })
            .toPromise();
    }
}

@NgModule({
    imports: [HttpClientModule],
    providers: [HttpProvider],
    exports: [HttpClientModule],
})
export class HttpProviderModule {}
