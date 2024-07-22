import {Moh} from "./moh";
import {Employee} from "./employee";
import {ClinicType} from "./clinictype";
import {ClinicStatus} from "./clinicstatus";

export interface Clinic{

  id?: number;
  divisionname?:string;
  divisionno?:string;
  moh?:Moh;
  clinicdate?:string;
  tostart?:string;
  toend?:string;
  lastupdated?:string;
  location?:string;
  employee?:Employee;
  description?:string;
  clinictype?: ClinicType;
  clinicstatus?: ClinicStatus;

}


