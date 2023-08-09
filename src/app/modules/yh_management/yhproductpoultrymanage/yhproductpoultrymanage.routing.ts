import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PickupChickSettingComponent } from './yhproductpoultrymanage.component';
const routes: Routes = [
    {
        path: '',
        component: PickupChickSettingComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class PickupChickSettingRoutingModule {}

