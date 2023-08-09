import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { YhChickenReceiveListComponent } from './yhchickenreceive-list/yhchickenreceive-list.component';
import { YhChickenReceiveDetailComponent } from './yhchickenreceive-detail/yhchickenreceive-detail.component';

const routes: Routes = [
    {
        path: '',
        component: YhChickenReceiveListComponent,
    },
    {
        path: 'detail',
        component: YhChickenReceiveDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YhChickenReceiveRoutingModule {}
