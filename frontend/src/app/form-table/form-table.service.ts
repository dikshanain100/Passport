import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URLConstants } from '../shared/URLConstants'

@Injectable({
  providedIn: 'root'
})
export class FormTableService {
  
  APIEndpoint: string = '';

  constructor(private _http: HttpClient) { }

    //get data
    getDetails() {
      let reqUrl = this.APIEndpoint + URLConstants.publicEnteriesAPI;
      const requestOption = {
        headers : new HttpHeaders(),
      }
      return this._http.get(reqUrl, requestOption);
    }

}
