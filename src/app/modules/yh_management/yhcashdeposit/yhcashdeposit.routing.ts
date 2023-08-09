import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { YhCashDepositListComponent } from './yhcashdeposit-list/yhcashdeposit-list.component';
import { YhCashDepositDetailComponent } from './yhcashdeposit-detail/yhcashdeposit-detail.component';


const routes: Routes = [
    {
        path: '',
        component: YhCashDepositListComponent,
    },
    {
        path: 'detail',
        component: YhCashDepositDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YhCashDepositRoutingModule {}
