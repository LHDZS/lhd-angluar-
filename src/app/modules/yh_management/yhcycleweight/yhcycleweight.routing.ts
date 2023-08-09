import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { YhCycleWeightComponent } from './yhcycleweight.component';
const routes: Routes = [
    {
        path: '',
        component: YhCycleWeightComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class YhCycleWeightRoutingModule {}

