import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { YHPoultrSalesListComponent } from './yhpoultrysales-list/yhpoultrysales-list.component';
import { YHPoultrySalesDetailComponent } from './yhpoultrysales-detail/yhpoultrysales-detail.component';

const routes: Routes = [
    {
        path: '',
        component: YHPoultrSalesListComponent,
    },
    {
        path: 'detail',
        component: YHPoultrySalesDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YHPoultrySalesRoutingModule {}
