import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { environmentType } from 'src/environments/environmentType';
import { Notify, NotifyType } from 'src/app/providers/notify';
import { USER_INFO_CONTEXT } from 'src/app/providers/context';
import { PermissionService } from 'src/app/providers/permission';
import { Result } from 'src/app/providers/result';
import { Observable } from 'rxjs/Observable';
import { TranslateService } from 'src/app/providers/i18n-translate';
import { AppIdEnum } from 'src/app/providers/appids';
import { DataDictionary, SystemOptionType } from 'src/app/providers/enums';
import { QlwODataContext } from 'src/app/providers/odataContext';
import { CHICKEN_FARM_CONTEXT } from 'src/app/providers/chickenFarm';

/**
 * 从本地缓冲获取单位token信息
 */
export function getEnterpriseIdFromStorage(valueType: string) {
    var sessions = Object.keys(sessionStorage);
    var params = window.location.href.split('?');
    if (params.length > 1) {
        let index = params[1].indexOf('appid');
        if (index < 0) return null;
        let appid = params[1].substr(index).split('=')[1];
        if (appid) {
            let temp = sessions.filter((x) => x.indexOf(appid) > 0)[0];
            if (temp) {
                let eIndex = temp.indexOf('E');
                let mIndex = temp.indexOf('M');
                let cIndex = temp.indexOf('C');
                if (valueType == 'E') {
                    // window['userInfo'].enterpriseId = temp.substring(eIndex + 1, mIndex);
                    return temp.substring(eIndex + 1, mIndex);
                } else if (valueType == 'C') {
                    // window['userInfo'].childEnterpriseId = temp.substring(cIndex + 1);
                    return temp.substring(cIndex + 1);
                }
            }
        }
    }
    return null;
}
@Injectable()
export class TokenAuthService {
    public TOKEN_KEY: string;
    public tokenTimer: any;
    private TOKEN_API_SERVER: string;
    private TOKEN_API_ROUTE: string = '/api/auth';
    TOKEN_EXPIRE_SIGN: string = 'TOKEN_EXPIRE_SIGN';
    private toeknRequestParams: any;
    private isRequestingToken: boolean = false;
    // public static permissionCode: string;
    constructor(private http: HttpClient) {

        switch (environment.environmentType) {
            case environmentType.uat: //测试
            case environmentType.production: //正式
                this.toeknRequestParams = {
                    userId: window['userInfo'].userid,
                    enterpriseId: window['userInfo'] ? window['userInfo'].enterpriseId : null,
                    menuId: window['userInfo'] ? window['userInfo'].appid : null,
                    childId: window['userInfo'] ? window['userInfo'].childEnterpriseId : null,
                    groupId: window['userInfo'] ? window['userInfo'].groupId : null,
                    gId: window['userInfo'] ? window['userInfo'].gId : null,
                };
                if (this.toeknRequestParams.enterpriseId == null || this.toeknRequestParams.enterpriseId == '') {
                    this.toeknRequestParams.enterpriseId = getEnterpriseIdFromStorage('E');
                    this.toeknRequestParams.childId = getEnterpriseIdFromStorage('C');
                }
                if (!this.toeknRequestParams.enterpriseId) return;
                this.TOKEN_API_SERVER = `${environment.token.server}?e=${this.toeknRequestParams.enterpriseId}&m=${this.toeknRequestParams.menuId}&ce=${this.toeknRequestParams.childId}&g=${this.toeknRequestParams.groupId}&open_req_src=${environment.appSource}`; //

                break;

            case environmentType.local: //本地
            case environmentType.develop: //开发
            default:
                // if(window['userInfo'].appid == '' || window['userInfo'].appid == null)throw new Error("请在地址栏拼接上appid");
                // get config data
                this.toeknRequestParams = {
                    userId: environment.token.userInfo.userId,
                    enterpriseId: environment.token.userInfo.enterpriseId,
                    menuId: environment.token.userInfo.menuId,
                    childId: environment.token.userInfo.childId,
                    groupId: environment.token.userInfo.enterGroupId,
                };
                this.TOKEN_API_SERVER = `${environment.token.server}${this.TOKEN_API_ROUTE}?user_id=${this.toeknRequestParams.userId}&enterprise_id=${this.toeknRequestParams.enterpriseId}&menu_id=${this.toeknRequestParams.menuId}&child_enterprise_id=${this.toeknRequestParams.childId}&group_id=${this.toeknRequestParams.groupId}`; //&open_req_src=${this.SOURCE}
                break;
        }
        this.TOKEN_KEY = `U${this.toeknRequestParams.userId}E${this.toeknRequestParams.enterpriseId}M${this.toeknRequestParams.menuId}C${this.toeknRequestParams.childId}`;
    }
    public get token() {
        return this.token_cache;
    }
    /*
     * token_cache缓存
     */
    private get token_cache() {
        let value = sessionStorage.getItem(this.TOKEN_KEY);
        return value;
    }

