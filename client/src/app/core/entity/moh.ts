import {Role} from "./role";
import {Employee} from "./employee";
import {UserType} from "./usertype";
import {UserStatus} from "./userstatus";
import {Rdh} from "./rdh";
import {MohStatus} from "./mohstatus";

export interface Moh {

  id?: number;
  name?: string;
  codename?:string;
  tele?: string;
  faxno?: string;
  email?: string;
  employee?: Employee;
  location?: string;
  address?: string;
  rdh?: Rdh;
  toopen?: string;
  toclose?: string;
  doestablished?:string;
  packetcount?:number;
  mohstatus?: MohStatus;

}

