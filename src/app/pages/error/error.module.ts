import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvalidPigfarmComponent } from './invalid-pigfarm/invalid-pigfarm.component';
import { InvalidPageComponent } from './invalid-page/invalid-page.component';
import { ErrorRoutes } from './error.routing';
import {DxButtonModule} from 'devextreme-angular';
import { InvalidSemenComponent } from './invalid-systemOption/invalid-systemOption.component';
/**
 * 异常提示模块
 */
@NgModule({
    imports: [CommonModule, ErrorRoutes,DxButtonModule],
    declarations: [InvalidPigfarmComponent,InvalidPageComponent,InvalidSemenComponent],
})
export class ErrorModuleModule {}
