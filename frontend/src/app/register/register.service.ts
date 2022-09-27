import { Injectable } from '@angular/core';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(
    private _httpClient: InternalHttpService,
  ) { }

    //post register data to be stored in mongo db
    postRegister(data) {
      return new Promise((resolve, reject) => {
        this._httpClient.call(data, URLConstants.registerAPI, 'POST').subscribe(
          res => {
            resolve(res)
          },
          err => reject(err)
        );
      });
    }
    
}
