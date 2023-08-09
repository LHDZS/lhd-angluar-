import { Component, Inject, NgModule } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { locale, loadMessages } from "devextreme/localization";
import zhMessages from "devextreme/localization/messages/zh.json";
import { DxDataGridModule, DxChartModule} from 'devextreme-angular';
import { Report } from './report.component';
import { ReportRoutingModule } from './report.routing';


@NgModule({
    imports: [
        ReportRoutingModule,
        DxDataGridModule,
        DxChartModule
    ],
    declarations: [Report]
})

export  class ReportModule { }