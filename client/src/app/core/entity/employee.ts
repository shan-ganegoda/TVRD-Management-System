import {Gender} from "./gender";
import {Designation} from "./designation";
import {EmpType} from "./emptype";
import {EmployeeStatus} from "./employeestatus";

export interface Employee{

  id?: number;
  number:string;
  fullname:string;
  callingname:string;
  photo?:string;
  dobirth:string;
  nic:string;
  address:string;
  mobile:string;
  land:string;
  description:string;
  email?:string;
  gender:Gender;
  designation:Designation;
  emptype:EmpType;
  employeestatus:EmployeeStatus;
}


