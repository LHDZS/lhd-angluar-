import { Routes, RouterModule } from '@angular/router';
import { batchCompanyProfitListComponent } from './list/list.component';
import { batchCompanyProfitDetailComponent } from './detail/detail.component';

const routes: Routes = [
    {
        path: '',
        component: batchCompanyProfitListComponent,
    },
    {
        path: 'detail',
        component: batchCompanyProfitDetailComponent,
    },
];

export const batchCompanyProfitRoutes = RouterModule.forChild(routes);
