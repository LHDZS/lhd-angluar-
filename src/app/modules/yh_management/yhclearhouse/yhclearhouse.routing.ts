import { Routes, RouterModule } from '@angular/router';
import { YHClearHouseListComponent } from './yhclearhouse-list/yhclearhouse-list.component';
import { YHClearHouseCreateComponent } from './yhclearhouse-create/yhclearhouse-create.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: YHClearHouseListComponent,
    },
    {
        path: 'create',
        component: YHClearHouseCreateComponent,
    },
];

// export const ProductPackageSetRoutes = RouterModule.forChild(routes);
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YHClearHouseRoutes {}
