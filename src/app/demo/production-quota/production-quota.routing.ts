import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductionQuota } from './production-quota.component';

const routes: Routes = [
    {
        path: '',
        component: ProductionQuota
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ProductionQuotaRoutingModule { }