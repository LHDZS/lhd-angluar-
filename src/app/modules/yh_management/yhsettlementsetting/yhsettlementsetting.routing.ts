import { Routes, RouterModule } from '@angular/router';
import { yhsettlementsettingDetailComponent } from './yhsettlementsetting-detail/yhsettlementsetting-detail.component';

const routes: Routes = [
    {
        path: '',
        component: yhsettlementsettingDetailComponent,
    },
];

export const yhsettlementsettingRoutes = RouterModule.forChild(routes);
