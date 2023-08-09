import { Routes, RouterModule } from '@angular/router';
import { yhsettlementListComponent } from './yhsettlement-list/yhsettlement-list.component';
import { yhsettlementDetailComponent } from './yhsettlement-detail/yhsettlement-detail.component';

const routes: Routes = [
    {
        path: '',
        component: yhsettlementListComponent,
    },
    {
        path: 'detail',
        component: yhsettlementDetailComponent,
    },
];

export const yhsettlementRoutes = RouterModule.forChild(routes);
