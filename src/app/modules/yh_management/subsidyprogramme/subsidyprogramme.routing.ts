import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubsidyProgrammeComponent } from './subsidyprogramme.component';
const routes: Routes = [
    {
        path: '',
        component: SubsidyProgrammeComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SubsidyProgrammeRoutingModule {}
