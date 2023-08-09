import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListColunmDropComponent } from './list-colunm-drop.component';


const routes: Routes = [
  {
    path: '',
    component: ListColunmDropComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ListColunmDropRoutingModule { }
