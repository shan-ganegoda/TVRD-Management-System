import { Routes } from '@angular/router';
import {NotfoundpageComponent} from "./shared/notfoundpage/notfoundpage.component";
import {MainwindowComponent} from "./shared/mainwindow/mainwindow.component";
import {HomeComponent} from "./view/home/home.component";
import {DashboardComponent} from "./view/dashboard/dashboard.component";

import {authGuard} from "./core/guard/auth.guard";
import {EmployeeComponent} from "./modules/employee/employee.component";
import {UserComponent} from "./modules/user/user.component";
import {authenticationGuard} from "./core/interceptor/authentication.guard";
import {AuthComponent} from "./core/auth/auth.component";
import {MohdetailsComponent} from "./modules/mohdetails/mohdetails.component";
import {ProducorderComponent} from "./modules/producorder/producorder.component";
import {CountbymohComponent} from "./core/report/view/countbymoh/countbymoh.component";
import {CountbyporderComponent} from "./core/report/view/countbyporder/countbyporder.component";

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
      {path: "employee", component: EmployeeComponent},
      {path: "user", component: UserComponent},
      {path: "mohdetail", component: MohdetailsComponent},
      {path: "productorder", component: ProducorderComponent},
      {path: "mohreport", component: CountbymohComponent},
      {path: "porderreport", component: CountbyporderComponent},
      {path:"**", component:NotfoundpageComponent}

    ]
  },

];
