import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  dataSource = [];
  displayColumns = ["name", "budget"]
  teamName = "";

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    if(data['type'] == 'team') {
      this.dataSource = data['players'];
      this.displayColumns = ["name", "biddingBudget", "team"]
      this.teamName = data['teamName']
    } else {
      this.dataSource
    }
  }

  ngOnInit(): void {
  }

}
