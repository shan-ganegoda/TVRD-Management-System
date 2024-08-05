
import {Gender} from "./gender";
import {Mother} from "./mother";
import {BloodType} from "./bloodtype";
import {InvolvementStatus} from "./involvementstatus";
import {HealthStatus} from "./healthstatus";
import {Clinic} from "./clinic";

export interface ChildRecord{

  id?: number;
  fullname?:string;
  regno?:string;
  dobirth:string;
  gender?:Gender;
  doregistered?:string;
  mother?:Mother;
  birthweight?:number;
  headperimeter?:number;
  bloodtype?:BloodType;
  heightinbirth?:number;
  placeofbirth?:string;
  apgarscore?:number;
  healthstatus?:HealthStatus;
  involvementstatus?:InvolvementStatus;
  clinic?:Clinic;

}

