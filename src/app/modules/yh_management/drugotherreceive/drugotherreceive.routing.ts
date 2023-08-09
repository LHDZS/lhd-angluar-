import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DrugOtherReceiveListComponent } from './drugotherreceive-list/drugotherreceive-list.component';
import { DrugOtherReceiveDetailComponent } from './drugotherreceive-detail/drugotherreceive-detail.component';

const routes: Routes = [
    {
        path: '',
        component: DrugOtherReceiveListComponent,
    },
    {
        path: 'detail',
        component: DrugOtherReceiveDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DrugOtherReceiveRoutingModule {}
