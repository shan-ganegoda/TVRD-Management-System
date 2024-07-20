import {Employee} from "./employee";
import {Moh} from "./moh";
import {ProductOrderStatus} from "./productorderstatus";
import {ProductOrderProducts} from "./productorderproducts";
import {VaccineOrderStatus} from "./vaccineorderstatus";
import {VaccineOrderVaccine} from "./vaccineordervaccine";

export interface VaccineOrder{

  id?:number
  code:string,
  dorequired:string
  dorequested:string
  description:string
  vaccineorderstatus:VaccineOrderStatus
  employee:Employee
  moh:Moh
  vaccineordervaccines:Array<VaccineOrderVaccine>

}
