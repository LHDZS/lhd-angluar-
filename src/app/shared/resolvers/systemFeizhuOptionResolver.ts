import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { QlwODataContext } from 'src/app/providers/odataContext';

@Injectable({
    providedIn: 'root'
})
export class systemFeizhuOptionResolver implements Resolve<string>{
    constructor(private _context: QlwODataContext) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
        const SYSTEM_OPTIONS_SCOPE = route.data.SYSTEM_OPTIONS_SCOPE
        const SYSTEM_FEIZHUOPTIONS_ID = route.data.SYSTEM_FEIZHUOPTIONS_ID
        return this._context.getSystemOptions(SYSTEM_FEIZHUOPTIONS_ID, SYSTEM_OPTIONS_SCOPE).then(response => {
            
            return response.optionValue
        })
    }

}