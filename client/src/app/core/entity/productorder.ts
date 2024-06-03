import {Employee} from "./employee";
import {Moh} from "./moh";
import {ProductOrderStatus} from "./productorderstatus";
import {ProductOrderProducts} from "./productorderproducts";

export interface ProductOrder{

  id?:number
  code:string,
  dorequired:string
  grandtotal:number
  dorequested:string
  description:string
  productorderstatus:ProductOrderStatus
  employee:Employee
  moh:Moh
  productorderproducts:Array<ProductOrderProducts>

}
