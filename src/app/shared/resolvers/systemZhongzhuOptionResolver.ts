import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { QlwODataContext } from 'src/app/providers/odataContext';

@Injectable({
    providedIn: 'root'
})
export class systemZhongzhuOptionResolver implements Resolve<string>{
    constructor(private _context: QlwODataContext) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
        const SYSTEM_OPTIONS_SCOPE = route.data.SYSTEM_OPTIONS_SCOPE
        const SYSTEM_ZHONGZHUOPTIONS_ID = route.data.SYSTEM_ZHONGZHUOPTIONS_ID
        return this._context.getSystemOptions(SYSTEM_ZHONGZHUOPTIONS_ID, SYSTEM_OPTIONS_SCOPE).then(response => {
            console.log('SYSTEM_ZHONGZHUOPTIONS_ID:' + SYSTEM_ZHONGZHUOPTIONS_ID + ",VALUE:" + response.optionValue)
            return response.optionValue
        })
    }

}