import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { AppConfig } from './app.config';
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    DeviceDetectorModule
  ],
  providers:[AppConfig]
})
export class ConfigModule { }
