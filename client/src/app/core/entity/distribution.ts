import {Moh} from "./moh";
import {Employee} from "./employee";
import {ClinicType} from "./clinictype";
import {ClinicStatus} from "./clinicstatus";
import {Clinic} from "./clinic";
import {Mother} from "./mother";
import {DistributionProduct} from "./distributionproduct";

export interface Distribution{

  id?: number;
  clinic:Clinic;
  mother:Mother;
  description?:string;
  lastupdated?:string;
  distributionproducts:Array<DistributionProduct>;

}


