import { Routes, RouterModule } from '@angular/router';
import { FormListComponent } from './list/form-list.component';
import { FormDetailComponent } from './detail/form-detail.component';

const routes: Routes = [
    {
        path: '',
        component: FormListComponent,
    },
    {
        path: 'detail',
        component: FormDetailComponent,
    },
];

export const FormDemoRoutes = RouterModule.forChild(routes);
