import { Injectable } from '@angular/core';
import { InternalHttpService } from '../shared/services/internal-http.service';
import { URLConstants } from '../shared/URLConstants';
import { OfflineService } from '../shared/services/offline.service';
import { DexieService } from '../shared/services/dexie.service';


@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(
    private _httpClient: InternalHttpService, 
    private readonly offlineService: OfflineService,
    private _dexieService : DexieService

    ) {
  }



  //////////////////////////////////////////////// GENERAL CODE + ONLINE ///////////////////////////////////////////////////////////////


  //add the todos >> Online + Offline
  addTodo(todo: Object) {
    // save into the indexedDB if the connection is lost
    if (!this.offlineService.isOnline) {
      this.addToIndexedDb(todo);
    } else {
      //post request to mongodb
      let data = {
        title: todo["title"],
        content: todo["content"],
      }

      return new Promise((resolve, reject) => {
        this._httpClient.call(data, URLConstants.todosAPI, 'POST').subscribe(
          res => {
            resolve(res)
          },
          err => reject(err)
        );
      });

    }
  }



  // delete the todos >> Online + Offline
  deleteTodo(todoId: string) {
    let todo = {
      _id: todoId
    }

    if (!this.offlineService.isOnline) {
      this.addToDeleteDatabase(todo);

    } else {
      return new Promise((resolve, reject) => {
        this._httpClient.call(todo, URLConstants.todoAPI + '/' + todo["_id"], 'DELETE').subscribe(
          res => {
            resolve(res)
          },
          err => reject(err)
        );
      });

    }
  }


  //get all todos from the mongodb
  getAllTodos(data) {
    return new Promise((resolve, reject) => {
      this._httpClient.call(data, URLConstants.todosAPI, 'GET').subscribe(
        res => {
          resolve(res)
        },
        err => reject(err)
      );
    });
  }


  ////////////////////////////////////////////////   OFFLINE   //////////////////////////////////////////////////////////////////

  //add todo to the indexedDB on offline mode
  private async addToIndexedDb(todo: any) {
    this._dexieService.dbInstance.indexdb_todos_add.add(todo)
      .then(async () => {
        const allItems: any[] = await this._dexieService.dbInstance["indexdb_todos_add"].toArray();
        console.log('saved in DB, DB is now', allItems);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }



  //add to delete database if offline
  private async addToDeleteDatabase(todo: any) {
    console.log('todo : ', todo);
    this._dexieService.dbInstance.indexdb_todos_delete.add(todo)
      .then(async () => {
        const allItems: any[] = await this._dexieService.dbInstance["indexdb_todos_delete"].toArray();
        console.log('saved in DB, DB is now', allItems);
      })
      .catch(e => {
        alert('Error: ' + (e.stack || e));
      });
  }






}
