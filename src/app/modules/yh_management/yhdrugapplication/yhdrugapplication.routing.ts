import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { YhDrugApplicationListComponent } from './yhdrugapplication-list/yhdrugapplication-list.component';
import { YhDrugApplicationDetailComponent } from './yhdrugapplication-detail/yhdrugapplication-detail.component';

const routes: Routes = [
    {
        path: '',
        component: YhDrugApplicationListComponent,
    },
    {
        path: 'detail',
        component: YhDrugApplicationDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YhDrugApplicationRoutingModule {}
