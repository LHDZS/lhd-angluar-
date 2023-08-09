import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EchartsDemoComponent } from './echartsdemo.component';
const routes: Routes = [
    {
        path: '',
        component: EchartsDemoComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EchartsDemoRoutingModule {}
