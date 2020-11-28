import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Route } from 'src/app/models/route.model';


@Component({
  selector: 'app-delete-route-dialog',
  templateUrl: './delete-route-dialog.component.html',
  styleUrls: ['./delete-route-dialog.component.css']
})
export class DeleteRouteDialogComponent {


  constructor(public dialogRef: MatDialogRef<DeleteRouteDialogComponent>) { }

  closeDialog() {
    this.dialogRef.close();
  }

  deleteRoute(){
    console.log("delete route");
  }

}

 
