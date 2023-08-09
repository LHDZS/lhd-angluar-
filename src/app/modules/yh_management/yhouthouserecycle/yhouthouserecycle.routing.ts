import { Routes, RouterModule } from '@angular/router';
import { YHOutHouseRecycleListComponent } from './yhouthouserecycle-list/yhouthouserecycle-list.component';
import { YHOutHouseRecycleComponent } from './yhouthouserecycle-create/yhouthouserecycle-create.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: YHOutHouseRecycleListComponent,
    },
    {
        path: 'create',
        component: YHOutHouseRecycleComponent,
    },
];

// export const ProductPackageSetRoutes = RouterModule.forChild(routes);
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YHOutHouseRecycleRoutes {}
