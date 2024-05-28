import {Product} from "./product";

export class ProductOrderProducts{
  id:number
  product:Product
  quentity:number
  linetotal:number

  constructor(id:number,product:Product,quentity:number,linetotal:number) {
    this.id = id;
    this.product = product;
    this.quentity = quentity;
    this.linetotal = linetotal;

  }
}
