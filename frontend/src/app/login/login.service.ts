import { Injectable } from '@angular/core';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private _httpClient: InternalHttpService,
  ) {
  }


  //post login data to service 
  doLogin(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.callCredentials(data, URLConstants.loginAPI, 'POST').subscribe(
        res => {
          resolve(res)
        },
        err => {
          sessionStorage.setItem('loggedIn', 'false');
          reject(err)
        }

      );
    });
  }




}
