import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BreedingSettingComponent } from './zqbreedingset.component';
const routes: Routes = [
    {
        path: '',
        component: BreedingSettingComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BreedingSettingRoutingModule {}
