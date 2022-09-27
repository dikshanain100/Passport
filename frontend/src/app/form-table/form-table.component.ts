import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { FormTableService } from './form-table.service';


@Component({
  selector: 'app-form-table',
  templateUrl: './form-table.component.html',
  styleUrls: ['./form-table.component.scss']
})
export class FormTableComponent implements OnInit {

  customerForm: FormGroup;
  submitted: boolean = false;
  customerList: any = [];
  maxSize = 3; // Limit number for pagination display number.
  notesCount = 0; // Total number of items in all pages. initialize as a zero
  pageModel = { currentPage: 1 }; // Current page number. First page is 1.-->
  pageSizeSelected = 10; // Max
 // storageName = "customer";

  constructor(
    public formBuilder: FormBuilder,
    private _formTableService: FormTableService,
    // private _ngxIndexedDb : NgxIndexedDBService
    //private _local: LocalService
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    // this._homeService.getDetails().subscribe((dataReceived) => {
    //   console.log('_homeService :: dataReceived ', dataReceived);
    // });

    //this.getAllCustomerData();
  }

  public createForm() {
    this.customerForm = this.formBuilder.group({
      customer_id: ['', Validators.required],
      customer_name: ['', Validators.required],
      customer_age: ['', Validators.required],
      customer_email: ['', Validators.required],
    });
  }

  // convenience getter for easy access to form fields
  get fetch() {
    return this.customerForm.controls;
  }

  public submitForm() {
    this.submitted = true;
    var reqObj = {
      custId: '',
      custName: '',
      custAge: '',
      custEmail: '',
    };

    if (
      this.customerForm.controls.customer_id.valid &&
      this.customerForm.controls.customer_name.valid &&
      this.customerForm.controls.customer_age.valid &&
      this.customerForm.controls.customer_email.valid
    ) {
      console.log('form valid ', this.customerForm);

      reqObj.custId = this.customerForm.controls.customer_id.value;
      reqObj.custName = this.customerForm.controls.customer_name.value;
      reqObj.custAge = this.customerForm.controls.customer_age.value;
      reqObj.custEmail = this.customerForm.controls.customer_email.value;

     // this.add(reqObj);
    } else {
      console.log('form invalid');
      console.log('form valid ', this.customerForm);
    }
    this.submitted = false;
  }

  onCancel() {
    console.log('Form Cancel clicked');
    this.customerForm.reset();
    this.customerForm.markAsPristine;
    this.customerForm.markAsUntouched;

    this.submitted = false;
  }

  // indexed db
  // public getAllCustomerData() {
  //   this._local.getAll(this.storageName).then((res) => {
  //     if (res) {
  //       console.log('got everything');
  //       console.log('data received from indexed db ', res);
  //       this.customerList = res;
  //     } else {
  //       console.log('Could not get record from index db!!');
  //     }
  //   });
  // }

  // public add(reqObj) {
  //   this._local.add(reqObj.custId, reqObj, this.storageName).then((res) => {
  //     if (res) {
  //       console.log('Record added successfully !!');
  //       this.onCancel();
  //       this.getAllCustomerData();
  //     } else {
  //       console.log('Could not add record in index db!!');
  //     }
  //   });
  // }

  // public deleteCustomer(id) {
  //   console.log('id :: ', id);
  //   this._local.delete(id, this.storageName).then((res) => {
  //     if (res) {
  //       console.log('Record deleted successfully !!');
  //       this.getAllCustomerData();
  //     } else {
  //       console.log('Could not delete record in index db!!');
  //     }
  //   });
  // }



}
