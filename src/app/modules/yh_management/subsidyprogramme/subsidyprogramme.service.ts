import ODataStore from 'devextreme/data/odata/store';
import { TokenAuthService } from 'src/app/shared/services';
import { Injectable } from '@angular/core';
import DataSource from 'devextreme/data/data_source';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { FormOptions } from 'src/app/providers/enums';
import { ODATA_URL_INFO } from 'src/app/providers/odataContext/data';

@Injectable()
export class SubsidyProgrammeService {
    constructor(private tokenService: TokenAuthService, private http: HttpClient) {}
    get store() {
        return new ODataStore({
            url: `${ODATA_URL_INFO.yhBasicSettingOdataUrl}/SubsidyProgrammeList`,
            key: 'YHSubsidyID',
            keyType: 'String',
            version: 4,
            beforeSend: (e) => {
                e.headers = {
                    Authorization: this.tokenService.token,
                };
            },
        });
    }
    getDataSource(): DataSource {
        return new DataSource({
            store: this.store,
            // expand: [
            //     'PoultryTypeBizDataDict($select=DictName)',
            // ],
        });
    }
    save(data, option: FormOptions): Promise<any> {
        if (option == FormOptions.$create) {
            return this.http.post(`${environment.yhBasicSettingServer}/SubsidyProgramme`, data).toPromise();
        } else {
            return this.http.put(`${environment.yhBasicSettingServer}/SubsidyProgramme`, data).toPromise();
        }
    }
    delete(keys: any[]) {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
            }),
            body: { DeleteList: keys },
        };
        return this.http.delete(`${environment.yhBasicSettingServer}/SubsidyProgramme/deletelist`, options).toPromise();
    }
}
