import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService, HasGuideGuard, HasChickenFarmGuard, ChickenFarmTypeGuard, HatcheryFarmTypeGuard, RequireFarmTypeGuard } from './shared/services';
import { YHManagementRoutes } from './modules/yh_management/yh_management.routing';
import { BizManagementRoutes } from './modules/biz_management/biz-management.routing';

const routes: Routes = [
    {
        path: 'invalid',
        loadChildren: () => import('./pages/error/error.module').then((m) => m.ErrorModuleModule),
        runGuardsAndResolvers: 'always',
    },
    {
        path: '**',
        loadChildren: () => import('./pages/error/error.module').then((m) => m.ErrorModuleModule),
        runGuardsAndResolvers: 'always',
    },
];

@NgModule({
    imports: [
        BizManagementRoutes,
        YHManagementRoutes,
        RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' }),
    ],
    providers: [AuthGuardService, HasChickenFarmGuard, ChickenFarmTypeGuard, RequireFarmTypeGuard, HatcheryFarmTypeGuard, HasGuideGuard],
    exports: [RouterModule],
})
export class AppRoutingModule {}
