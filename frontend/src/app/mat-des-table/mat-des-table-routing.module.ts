import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatDesTableComponent } from './mat-des-table.component';

const routes: Routes = [{ path: '', component: MatDesTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MatDesTableRoutingModule { }
