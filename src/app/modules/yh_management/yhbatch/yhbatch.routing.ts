import { Routes, RouterModule } from '@angular/router';
import { yhBatchListComponent } from './yhbatch-list/yhbatch-list.component';
import { yhBatchCreateComponent } from './yhbatch-create/yhbatch-create.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: yhBatchListComponent,
    },
    {
        path: 'create',
        component: yhBatchCreateComponent,
    },
];

// export const ProductPackageSetRoutes = RouterModule.forChild(routes);
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class yhBatchRoutes {}
 