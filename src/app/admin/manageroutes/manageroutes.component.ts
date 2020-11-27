import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Route } from 'src/app/models/route.model';
import { RouteDataService } from 'src/app/services/route-data.service';
import { DeleteRouteDialogComponent } from '../delete-route-dialog/delete-route-dialog.component';

@Component({
  selector: 'app-manageroutes',
  templateUrl: './manageroutes.component.html',
  styleUrls: ['./manageroutes.component.css']
})
export class ManageroutesComponent implements OnInit {

  routes: Route[] = [];
  popup: boolean = false;
  dialogRef;



  constructor(private _rds: RouteDataService, private _dialog : MatDialog) { }

  ngOnInit(): void {
    this._rds.getFutureRoutes$().subscribe((routes: Route[]) => {
      this.routes = routes;
    });

   
  }

  openDialog(){
    this.dialogRef = this._dialog.open(DeleteRouteDialogComponent, {
      height: '400px',
      width: '600px',
    });

    this.dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`); // Pizza!
    });

    
  }
}