    private set token_cache(value) {
        sessionStorage.setItem(this.TOKEN_KEY, value);
    }
    /*
     * 验证Token是否过期
     */
    private get token_isExpired(): Boolean {
        const jwtHelper = new JwtHelperService();
        let isExpired = jwtHelper.isTokenExpired(this.token_cache);
        return isExpired;
    }
    //获取token数据
    public get getTokenData(): TokenData {
        const jwtHelper = new JwtHelperService();
        //this.token 指向 this.tokencache this.tokencache会在初始化从session中读取
        const tokenInfo: TokenData = jwtHelper.decodeToken(this.token);
        if (tokenInfo) {
            return tokenInfo;
        } else {
            return null;
        }
    }
    public getPermission(): Promise<TokenData> {
        const jwtHelper = new JwtHelperService();
        const tokenInfo: TokenData = jwtHelper.decodeToken(this.token);
        return new Promise((resolve, reject) => {
            resolve(tokenInfo);
        });
    }
    public getTokenDataWithToken(token: string) {
        const jwtHelper = new JwtHelperService();
        const tokenInfo = jwtHelper.decodeToken(token);
        return tokenInfo;
    }
    public removeTokenExpireSign() {
        sessionStorage.removeItem(this.TOKEN_EXPIRE_SIGN);
    }
    /*
     * 验证Token是否存在，验证Token是否过期，验证是否需要预刷新Token
     */
    public validationToken() {
        // const ISEXPIRED = sessionStorage.getItem(this.TOKEN_EXPIRE_SIGN);
        if (!this.token_cache || this.token_isExpired) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 验证token是否过期
     */
    public validTokenIsExpire(): boolean {
        let tokenInfo = this.getTokenData;
        if (!tokenInfo) return true;
        // let lat = tokenInfo.iat ? new Date(tokenInfo.iat): new Date();
        //过期时间
        let exp = tokenInfo.exp ? new Date(parseInt(tokenInfo.exp.toString()) * 1000) : new Date();
        let exp_utc_date = this.convertLocalTimeToUtcTime(exp);
        //当前UTC时间
        let current_utc_date = this.convertLocalTimeToUtcTime();
        let diff = this.getDiff(exp_utc_date, current_utc_date);
        if (diff > 5 * 60) {
            return false;
        }
        return true;
    }
    /**
     * compare time diff seconds
     * @param dateEnd end time
     * @param dateBegin start time
     */

    public getDiff(dateEnd: Date, dateBegin: Date) {
        let dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
        let dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
        let leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
        let hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
        //计算相差分钟数
        let leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
        let minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
        let leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
        let seconds = Math.round(leave3 / 1000);
        //(" 相差 "+dayDiff+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒");
        let totalSecond = hours * 60 * 60 + minutes * 60 + seconds;
        return totalSecond;
    }

    /**
     * local date convert to utc date
     * @param date local date
     */
    public convertLocalTimeToUtcTime(date?: Date): Date {
        var localDate = date ? date : new Date();
        let localTime = localDate.getTime();
        let localOffset = localDate.getTimezoneOffset() * 60000; //获取当地时间便宜的毫秒数
        let utc = localTime + localOffset; //utc 也就是GMT时间
        let utcDate = new Date(utc);
        return utcDate;
    }

    requestTokenWithAppId(appid: string): Promise<number> {
        if (!appid) {
            return new Promise<number>((resolve, reject) => {
                resolve(-1);
            });
        }
        return new Promise<number>((resolve, reject) => {
            let url = '';
            if (
                environment.environmentType == environmentType.develop ||
                environment.environmentType == environmentType.local
            ) {
                url = `${environment.token.server}${this.TOKEN_API_ROUTE}?user_id=${this.toeknRequestParams.userId}&enterprise_id=${this.toeknRequestParams.enterpriseId}&menu_id=${appid}&child_enterprise_id=${this.toeknRequestParams.childId}`; //&open_req_src=${this.SOURCE}
            } else {
                url = `${environment.token.server}?e=${this.toeknRequestParams.enterpriseId}&m=${appid}&ce=${this.toeknRequestParams.childId}&open_req_src=${environment.appSource}`; //
            }
            this.http
                .get(
                    `${url}`,
                    environment.environmentType == environmentType.production ||
                        environment.environmentType == environmentType.uat
                        ? { withCredentials: true }
                        : {}
                )
                .toPromise()
                .then((result: any) => {
                    let token = `${result['data']['token_type']} ${result['data']['token']}`;
                    const jwtHelper = new JwtHelperService();
                    const tokenInfo: TokenData = jwtHelper.decodeToken(token);
                    resolve(tokenInfo.permissions);
                })
                .catch((error) => {
                    resolve(-1);
                    switch (error.status) {
                        case 401:
                            Notify.toast('无权限,请检查权限设置', NotifyType.Error);
                            break;
                    }
                });
        });
    }
    /**
     * 通过APPID获取Token
     * @param appid 菜单ID
     */
    getTokenByAppId(appid: string, pigfarmid?: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            if (!appid) {
                resolve(null);
            }
            let url = '';
            if (
                environment.environmentType == environmentType.develop ||
                environment.environmentType == environmentType.local
            ) {
                url = `${environment.token.server}${this.TOKEN_API_ROUTE}?user_id=${this.toeknRequestParams.userId}&enterprise_id=${this.toeknRequestParams.enterpriseId}&menu_id=${appid}&child_enterprise_id=${pigfarmid ? pigfarmid : this.toeknRequestParams.childId}`; //&open_req_src=${this.SOURCE}
            } else {
                url = `${environment.token.server}?e=${this.toeknRequestParams.enterpriseId}&m=${appid}&ce=${pigfarmid ? pigfarmid : this.toeknRequestParams.childId}&open_req_src=${environment.appSource}`; //
            }
            this.http
                .get(
                    `${url}`,
                    environment.environmentType == environmentType.production ||
                        environment.environmentType == environmentType.uat
                        ? { withCredentials: true }
                        : {}
                )
                .toPromise()
                .then((result: any) => {
                    const token = `${result['data']['token_type']} ${result['data']['token']}`;
                    resolve(token);
                })
                .catch((error) => {
                    resolve(null);
                    switch (error.status) {
                        case 401:
                            Notify.toast('无权限,请检查权限设置', NotifyType.Error);
                            break;
                    }
                });
        });
    }
    /**
     * 从获取token的链接拿token
     */
    getAppIdWithTokenService(): string {
        var appId = '',
            from = 0,
            parm = '';
        if (
            environment.environmentType == environmentType.develop ||
            environment.environmentType == environmentType.local
        ) {
            parm = 'menu_id=';
            from = this.TOKEN_API_SERVER.indexOf(parm) + parm.length;
            appId = this.TOKEN_API_SERVER.substr(from, 19);
        } else {
            parm = 'm=';
            from = this.TOKEN_API_SERVER.indexOf(parm) + parm.length;
            appId = this.TOKEN_API_SERVER.substr(from, 19);
        }

        return appId;
    }
    /*
     * 请求认证中心获取Token
     */
    requestToken(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.http
                .get(
                    `${this.TOKEN_API_SERVER}`,
                    environment.environmentType == environmentType.production ||
                        environment.environmentType == environmentType.uat
                        ? { withCredentials: true }
                        : {}
                )
                .toPromise()
                .then((result: any) => {
                    let token = this.resolveTokenFromResult(result);
                    resolve(token);
                })
                .catch((error) => {
                    this.isRequestingToken = false;
                    switch (error.status) {
                        case 401:
                            Notify.toast('无权限,请检查权限设置', NotifyType.Error);
                            break;
                    }
                });
        });
    }
    //将token写入缓存 并返回token
    resolveTokenFromResult(result: any) {
        switch (environment.environmentType) {
            case environmentType.uat: //测试
            case environmentType.production: //正式
                if (result['code'] != 200) {
                    if (result.code === 10011) {
                        window.top.location.href = environment.token.homePage;
                    }
                    throw new Error('get token fail please check serve');
                }
                break;
            default:
                break;
        }
        this.token_cache = `${result['data']['token_type']} ${result['data']['token']}`;
        return this.token_cache;
    }
    /*
     * AwaitSetTokenCache 请求认证中心获取Token
     * 1.首先从sessionStorage中获取token,如果没有到认证中心获取
     * 2.如果sessionStorage中有token,JWT算法判断token是否过期
     * 3.如果token没有过期直接返回token
     * 4.如果token过期到认证中心重新获取token
     */
    public tryGetCacheTokenOrRequest(): Promise<string> {
        if (this.validTokenIsExpire()) {
            return new Promise<string>((resolve, reject) => {
                this.requestToken()
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((error) => {
                        console.error(error);
                        throw new Error('Get token request failed.');
                    });
            });
        } else {
            return new Promise<string>((resolve, reject) => {
                resolve(this.token_cache);
            });
        }
    }
}

