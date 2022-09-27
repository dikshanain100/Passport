import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment.prod";
import { DeviceDetectorService } from 'ngx-device-detector';


@Injectable({
  providedIn: "root"
})
export class AppConfig {
  public api_url = environment.api_url;
  deviceInfo = null;


  constructor(private deviceService: DeviceDetectorService) {
    this.checkDevice();
   }


   checkDevice() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();
    const isDesktopDevice = this.deviceService.isDesktop();
    if(isDesktopDevice){
      this.api_url = environment.api_url;
    }
    else if(isMobile || isTablet) {
      this.api_url = environment.mobile_api_url;
    }
  }

  
}
