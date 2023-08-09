import { Component, Inject, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { locale, loadMessages } from "devextreme/localization";
import zhMessages from "devextreme/localization/messages/zh.json";
import { TokenAuthService } from '../../shared/services';
import { DxPivotGridModule } from 'devextreme-angular';
import { ProductionQuota } from './production-quota.component';
import { ProductionQuotaRoutingModule } from './production-quota.routing';


@NgModule({
    imports: [
        DxPivotGridModule,
        ProductionQuotaRoutingModule
    ],
    declarations: [ProductionQuota]
})

export  class ProductionQuotaModule { }