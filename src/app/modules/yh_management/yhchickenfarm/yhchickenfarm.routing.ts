import { Routes, RouterModule } from '@angular/router';
import { yhchickenfarmListComponent } from './yhchickenfarm-list/yhchickenfarm-list.component';
import { yhchickenfarmDetailComponent } from './yhchickenfarm-detail/yhchickenfarm-detail.component';

const routes: Routes = [
    {
        path: '',
        component: yhchickenfarmListComponent,
    },
    {
        path: 'detail',
        component: yhchickenfarmDetailComponent,
    },
];

export const yhchickenfarmRoutes = RouterModule.forChild(routes);
