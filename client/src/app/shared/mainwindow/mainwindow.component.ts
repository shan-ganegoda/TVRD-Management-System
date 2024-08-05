import {Component, OnInit} from '@angular/core';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatListModule} from "@angular/material/list";
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {MatMenuModule} from "@angular/material/menu";
import {MatCardModule} from "@angular/material/card";
import {MatBadgeModule} from "@angular/material/badge";
import {TokenService} from "../../core/service/auth/token.service";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTreeModule} from "@angular/material/tree";
import {User} from "../../core/entity/user";
import {StorageService} from "../../core/service/auth/storage.service";
import {AuthService} from "../../core/service/auth/auth.service";
import {Location} from "@angular/common";
import {WarningDialogComponent} from "../dialog/warning-dialog/warning-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {LogoutDialogComponent} from "../dialog/logout-dialog/logout-dialog.component";
import {AuthorizationService} from "../../core/service/auth/authorization.service";

@Component({
  selector: 'app-mainwindow',
  standalone: true,
  imports: [
    MatSidenavModule,
    MatIconModule,
    MatToolbarModule,
    MatListModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatMenuModule,
    MatCardModule,
    MatBadgeModule,
    MatExpansionModule,
    MatTreeModule
  ],
  templateUrl: './mainwindow.component.html',
  styleUrl: './mainwindow.component.scss'
})
export class MainwindowComponent implements OnInit{

  protected user = <User><unknown>({username: '', employee: {photo: ''}});

  togglemenu:boolean = false;
  togglemenu1:boolean = true;
  togglemenu2:boolean = false;
  togglemenu3:boolean = false;
  togglemenu4:boolean = false;
  togglemenu5:boolean = false;
  togglemenu6:boolean = false;
  togglemenu7:boolean = false;

  protected Admin = this.am.hasRole("Admin");
  protected MohOfficer = this.am.hasRole("MOH Officer");
  protected PdOfficer = this.am.hasRole("PD Officer");
  protected RdhOfficer = this.am.hasRole("RDH Officer");
  protected PhnOfficer = this.am.hasRole("PHN Officer");
  protected Supplier = this.am.hasRole("Supplier");

  opened: boolean = true;
  hidden = false;

  constructor(
    private storageService:StorageService,
    private authService:AuthService,
    private location:Location,
    private dialog:MatDialog,
    private am:AuthorizationService
    ) {
  }

  ngOnInit() {

    const user = this.storageService.getUser();

    if(user.id) this.user = user;

    //console.log(this.Admin);
  }

  logout(){

    this.dialog.open(LogoutDialogComponent,{}).afterClosed().subscribe(res => {
      if(res){
        this.storageService.logout();
        location.reload();
      }else{
        return;
      }
    });
    //this.authService.logout()

  }

}
