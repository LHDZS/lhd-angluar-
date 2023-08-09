import { Routes, RouterModule } from '@angular/router';
import { layEggsIndexListComponent } from './list/list.component';
import { layEggsIndexDetailComponent } from './detail/detail.component';

const routes: Routes = [
    {
        path: '',
        component: layEggsIndexListComponent,
    },
    {
        path: 'detail',
        component: layEggsIndexDetailComponent,
    },
];

export const layEggsIndexRoutes = RouterModule.forChild(routes);
