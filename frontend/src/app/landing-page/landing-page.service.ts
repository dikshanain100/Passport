import { Injectable } from '@angular/core';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';


interface Balance {
  balance: number
}



@Injectable({
  providedIn: 'root'
})
export class LandingPageService {

  // If you use accountBalance as subject+ http call as subscriber instead of promise,
  // there is no need of using change detection in component
  //changes are reflected automatically once you get the data
  //But with taht approach you will not be able to create separate file for single http call i.e internalHttp
  // accountBalance: Subject<Balance | null>;

  constructor(  
    private _httpClient: InternalHttpService
    ) { }


  //post login data to service 
   logout(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.callCredentials(data, URLConstants.logoutAPI, 'POST').subscribe(
        res => {
          sessionStorage.setItem('loggedIn', 'false');
          resolve(res)
        },
        err => reject(err)
      );
    });
  }

// account balance
getAccountBalance(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.callCredentials(data, URLConstants.balanceAPI, 'GET').subscribe(
        res => {
          resolve(res)
        },
        err => reject(err)
      );
    });
  }



}
