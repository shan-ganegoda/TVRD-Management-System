import {ProductOrder} from "./productorder";
import {Employee} from "./employee";
import {GrnStatus} from "./grnstatus";
import {GrnProduct} from "./grnproduct";

export interface Grn{

  id?: number;
  code?:string;
  productorder?:ProductOrder;
  date?:string;
  time?:string;
  bagscount?:number;
  railwaystation?:string;
  employee?:Employee;
  description?:string;
  grnstatus?:GrnStatus;
  grnproducts:Array<GrnProduct>;

}


