import {Product} from "./product";

export class InventoryProducts{
  id:number
  product:Product
  quentity:number

  constructor(id:number,product:Product,quentity:number) {
    this.id = id;
    this.product = product;
    this.quentity = quentity;

  }
}
