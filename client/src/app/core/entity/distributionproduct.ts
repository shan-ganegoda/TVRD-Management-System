import {Product} from "./product";
import {DistributionProductStatus} from "./distributionproductstatus";

export class DistributionProduct{

  id: number;
  product:Product;
  quentity:number;
  date:string;
  distributionproductstatus:DistributionProductStatus;

  constructor(id:number,product:Product,quentity:number,date:string,distributionproductstatus:DistributionProductStatus) {
    this.id = id;
    this.product = product;
    this.quentity = quentity;
    this.date = date;
    this.distributionproductstatus = distributionproductstatus;
  }

}


