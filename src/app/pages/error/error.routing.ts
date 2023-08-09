import { Routes, RouterModule } from '@angular/router';
import { InvalidPigfarmComponent } from './invalid-pigfarm/invalid-pigfarm.component';
import { InvalidPageComponent } from './invalid-page/invalid-page.component';
import { InvalidSemenComponent } from './invalid-systemOption/invalid-systemOption.component';

const routes: Routes = [
    {
        path: 'invalid-pigfarm',
        component: InvalidPigfarmComponent,
    },
    {
        path: 'invalid-page',
        component: InvalidPageComponent,
    },
    {
        path: 'invalid-systemOption',
        component: InvalidSemenComponent,
    },
];

export const ErrorRoutes = RouterModule.forChild(routes);
