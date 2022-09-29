import {  Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LandingPageService } from './landing-page.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public accountBalance;


  constructor(
    private _landingPageService: LandingPageService,
    private _router: Router,
  ) { 
  }

  ngOnInit(): void {
  }


  getBalance() {
    let data ={};
    this._landingPageService.getAccountBalance(data).then(
      (response)=>{
        this.accountBalance = response;
      },
      (error)=>{
        console.log(error)
        alert('got error while fetching data : ');
      }
    )
    .catch((err: Object) => {
    });
  }


  logout() {
    let data = {};
    this._landingPageService.logout(data).then(
      (res: any) => {
        sessionStorage.removeItem('loggedIn');
        this._router.navigate(["/login"]);

      },
      (err: Object) => {
        console.log('err from backend service: ', err );
      })
      .catch((err: Object) => {
      });
  }



}
