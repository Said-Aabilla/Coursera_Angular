import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef,MatDialogModule} from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  user = {username: '', password: '', remember: false};

  constructor(public dialogRef: MatDialogRef<LoginComponent>) { }

  ngOnInit(): void {
  }
  

  onSubmit() {
    console.log('User: ', this.user);
    this.dialogRef.close();
  }

}
