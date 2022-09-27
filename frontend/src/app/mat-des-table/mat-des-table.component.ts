import { AfterViewInit, Component, OnInit, ViewChild, ChangeDetectorRef, } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OfflineService } from '..//shared/services/offline.service';
import { DexieService } from '../shared/services/dexie.service';
import { MatDesTableService } from './mat-des-table.service';


// this module puts data in indexdb when online and fetches from it when offline (no involvment of backend db here)
@Component({
  selector: 'app-mat-des-table',
  templateUrl: './mat-des-table.component.html',
  styleUrls: ['./mat-des-table.component.scss']
})
export class MatDesTableComponent implements OnInit {

  displayedColumns = [];
  dataSource: MatTableDataSource<any>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public tableName = "matDesc";
  public tableSchema = "++_id, value"


  constructor(
    private _matDesTableService: MatDesTableService,
    private readonly offlineService: OfflineService,
    private _cdr: ChangeDetectorRef,
    private _dexieService: DexieService
  ) { }

  ngOnInit(): void {
    var isOnline = this.offlineService.isOnline;
    console.log('isOnline : ', isOnline);
    if (isOnline) {
      let data = {};
      this._matDesTableService.getDetails(data).then(
        (res: any) => {
          console.log('res :: ', res);
          this.fillTable(res);
          this.addTableToIndexDB(res);
        },
        (err: Object) => {
          console.log('err : ', err);
        })
        .catch((err: Object) => {
        });
    } else {
      //setting a delay as getting error on query ; since DB congiuration still happening , as table is created on page load
      //but in actual scenario, won't get this error as table will be craeted from urls, on application start and not component load
      setTimeout(()=>{
        this.getDataFromIndexDB(this.tableName);
      }, 4000)
      
    }
  }

  ngAfterViewInit() {
    this.displayedColumns = ['API', 'Description', 'Link', 'Category'];
  }


  // add data to table in UI
  public fillTable(dataReceived) {
    this.dataSource = new MatTableDataSource(dataReceived.entries);
    this.dataSource.paginator = this.paginator;
  }




  //Dynamically adding table to index db
  public addTableToIndexDB(response) {
    this._dexieService.updateSchema(this.tableName, this.tableSchema).then(
      (res: any) => {
        //fill data in indexdb 
        this.addToIndexDB(response, this.tableName);
        //testing 
       //this.getDataFromIndexDB(this.tableName);
      },
      (err: Object) => {
        console.log('err when table is not added to DB: ', err);
      })
      .catch((err: Object) => {
      });

  }



  //Adding data to index db
  private async addToIndexDB(data: any, tableName) {
    this._dexieService.dbInstance[tableName].add(data)  //adding 
      .then(async () => {
        const allItems: any[] = await this._dexieService.dbInstance[tableName].toArray();  //getting values after addition
      })
      .catch(e => {
        alert('Error when adding to index db: ' + (e.stack || e));
      });
  }

  //Getting data from indexed db
  private async getDataFromIndexDB(tableName) {
    console.log('isnide get data from in db :: ', tableName)
    const item: any[] = await this._dexieService.dbInstance[tableName].get({_id : 2});
   // const item: any[]= await this._dexieService.dbInstance.matDesc.toArray()
  
    console.log('item :: ', item);
    this.fillTable(item);
   // this.fillTable(item[0]);
  }



}
