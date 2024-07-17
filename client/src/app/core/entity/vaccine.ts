import {VaccineStatus} from "./vaccinestatus";
import {Employee} from "./employee";
import {VaccineOffering} from "./vaccineoffering";

export interface Vaccine{
  id:number
  name?:string
  code?:string
  dosecount?:number
  containindications?:string
  dosaved?:string
  offeredinstitute?:string
  vaccinestatus?:VaccineStatus
  vaccineofferings?:Array<VaccineOffering>
  employee?:Employee

}

