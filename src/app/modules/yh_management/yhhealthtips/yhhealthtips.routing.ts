import { Routes, RouterModule } from '@angular/router';
import { yhhealthtipsListComponent } from './yhhealthtips-list.component';

const routes: Routes = [
    {
        path: '',
        component: yhhealthtipsListComponent,
    }
];

export const yhhealthtipsRoutes = RouterModule.forChild(routes);