/*
 * RouterAuthService
 * 路由的权限校验,登录之后必须有token,可以过期但不可以为空
 * 测试阶段暂不验证
 */
@Injectable()
export class RouterAuthService {
    /*
     * 测试阶段写死为true,之后要改为校验登录状态,默认为false
     */
    loggedIn = true;

    constructor(private router: Router, private tokenAuthService: TokenAuthService) { }

    logIn(login: string, password: string) {
        this.loggedIn = true;
        this.router.navigate(['/']);
    }

    logOut() {
        this.loggedIn = false;
        // HomeHelper.loginout();
        this.router.navigate(['/login-form']);
    }

    get isLoggedIn() {
        return this.loggedIn;
    }
}

/*
 * AuthGuardService
 * 路由的权限控制
 */
@Injectable()
export class AuthGuardService implements CanActivate {
    permission: PermissionService = new PermissionService();
    constructor(private tokenService: TokenAuthService, 
        private http: HttpClient, 
        private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | boolean {
        let isExpire = this.tokenService.validTokenIsExpire();
        if (isExpire) {
            this.tokenService.requestToken().then((res: any) => {
                return this.checkPermissions(route)
            });
        } else {
            return this.checkPermissions(route)
        }
    }
    //获取权限码  获取不到的话提示没有查看权限，获取得到刷新权限码   判断权限
    checkPermissions(route: ActivatedRouteSnapshot): Observable<boolean> | boolean {
        if (this.tokenService.getTokenData.permissions) {
            this.permission.refresh(this.tokenService.getTokenData.permissions);
            if (!this.permission.$$visible) {
                this.router.navigate(['/']);
                Notify.toast('您没有查看权限', NotifyType.Error);
            }
            route.params = {
                permission: this.permission,
            };
            return true;
        } else {
            this.router.navigate(['/']);
            Notify.toast('您没有查看权限', NotifyType.Error);
            return false;
        }
    }
}
/**
 * 路由守卫：验证当前用户是否选择了鸡场
 */
export class HasChickenFarmGuard implements CanActivate {
    constructor(private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot): boolean {
        // 获取鸡场ID
        const childId = USER_INFO_CONTEXT.childId;
        // console.log(childId);
        if (!childId || childId.toString() == '0') {
            this.router.navigate(['/invalid/invalid-pigfarm']);
        } else {
            return true;
        }
    }
}

/**
 * 路由守卫：取当前鸡场的农场类型
 */
 export class RequireFarmTypeGuard implements CanActivate {
    guideUrl: string = `${environment.poultryBasicSettingReadServer}/oq/BizChickenFarmGuard?numericalOrder=${USER_INFO_CONTEXT.childId}`;
    toeknRequestParams: any;
    i18n: any;
    isFinish: boolean = false;
    permission: PermissionService = new PermissionService();
    constructor(
        private router: Router,
        private http: HttpClient,
        private tokenService: TokenAuthService,
        private translator: TranslateService
    ) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        this.i18n = this.translator.I18N.indexPage;
        return new Observable<boolean>((observer) => {
            this.tokenService.requestToken().then(d => {
                this.permission.refresh(this.tokenService.getTokenData.permissions);
                if (USER_INFO_CONTEXT.childId == 0) {
                    USER_INFO_CONTEXT.childFarmType = null;
                    observer.next(true);
                    observer.complete();
                }else {
                    this.http.get(this.guideUrl, {
                        withCredentials: true
                    }).toPromise().then(data => {
                        console.log(data);
                        var data = data['value'][0];
                        USER_INFO_CONTEXT.childFarmType = data['ChickenFarmType'];
                        observer.next(true);
                        observer.complete();
                    });
                }
            });
        });
    }

}


