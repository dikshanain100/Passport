import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig } from '../config/app.config';

@Injectable({
  providedIn: 'root'
})
export class InternalHttpService {

  constructor(private http: HttpClient, private config: AppConfig) { }

  /**
   * if you want to pass without headers
   */
  call(data, api, method) {
    const headers = new HttpHeaders();
    return this.http.request(method, this.config.api_url + api, {
      body: data
    })
  }

  /**
   * if you want to pass headers
   */
  callForHeader(data, api, method, header) {
    return this.http.request(method, this.config.api_url + api, {
      body: data,
      headers: header
    })
  }


  /**
 * if you want to pass without headers for Login : additional option added for credentials
 * 'withCredentials' indicates whether or not cross-site Access-Control 
 * requests should be made using credentials
 */
  callCredentials(data, api, method) {
    let options = {
      body: data,
      withCredentials: true
    }
    return this.http.request(method, this.config.api_url + api, options)
  }


}
