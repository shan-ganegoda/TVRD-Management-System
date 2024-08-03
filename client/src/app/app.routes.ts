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
import {VehicleComponent} from "./modules/vehicle/vehicle.component";
import {VaccineComponent} from "./modules/vaccine/vaccine.component";
import {EmployeebydesignationComponent} from "./core/report/view/employeebydesignation/employeebydesignation.component";
import {VehiclecountbymohComponent} from "./core/report/view/vehiclecountbymoh/vehiclecountbymoh.component";
import {VaccineorderComponent} from "./modules/vaccineorder/vaccineorder.component";
import {ClinicComponent} from "./modules/clinic/clinic.component";
import {ProfileComponent} from "./view/profile/profile.component";
import {MotherregistrationComponent} from "./modules/motherregistration/motherregistration.component";
import {PrivilageComponent} from "./modules/privilage/privilage.component";
import {CountbyvorderComponent} from "./core/report/view/countbyvorder/countbyvorder.component";
import {ChildrecordComponent} from "./modules/childrecord/childrecord.component";
import {GrnComponent} from "./modules/grn/grn.component";
import {DistributionComponent} from "./modules/distribution/distribution.component";
import {VaccinationComponent} from "./modules/vaccination/vaccination.component";
import {
  CountbymotherregistrationComponent
} from "./core/report/view/countbymotherregistration/countbymotherregistration.component";
import {MbireportComponent} from "./modules/mbireport/mbireport.component";

export const routes: Routes = [
  { path: "login", component: AuthComponent },
  { path: "", redirectTo:"login" ,pathMatch:"full"},
  {
    path: "main",
    component: MainwindowComponent,
    canActivate:[authenticationGuard],
    children: [
      {path: "home", component: HomeComponent,title: "Home"},
      {path: "dashboard", component: DashboardComponent,title: "Dashboard"},
      {path: "employee", component: EmployeeComponent,title: "Employee"},
      {path: "user", component: UserComponent,title: "User"},
      {path: "privilege", component: PrivilageComponent,title: "Privileges"},
      {path: "mohdetail", component: MohdetailsComponent,title: "MOH Details"},
      {path: "productorder", component: ProducorderComponent,title: "Product Order"},
      {path: "vehicle", component: VehicleComponent, title: "Vehicle Details"},
      {path: "vaccine", component: VaccineComponent, title: "Vaccine Details"},
      {path: "vaccineorder", component: VaccineorderComponent, title: "Vaccine Order Details"},
      {path: "clinicdetail", component: ClinicComponent, title: "Clinic"},
      {path: "motherregistration", component: MotherregistrationComponent, title: "Mother Registration"},
      {path: "childrecord", component: ChildrecordComponent, title: "Child Record"},
      {path: "grn", component: GrnComponent, title: "GRN"},
      {path: "distribution", component: DistributionComponent, title: "Distribution"},
      {path: "vaccination", component: VaccinationComponent, title: "Vaccination"},
      {path: "mbireport", component: MbireportComponent, title: "MBI Report"},

      {path: "profile", component: ProfileComponent, title: "Profile"},

      {path: "mohreport", component: CountbymohComponent,title: "MOH Report"},
      {path: "porderreport", component: CountbyporderComponent,title: "POrder Report"},
      {path: "employeereport", component: EmployeebydesignationComponent,title: "Employee Report"},
      {path: "vehiclereport", component: VehiclecountbymohComponent,title: "Vehicle Report"},
      {path: "vorderreport", component: CountbyvorderComponent,title: "VOrder Report"},
      {path: "motherreport", component: CountbymotherregistrationComponent,title: "Mother Report"},
      {path:"**", component:NotfoundpageComponent}

    ]
  },

];
