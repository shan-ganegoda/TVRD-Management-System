
import {Clinic} from "./clinic";
import {BloodType} from "./bloodtype";
import {MaritalStatus} from "./maritalstatus";
import {InvolvementStatus} from "./involvementstatus";

export interface Mother{

  id?: number;
  registerno?: string;
  clinic?: Clinic;
  mothername?: string;
  nic?: string;
  mobileno?: string;
  dopregnant?: string;
  bloodtype?: BloodType;
  maritalstatus?:MaritalStatus;
  age?: number;
  address?:string;
  currentweight?:number;
  doregistered?:string;
  involvementstatus?:InvolvementStatus;
  description?:string;

}



