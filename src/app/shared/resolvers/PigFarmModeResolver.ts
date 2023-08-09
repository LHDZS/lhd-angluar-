import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import { Observable } from 'rxjs';
import { USER_INFO_CONTEXT } from "src/app/providers/context";
import { QlwODataContext } from 'src/app/providers/odataContext';
import { environment } from "src/environments/environment";

@Injectable({
    providedIn: 'root'
})
export class PigFarmModeResolver implements Resolve<string>{
    constructor(private _context: QlwODataContext) {}
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {

        return new DataSource({
            store: new ODataStore({
                url: `${environment.zlwBasicSettingServer}/oq/BizPigFarmquery`,
                key: 'PigFarmId',
                keyType: 'String',
                version: 4,
            }),
            filter:['PigFarmId','=',USER_INFO_CONTEXT.childId]
            
        }).load().then(data => {
            if(data && data[0]){
                return data[0].CultureMode
            }else{
                return ''
            }
            
        })
    }

}