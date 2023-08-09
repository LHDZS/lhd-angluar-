import { Injectable, NgModule } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppIdEnum } from "src/app/providers/appids";
import { USER_INFO_CONTEXT } from "src/app/providers/context";
import { PermissionContext, QlwODataContext } from 'src/app/providers/odataContext';
import { PermissionService } from "src/app/providers/permission";
import { TokenAuthService } from "../services";

@Injectable({
    providedIn: 'root'
})
export class SystemOptionResolver implements Resolve<string>{
    constructor(private _context: QlwODataContext) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
        const SYSTEM_OPTIONS_ID = route.data.SYSTEM_OPTIONS_ID
        const SYSTEM_OPTIONS_SCOPE = route.data.SYSTEM_OPTIONS_SCOPE
        return this._context.getSystemOptions(SYSTEM_OPTIONS_ID, SYSTEM_OPTIONS_SCOPE).then(response => {
            return response.optionValue
        })
    }
}


@Injectable({
    providedIn: 'root'
})
export class SystemOption_BatchIsZeroWillFinish_Resolver implements Resolve<string>{
    constructor(private _context: QlwODataContext) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
        const SYSTEM_OPTIONS_ID = route.data.SYSTEM_BATCHISZEROWILLFINISH_ID
        const SYSTEM_OPTIONS_SCOPE = route.data.SYSTEM_OPTIONS_SCOPE
        return this._context.getSystemOptions(SYSTEM_OPTIONS_ID, SYSTEM_OPTIONS_SCOPE).then(response => {
            return response.optionValue
        })
    }
}

@Injectable({
    providedIn: 'root'
})
@NgModule({
    providers: [
        TokenAuthService
    ],
})
export class TokenPremissResolver implements Resolve<string>{
    private id:string="0";
    constructor(private tokenService: TokenAuthService) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
        if (route.queryParams['id']) {
            this.id = route.queryParams['id']
          } else {
            this.id = USER_INFO_CONTEXT.childId
          }
        return this.tokenService.getTokenByAppId(AppIdEnum.farmset,this.id).then((token) => {
            return token;
        })
    }
}