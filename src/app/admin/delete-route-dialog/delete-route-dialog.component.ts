import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Route } from 'src/app/models/route.model';
import { RouteDataService } from 'src/app/services/route-data.service';


@Component({
  selector: 'app-delete-route-dialog',
  templateUrl: './delete-route-dialog.component.html',
  styleUrls: ['./delete-route-dialog.component.css']
})
export class DeleteRouteDialogComponent {


  constructor(
    public dialogRef: MatDialogRef<DeleteRouteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _rds: RouteDataService
  ) { }

  closeDialog(routeName?: string) {
    this.dialogRef.close(routeName);
  }

  deleteRoute() {
    this._rds.deleteRoute(this.data.routeName);
    this.closeDialog(this.data.routeName)
    
  }

}


