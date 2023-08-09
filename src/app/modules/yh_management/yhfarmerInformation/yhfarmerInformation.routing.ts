import { Routes, RouterModule } from '@angular/router';
import { yhfarmerInformationListComponent } from './yhfarmerInformation-list/yhfarmerInformation-list.component';
import { yhfarmerInformationDetailComponent } from './yhfarmerInformation-detail/yhfarmerInformation-detail.component';

const routes: Routes = [
    {
        path: '',
        component: yhfarmerInformationListComponent,
    },
    {
        path: 'detail',
        component: yhfarmerInformationDetailComponent,
    },
];

export const yhfarmerInformationRoutes = RouterModule.forChild(routes);
