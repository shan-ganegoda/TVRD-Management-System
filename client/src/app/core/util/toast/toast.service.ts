import { Injectable } from '@angular/core';
import {NotificationComponent} from "../../../shared/dialog/notification/notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(private snackBar:MatSnackBar) { }

  handleResult(status:string,message:string){

    if(status === "success"){
      this.snackBar.openFromComponent(NotificationComponent,{
        data:{ message: `${status}  ${message}`,icon: "done_all" },
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['success-snackbar'],
      });
    }else{
      this.snackBar.openFromComponent(NotificationComponent,{
        data:{ message: `${status}!  ${message}`,icon: "report" },
        horizontalPosition: "end",
        verticalPosition: "top",
        duration: 5000,
        panelClass: ['failure-snackbar'],
      });
    }
  }
}
