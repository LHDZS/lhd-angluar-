import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import DataSource from "devextreme/data/data_source";
import ODataStore from 'devextreme/data/odata/store';
import { Observable } from 'rxjs';
import { USER_INFO_CONTEXT } from "src/app/providers/context";
import { QlwODataContext } from 'src/app/providers/odataContext';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class SystemPigFarmBeginDateResolver implements Resolve<string>{
    constructor(private _context: QlwODataContext) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
        return  new DataSource({
                    store: new ODataStore({
                        url: `${environment.zlwBasicSettingServer}/oq/BizPigFarm`,
                        key: 'PigFarmId',
                        keyType: 'String',
                        version: 4,
                    }),
                    filter: [['PigFarmId ', '=', USER_INFO_CONTEXT.childId]],
                    pageSize: 1,
                    select: ['Begindate'],
                }).load().then(value => {
                    return value[0].Begindate
                })
    }

}

