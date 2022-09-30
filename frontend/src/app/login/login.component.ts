import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { LoginService } from './login.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class LoginComponent implements OnInit {

  public customerForm: FormGroup;
  public submitted: boolean = false;
  public loggedIn; //test
  public accountBalance; //test



  constructor(
    private _loginService: LoginService,
    public formBuilder: FormBuilder,
    private _router: Router
  ) {
    this.loggedIn = sessionStorage.getItem('loggedIn');
  }

  ngOnInit(): void {
    this.createForm();
  }



  public createForm() {
    this.customerForm = this.formBuilder.group({
      customer_email: ['', Validators.required],
      customer_password: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get fetch() {
    return this.customerForm.controls;
  }

  public submitForm() {
    this.submitted = true;
    var reqObj = {
      email: '',
      password: ''
    };

    if (
      this.customerForm.controls.customer_email.valid &&
      this.customerForm.controls.customer_password.valid
    ) {
      console.log('form valid ', this.customerForm);
      reqObj.email = this.customerForm.controls.customer_email.value;
      reqObj.password = this.customerForm.controls.customer_password.value;

      this.doLogin(reqObj);

    } else {
      console.log('form invalid');
      console.log('form ', this.customerForm);
    }
    console.log('this.submitted :: ', this.submitted);
    this.submitted = false;
  }

  onCancel() {
    console.log('Form Cancel clicked');
    this.customerForm.reset();
    this.customerForm.markAsPristine;
    this.customerForm.markAsUntouched;

    this.submitted = false;
  }



  doLogin(formData) {
    this._loginService.doLogin(formData).then(
      (res: any) => {
        console.log('res :: ', res)
        if (res.error) {
          alert(res.message);
        }
        else {
          if (res.passwordMismatch ==  true) {
            console.log('pwd mismatch')
            alert(res.message)    //not working
          }
          else if (res.passwordMismatch == false) {
            console.log('pwd matched')
            sessionStorage.setItem('loggedIn', 'true');
            this._router.navigateByUrl('/landing');
          }
          else if (res.passwordMismatch == undefined) {
            console.log('remaining where password is undefined')
            alert(res.message);
            this._router.navigateByUrl('/register');
          }

        }


        this.customerForm.reset();
      },
      (err: Object) => {
        console.log('err :: ', err)
        alert('Error while login ' + err);
      })
      .catch((err: Object) => {
      });
  }


  // load register component
  register() {
    this._router.navigateByUrl('/register');
  }


}
