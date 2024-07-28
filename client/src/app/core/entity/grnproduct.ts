import {Product} from "./product";
import {Grn} from "./grn";

export class GrnProduct{

  id: number;
  product:Product;
  quentity:number;

  constructor(id:number,product:Product,quentity:number) {
    this.id = id;
    this.product = product;
    this.quentity = quentity;
  }

}


