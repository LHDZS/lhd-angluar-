import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { QlwODataContext } from 'src/app/providers/odataContext';

@Injectable({
    providedIn: 'root'
})
export class SystemOption2Resolver implements Resolve<string>{
    constructor(private _context: QlwODataContext) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
        const SYSTEM_OPTIONS_ID = route.data.SYSTEM_OPTIONS2_ID
        const SYSTEM_OPTIONS_SCOPE = route.data.SYSTEM_OPTIONS2_SCOPE
        return this._context.getSystemOptions(SYSTEM_OPTIONS_ID, SYSTEM_OPTIONS_SCOPE).then(response => {
            console.log('SYSTEM_OPTIONS2_ID:' + SYSTEM_OPTIONS_ID + ",VALUE:" + response.optionValue)
            return response.optionValue
        })
    }

}
