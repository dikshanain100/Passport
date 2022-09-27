import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router, ActivatedRoute, Route } from "@angular/router";
import { Subscription } from 'rxjs';
import { MainService } from './main.service';

// This module takes data and id offline and once user comes online, posts the data to DB
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  public todos;
  public todoSubscription: Subscription;

  constructor(private router: Router, private _mainService: MainService) { }

  public todoForm = new FormGroup({
    title: new FormControl('', Validators.required),
    content: new FormControl('', Validators.required),

  });

  addTodo(formData: FormData) {
    this._mainService.addTodo(formData).then(
      (res: any) => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/main"]));
        this.todoForm.reset();
      },
      (err: Object) => {
        console.log('err : ', err);
      })
      .catch((err: Object) => {
      });

  }

  getTodos() {
    let data = {};
    this._mainService.getAllTodos(data).then(
      (res: any) => {
        this.todos = res["data"];

      },
      (err: Object) => {
        console.log('err : ', err);
      })
      .catch((err: Object) => {
      });
  }

  delete(todoId: string) {
    this._mainService.deleteTodo(todoId).then(
      (res: any) => {
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
          this.router.navigate(["/main"]));
      },
      (err: Object) => {
        console.log('err : ', err);
      })
      .catch((err: Object) => {
      });
  }


  ngOnInit() {
    this.getTodos();
  }

  ngOnDestroy() {
    if (this.todoSubscription !== undefined) {
      this.todoSubscription.unsubscribe()
    }

  }

}
