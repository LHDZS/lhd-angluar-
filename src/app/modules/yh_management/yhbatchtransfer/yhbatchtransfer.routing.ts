import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { YhBatchTransferListComponent } from './yhbatchtransfer-list/yhbatchtransfer-list.component';
import { YhBatchTransferDetailComponent } from './yhbatchtransfer-detail/yhbatchtransfer-detail.component';

const routes: Routes = [
    {
        path: '',
        component: YhBatchTransferListComponent,
    },
    {
        path: 'detail',
        component: YhBatchTransferDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YhBatchTransferRoutingModule {}
