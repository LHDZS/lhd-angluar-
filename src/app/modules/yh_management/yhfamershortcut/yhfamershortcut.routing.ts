import { Routes, RouterModule } from '@angular/router';
import { yhfamershortcutListComponent } from './yhfamershortcut-list/yhfamershortcut-list.component';
import { yhfamershortcutDetailComponent } from './yhfamershortcut-detail/yhfamershortcut-detail.component';

const routes: Routes = [
    {
        path: '',
        component: yhfamershortcutDetailComponent,
    },
];

export const yhfamershortcutRoutes = RouterModule.forChild(routes);