/**
 * 路由守卫：验证当前用户是否选择了种禽孵化厂
 */
 export class HatcheryFarmTypeGuard implements CanActivate {
    guideUrl: string = `${environment.poultryBasicSettingReadServer}/oq/BizChickenFarmGuard?numericalOrder=${USER_INFO_CONTEXT.childId}`;
    toeknRequestParams: any;
    i18n: any;
    isFinish: boolean = false;
    permission: PermissionService = new PermissionService();
    constructor(
        private router: Router,
        private http: HttpClient,
        private tokenService: TokenAuthService,
        private translator: TranslateService
    ) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        this.i18n = this.translator.I18N.indexPage;
        return new Observable<boolean>((observer) => {
            this.tokenService.requestToken().then(d => {
                this.permission.refresh(this.tokenService.getTokenData.permissions);
                this.http.get(this.guideUrl, {
                    withCredentials: true
                }).toPromise().then(data => {
                    var data = data['value'][0];
                    // console.log(data);
                    if (CHICKEN_FARM_CONTEXT.CheckHatcheryFarm(data['ChickenFarmType']))
                    {
                        USER_INFO_CONTEXT.childFarmType = data['ChickenFarmType'];
                        observer.next(true);
                        observer.complete();
                    }else {
                        this.router.navigate(['/invalid/invalid-pigfarm'],{
                            queryParams: { type: 'HatcheryFarm' },
                        });
                    }
                });
            });
        });
    }

}

