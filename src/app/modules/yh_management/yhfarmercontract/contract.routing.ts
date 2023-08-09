import { Routes, RouterModule } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractCreateComponent } from './contract-create/contract-create.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
    {
        path: '',
        component: ContractListComponent,
    },
    {
        path: 'create',
        component: ContractCreateComponent,
    },
];

// export const ProductPackageSetRoutes = RouterModule.forChild(routes);
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ContractRoutes {}
