import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormulaComputingComponent } from './formula-computing.component';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxLoadIndicatorModule } from 'devextreme-angular/ui/load-indicator';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { DxTreeListModule } from 'devextreme-angular';

@NgModule({
    imports: [
        CommonModule,
        DxPopupModule,
        DxLoadIndicatorModule,
        DxScrollViewModule,
        DxTreeListModule
    ],
    declarations: [	FormulaComputingComponent
   ],
    exports: [FormulaComputingComponent],
})
export class FormulaComputingModule {}
