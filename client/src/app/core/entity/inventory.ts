import {Employee} from "./employee";
import {Moh} from "./moh";
import {ProductOrderProducts} from "./productorderproducts";
import {Grn} from "./grn";
import {InventoryStatus} from "./inventorystatus";
import {InventoryProducts} from "./inventoryproducts";

export interface Inventory{

  id?:number
  moh?:Moh;
  employee:Employee;
  bagscount:number
  totalpacketcount:number
  description:string
  date:string
  inventorystatus:InventoryStatus;

}
