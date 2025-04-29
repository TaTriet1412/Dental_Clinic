import { Injectable } from '@angular/core';
import { MatSnackBar,MatSnackBarHorizontalPosition,MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class SnackBarService {
  constructor(public snackBar: MatSnackBar) {}
  horizontalPosition: MatSnackBarHorizontalPosition = "center"
  verticalPosition: MatSnackBarVerticalPosition = "top"

  horizontalPositionUser: MatSnackBarHorizontalPosition = "right"
  verticalPositionUser: MatSnackBarVerticalPosition = "top"

  notifySuccess(msg: string) {
    this.snackBar.open(msg, 'Đóng',{
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5000,
      panelClass: ['snackbar-success']
    });
  }

  notifyWarning(msg: string) {
    this.snackBar.open(msg, 'Đóng',{
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5000,
      panelClass: ['snackbar-warning']
    });
  }

  notifyError(msg: string) {
    this.snackBar.open(msg, 'Đóng',{
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 5000,
      panelClass: ['snackbar-error']
    });
  }

  notifySuccessUser(msg: string) {
    this.snackBar.open(msg, 'Đóng',{
      horizontalPosition: this.horizontalPositionUser,
      verticalPosition: this.verticalPositionUser,
      duration: 5000,
      panelClass: ['snackbar-success-user']
    });
  }

  notifyWarningUser(msg: string) {
    this.snackBar.open(msg, 'Đóng',{
      horizontalPosition: this.horizontalPositionUser,
      verticalPosition: this.verticalPositionUser,
      duration: 5000,
      panelClass: ['snackbar-warning-user']
    });
  }

  notifyErrorUser(msg: string) {
    this.snackBar.open(msg, 'Đóng',{
      horizontalPosition: this.horizontalPositionUser,
      verticalPosition: this.verticalPositionUser,
      duration: 5000,
      panelClass: ['snackbar-error-user']
    });
  }


}
