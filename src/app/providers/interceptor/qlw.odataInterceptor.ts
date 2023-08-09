import { Injectable, Injector } from "@angular/core";
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { TokenAuthService } from 'src/app/shared/services';
import { Observable } from 'rxjs';
import { Notify } from '../notify';
import * as Rx from 'rxjs'; 

@Injectable()
export class OdatatQueryInterceptor implements CanActivate,CanActivateChild{
    constructor(
        private router: Router,
        private injector: Injector,
        private tokenService: TokenAuthService
    ){

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return true;
    }
    canActivateChild(childRoute: import("@angular/router").ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        throw new Error("Method not implemented.");
    }
}