/**
 * 路由守卫：验证当前用户是否选择了种禽场
 */
 export class ChickenFarmTypeGuard implements CanActivate {
    guideUrl: string = `${environment.poultryBasicSettingReadServer}/oq/BizChickenFarmGuard?numericalOrder=${USER_INFO_CONTEXT.childId}`;
    toeknRequestParams: any;
    i18n: any;
    isFinish: boolean = false;
    permission: PermissionService = new PermissionService();
    constructor(
        private router: Router,
        private http: HttpClient,
        private tokenService: TokenAuthService,
        private translator: TranslateService
    ) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        this.i18n = this.translator.I18N.indexPage;
        return new Observable<boolean>((observer) => {
            this.tokenService.requestToken().then(d => {
                this.permission.refresh(this.tokenService.getTokenData.permissions);
                this.http.get(this.guideUrl, {
                    withCredentials: true
                }).toPromise().then(data => {
                    var data = data['value'][0];
                    //console.log(data);
                    if (CHICKEN_FARM_CONTEXT.CheckBreedingFarm(data['ChickenFarmType']))
                    {
                        USER_INFO_CONTEXT.childFarmType = data['ChickenFarmType'];
                        observer.next(true);
                        observer.complete();
                    }else {
                        this.router.navigate(['/invalid/invalid-pigfarm'],{
                            queryParams: { type: 'ChickenFarm' },
                        });
                    }
                });
            });
        });
    }

}
export class HasBatchGuard implements CanActivate {
    constructor(private router: Router, private qlwODataContext: QlwODataContext) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        // 获取猪场ID
        return new Observable<boolean>((observer) => {
            this.qlwODataContext.getSystemOptions(SystemOptionType.ZHONGZHUPICIGUANLI, 4).then((res) => {

                if (res['optionValue'] == '0') {
                    observer.next(false);
                    observer.complete();
                    this.router.navigate(['/invalid/invalid-pigfarm'], {
                        queryParams: { type: 'batch' },
                    });
                } else {
                    observer.next(true);
                    observer.complete();
                }
            });
        })



    }
}

