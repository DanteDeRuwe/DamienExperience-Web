import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-delete-route-dialog',
  templateUrl: './delete-route-dialog.component.html',
  styleUrls: ['./delete-route-dialog.component.css']
})
export class DeleteRouteDialogComponent {

  constructor(public dialogRef: MatDialogRef<DeleteRouteDialogComponent>) { }

  closeDialog() {
    this.dialogRef.close('Pizza!');
  }

}

 
