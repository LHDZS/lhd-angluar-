import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { YhMaterialReceiveListComponent } from './yhmaterialreceive-list/yhmaterialreceive-list.component';
import { YhMaterialReceiveDetailComponent } from './yhmaterialreceive-detail/yhmaterialreceive-detail.component';

const routes: Routes = [
    {
        path: '',
        component: YhMaterialReceiveListComponent,
    },
    {
        path: 'detail',
        component: YhMaterialReceiveDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YhMaterialReceiveRoutingModule {}
