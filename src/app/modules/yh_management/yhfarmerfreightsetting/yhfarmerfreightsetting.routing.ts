import { Routes, RouterModule } from '@angular/router';
import { YHFarmerFreightSettingListComponent } from './yhfarmerfreightsetting-list/yhfarmerfreightsetting-list.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: YHFarmerFreightSettingListComponent,
    },
];

// export const ProductPackageSetRoutes = RouterModule.forChild(routes);
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YHFreightSettingRoutes {}
