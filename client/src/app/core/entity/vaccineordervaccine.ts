import {Product} from "./product";
import {Vaccine} from "./vaccine";

export class VaccineOrderVaccine{
  id:number
  vaccine:Vaccine
  quentity:number


  constructor(id:number,vaccine:Vaccine,quentity:number) {
    this.id = id;
    this.vaccine = vaccine;
    this.quentity = quentity;


  }
}
