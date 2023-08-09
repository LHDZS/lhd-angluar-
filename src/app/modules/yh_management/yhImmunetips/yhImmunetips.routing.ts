import { Routes, RouterModule } from '@angular/router';
import { yhImmunetipsListComponent } from './yhImmunetips-list.component';

const routes: Routes = [
    {
        path: '',
        component: yhImmunetipsListComponent,
    }
];

export const yhImmunetipsRoutes = RouterModule.forChild(routes);
