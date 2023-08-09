import { Routes, RouterModule } from '@angular/router';
import { yhmaterialsettingsListComponent } from './yhmaterialsettings-list/yhmaterialsettings-list.component';
import { yhmaterialsettingsDetailComponent } from './yhmaterialsettings-detail/yhmaterialsettings-detail.component';

const routes: Routes = [
    {
        path: '',
        component: yhmaterialsettingsListComponent,
    },
    {
        path: 'detail',
        component: yhmaterialsettingsDetailComponent,
    },
];

export const yhmaterialsettingsRoutes = RouterModule.forChild(routes);
