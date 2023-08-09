import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import DataSource from "devextreme/data/data_source";
import ODataStore from 'devextreme/data/odata/store';
import { Observable } from 'rxjs';
import { USER_INFO_CONTEXT } from "src/app/providers/context";
import { QlwODataContext } from 'src/app/providers/odataContext';
import { environment } from "src/environments/environment";
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class SystemMemberResolver implements Resolve<string>{
    constructor(private _context: QlwODataContext, private http: HttpClient) { }
    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): string | Observable<string> | Promise<string> {
        const SYSTEM_MEMBERS_IDs = route.data.SYSTEM_MEMBER_ID
        return this._context.getIsOpen(SYSTEM_MEMBERS_IDs).then(response => {
            if (response && response['code'] == 0){
                return response['data'];
            }else{
                return false
            }  
        })
        
    }

}

