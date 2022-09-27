import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDesTableRoutingModule } from './mat-des-table-routing.module';
import { MatDesTableComponent } from './mat-des-table.component';
import {MatTableModule, } from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';


@NgModule({
  declarations: [MatDesTableComponent],
  imports: [
    CommonModule,
    MatDesTableRoutingModule,
    MatTableModule,
    MatPaginatorModule
  ]
})
export class MatDesTableModule { }