export class HasSemenBatchGuard implements CanActivate {
    constructor(private router: Router,
        private http: HttpClient
        , private qlwOdataContext: QlwODataContext

    ) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {

        return new Observable<boolean>((observer) => {
            this.http.get(`${environment.qlwCommonService}/api/systemoption/get?optionid=${SystemOptionType.SHIFOUQIYONGJINYEPI}&scopecode=4`)
                .toPromise().then((result: Result) => {
                    console.log(result.data.OptionValue);
                    if (result.data.OptionValue == '1') {
                        observer.next(true);
                        observer.complete();
                    } else {
                        this.router.navigate(['/invalid/invalid-systemOption']);

                    }
                })
        })
    }
}
/**
 * 路由守卫：验证是否进行猪场初始化设置
 */
export class IsPigFarmInit implements CanActivate {
    guideUrl: string = `${environment.zlwUri}/guide`;
    toeknRequestParams: any;
    i18n: any;
    isFinish: boolean = false;
    permission: PermissionService = new PermissionService();
    constructor(
        private router: Router,
        private http: HttpClient,
        private tokenService: TokenAuthService,
        private translator: TranslateService
    ) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        this.i18n = this.translator.I18N.indexPage;
        return new Observable<boolean>((observer) => {
            // this.http.get(`${environment.qlwCommonService}/api/Permission/GetPermission`).toPromise().then((result: Result) => {
            //     const response = ResponseSuccess.handle(result);
            //     if (response.status) {
            //         if (response.data != null || response.data != undefined) {
            //             sessionStorage.setItem('permissionCode', response.data);
            //             this.permission.refresh(response.data);
            //         } else {
            //             this.permission.refresh(this.tokenService.getTokenData.permissions);
            //         }
            //     }

            this.tokenService.requestToken().then((res) => {
                this.tokenService.getTokenByAppId(AppIdEnum.farmset).then((token) => {
                    this.http.get(`${environment.zlwBasicSettingServer}/BizPigFarm/GetFinishGuide`, {
                        headers: {
                            Authorization: token,
                        },
                    }).toPromise().then(data => {
                        if (data && data['data']) {
                            observer.next(true);
                            observer.complete();
                        } else {
                            observer.next(false);
                            observer.complete();
                            window.parent.postMessage({ data: "猪场初始设置" }, '*')
                            this.http.get(`${environment.gatway.getopenapp}?enter_id=${USER_INFO_CONTEXT.enterpriseId}&type=201710240104402022&ids=${environment.memberVersion.join(',')}`, {
                                withCredentials: true
                            }).toPromise().then(data => {
                                if (data && data['code'] == 0 && data['data']) {//会员版
                                    this.router.navigate(['/guide-member']);
                                } else {
                                    this.router.navigate(['/guide'], {
                                        queryParams: {
                                            setting: 'pigfarm'
                                        },
                                    });
                                }
                            })
                        }
                    });
                });
            });
        });
    }
}
export class HasGuideGuard implements CanActivate {
    guideUrl: string = `${environment.zlwUri}/guide`;
    toeknRequestParams: any;
    i18n: any;
    isFinish: boolean = false;
    permission: PermissionService = new PermissionService();
    constructor(
        private router: Router,
        private http: HttpClient,
        private tokenService: TokenAuthService,
        private translator: TranslateService
    ) { }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        this.i18n = this.translator.I18N.indexPage;
        return new Observable<boolean>((observer) => {
            this.tokenService.requestToken().then(d => {
                this.permission.refresh(this.tokenService.getTokenData.permissions);
                this.http.get(`${environment.gatway.getopenapp}?enter_id=${USER_INFO_CONTEXT.enterpriseId}&type=201710240104402022&id=${environment.globalVersion}`, {
                    withCredentials: true
                }).toPromise().then(data => {
                    let res = false
                    if (data && data['code'] == 0) {
                        res = data['data']
                    }
                    this.goSetting(observer, res)
                });
            });
        });
    }
    goSetting(observer, isOpenGlobal) {
        if (isOpenGlobal) {
            observer.next(true);
            observer.complete();
            return;
        }
        let i = 0;
        this.tokenService.getTokenByAppId(AppIdEnum.pighouse).then((token) => {
            this.getPigHouseData(token).then((data) => {
                i++;
                this.check(data['@odata.count'], observer, i);
            }).catch(err => {
                i++
                this.check(null, observer, i);
            })
        });

        this.tokenService.getTokenByAppId(AppIdEnum.boar).then((token) => {
            this.getFileData(token).then((data) => {
                i++;
                this.check(data, observer, i);
            }).catch(err => {
                i++
                this.check(null, observer, i);
            })
        });

        this.tokenService.getTokenByAppId(AppIdEnum.sowinitial).then((token) => {
            this.getSowInitial(token).then((data) => {
                i++;
                this.check(data, observer, i);
            }).catch(err => {
                i++
                this.check(null, observer, i);
            })
        });
        this.tokenService.getTokenByAppId(AppIdEnum.boarinitial).then((token) => {
            this.getBoarInitial(token).then((data) => {
                i++;
                this.check(data, observer, i);
            }).catch(err => {
                i++
                this.check(null, observer, i);
            })
        });

        this.tokenService.getTokenByAppId(AppIdEnum.fatinitial).then((token) => {
            this.getFatInitial(token).then((data) => {
                i++;
                this.check(null, observer, i);
            }).catch(err => {
                i++
                this.check(null, observer, i);
            })
        });
    }

    getPigHouseData(token) {
        return this.http
            .get(`${environment.zlwBasicSettingServer}/oq/BizPigHouseUnitWithPersonExpandNoAuth?$count=true`, {
                headers: {
                    Authorization: token,
                },
            })
            .toPromise();
    }
    getFileData(token) {
        return this.http
            .get(`${environment.zlwBasicSettingServer}/oq/BizPigExpandSqlNoAuth/$count`, {
                headers: {
                    Authorization: token,
                },
            })
            .toPromise();
    }
    getBoarInitial(token) {
        return this.http
            .get(`${environment.zlwProductionReadServer}/oq/BoarInitialNoAuth/$count`, {
                headers: {
                    Authorization: token,
                },
            })
            .toPromise();
    }
    getSowInitial(token) {
        return this.http
            .get(`${environment.zlwProductionReadServer}/oq/SowInitialNoAuth/$count`, {
                headers: {
                    Authorization: token,
                },
            })
            .toPromise();
    }
    getFatInitial(token) {
        return this.http
            .get(`${environment.zlwProductionReadServer}/oq/FatInitialNoAuth/$count`, {
                headers: {
                    Authorization: token,
                },
            })
            .toPromise();
    }
    check(data, observer, i) {
        if (this.isFinish) {
            return;
        }
        if (data) {
            this.isFinish = true;
            observer.next(true);
            observer.complete();
            return;
        }
        if (i == 5) {
            observer.next(false);
            observer.complete();
            this.router.navigate(['guide'], {
                queryParams: {
                    setting: 'pigfarm',
                },
            });
        }
    }
}
/**
 * Token的返回结果Model
 */
export class TokenResult {
    /**
     * 表示Token的请求状态：Success为true,Failed为false
     */
    status: boolean;
    /**
     * 信息
     */
    message: string;
    /**
     * 返回值
     */
    data: { token: string; token_type: string };
}
export class TokenData {
    aud: string;
    /**
     * 单位ID
     */
    enterprise_id: string;
    /**
     * 猪场ID
     */
    child_enterprise_id: string;
    /**
     * 过期时间戳
     */
    exp: number;
    /**
     * 颁发时间戳
     */
    iat: number;
    /**
     * 颁发者
     */
    iss: string;
    /**
     * 菜单ID
     */
    menu_id: string;
    /**
     * 权限码
     */
    permissions: number;
    /**
     * 用户ID
     */
    user_id: string;
    /**
     * 集团ID
     */
    group_id: string;
}
