import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { QlwODataContext } from 'src/app/providers/odataContext';

@Injectable({
    providedIn: 'root'
})
export class systemMZXPOptionResolver implements Resolve<string>{
    constructor(private _context: QlwODataContext) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
        const SYSTEM_OPTIONS_SCOPE = 16;
        const SYSTEM_MZXPOPTIONS_ID = route.data.SYSTEM_MZXPOPTIONS_ID
        return this._context.getSystemOptions(SYSTEM_MZXPOPTIONS_ID, SYSTEM_OPTIONS_SCOPE).then(response => {
            return response.optionValue
        })
    }

}