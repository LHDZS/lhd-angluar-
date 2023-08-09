import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ListColunmDropRoutingModule } from './list-colunm-drop-routing.module';

import { ListColunmDropComponent } from "./list-colunm-drop.component";
import { DxSelectBoxModule, DxLoadIndicatorModule, DxTemplateModule } from 'devextreme-angular';


@NgModule({
  declarations: [ListColunmDropComponent],
  imports: [
    ListColunmDropRoutingModule,
    CommonModule,
    DxSelectBoxModule,
    DxLoadIndicatorModule,
    DxTemplateModule
  ]
})
export class ListColunmDropModule { }
