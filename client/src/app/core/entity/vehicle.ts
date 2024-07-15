import {VehicleStatus} from "./vehiclestatus";
import {VehicleType} from "./vehicletype";
import {VehicleModel} from "./vehiclemodel";
import {Moh} from "./moh";

export interface Vehicle{

  id: number;
  number?:string;
  doattached?:string;
  yom?:number;
  capacity?:number;
  description?:string;
  currentmeterreading?:number;
  lastregdate?:string;
  vehiclestatus?:VehicleStatus;
  vehicletype?:VehicleType;
  vehiclemodel?:VehicleModel;
  moh?:Moh;
}


