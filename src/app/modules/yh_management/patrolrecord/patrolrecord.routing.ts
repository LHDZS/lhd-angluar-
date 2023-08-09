import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PatrolrecordListComponent } from './patrolrecord-list/patrolrecord-list.component';
import { PatrolrecordDetailComponent } from './patrolrecord-detail/patrolrecord-detail.component';

const routes: Routes = [
    {
        path: '',
        component: PatrolrecordListComponent,
    },
    {
        path: 'detail',
        component: PatrolrecordDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PatrolrecordRoutingModule {}
