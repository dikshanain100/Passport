import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { APP_INITIALIZER } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { SharedModule } from './shared/shared.module';
import { DexieService } from './shared/services/dexie.service';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AppRoutingModule,
  ],
  providers: [
    // Loading DexieService on Application start
    DexieService,
    {
      provide: APP_INITIALIZER,
      useFactory: (ds: DexieService) => () =>
      {        
         ds.onload()
        // return ds.load()
      } ,
      deps: [DexieService],
      multi: true
    }
  ],
  bootstrap: [AppComponent],
  exports :[
    SharedModule
  ],
})
export class AppModule { }
