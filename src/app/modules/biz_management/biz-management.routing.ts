import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuardService, ChickenFarmTypeGuard, HasChickenFarmGuard, HatcheryFarmTypeGuard,RequireFarmTypeGuard } from 'src/app/shared/services';

const routes: Routes = [
    {
        path: 'zqbreedingset',
        loadChildren: () =>
            import('./zqbreedingset/zqbreedingset.module').then(
                (m) => m.BreedingSettingModule
            ),
        canActivate: [AuthGuardService],
    }
];

/**
 * 禽联网基础设置的模块路由
 */
export const BizManagementRoutes = RouterModule.forRoot(routes, { useHash: true });
