import { Routes } from '@angular/router';
import {NotfoundpageComponent} from "./shared/notfoundpage/notfoundpage.component";
import {MainwindowComponent} from "./shared/mainwindow/mainwindow.component";
import {HomeComponent} from "./view/home/home.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";

import {authGuard} from "./core/guard/auth.guard";
import {EmployeeListComponent} from "./modules/employees/employee-list/employee-list.component";
import {UserListComponent} from "./modules/user/user-list/user-list.component";
import {authenticationGuard} from "./core/interceptor/authentication.guard";
import {AuthComponent} from "./core/auth/auth.component";

export const routes: Routes = [
  { path: "login", component: AuthComponent },
  { path: "", redirectTo:"login" ,pathMatch:"full"},
  {
    path: "main",
    component: MainwindowComponent,
    canActivate:[authenticationGuard],
    children: [
      {path: "home", component: HomeComponent},
      {path: "dashboard", component: DashboardComponent},
      {path: "employee", component: EmployeeListComponent},
      {path: "user", component: UserListComponent},
      {path:"**", component:NotfoundpageComponent}

    ]
  },

];
