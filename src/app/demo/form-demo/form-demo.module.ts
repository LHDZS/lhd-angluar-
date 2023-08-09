import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormListComponent } from './list/form-list.component';
import { FormDemoRoutes } from './form-demo.routing';
import { NxFormListModule } from 'src/app/components/nx-zlw-form-list/nx-zlw-form-list.component';
import { NxToolbarPanelModule } from 'src/app/components/toolbar-panel/toolbar-panel.component';
import { NxSearchPanelModule } from 'src/app/components/search-panel/search-panel.component';
import { FormDetailComponent } from './detail/form-detail.component';
import { NxFormDetailModule } from 'src/app/components/nx-zlw-form-detail/nx-zlw-form-detail.component';
import { NxFormListHeaderPanelModule } from 'src/app/components/nx-form-list-header-panel/nx-form-list-header-panel.component';
import { NxFormSingleModule } from 'src/app/components/nx-form-single/nx-form-single.component';

@NgModule({
    imports: [
        CommonModule,
        NxFormListModule,
        FormDemoRoutes,
        NxToolbarPanelModule,
        NxSearchPanelModule,
        NxFormDetailModule,
        NxFormListHeaderPanelModule,
        NxFormSingleModule,
    ],
    declarations: [FormListComponent, FormDetailComponent],
})
export class FormDemoModule {}
