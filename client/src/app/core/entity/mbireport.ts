import {Moh} from "./moh";
import {Rdh} from "./rdh";
import {Employee} from "./employee";
import {ReviewStatus} from "./reviewstatus";
import {ReportCategory} from "./reportcategory";

export interface MbiReport{

  id?:number;
  code?:string;
  date?:string;
  moh?:Moh;
  rdh?:Rdh;
  employee?:Employee;
  motherregcount?:number;
  motherattendacecount?:number;
  mdistributionscount?:number;
  issuedmpackets?:number;
  childregcount?:number;
  childattendacecount?:number;
  cdistributionscount?:number;
  issuedcpacketscount?:number;
  heldcliniccount?:number;
  receivedpacketcount?:number;
  distributedpacketcount?:number;
  remainingpacketscount?:number;
  totalregcount?:number;
  totalattendacecount?:number;
  totaldistributionscount?:number;
  totalissuedpacketscount?:number;
  reviewstatus?:ReviewStatus;
  reportcategory?:ReportCategory;
  description?:string;

}


