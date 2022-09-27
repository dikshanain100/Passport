import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormTableRoutingModule } from './form-table-routing.module';
import {FormTableComponent} from './form-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [FormTableComponent],
  imports: [
    CommonModule,
    FormTableRoutingModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class FormTableModule { }
