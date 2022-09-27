import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormTableComponent } from './form-table.component';

const routes: Routes = [
  { path: '', component: FormTableComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormTableRoutingModule { }
