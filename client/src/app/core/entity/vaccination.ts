import {Clinic} from "./clinic";
import {ChildRecord} from "./childrecord";
import {VaccinationProgress} from "./vaccinationprogress";
import {VaccinationRecord} from "./vaccinationrecord";

export interface Vaccination{

  id?: number;
  clinic?:Clinic;
  childrecords?:ChildRecord;
  vaccinationprogress?:VaccinationProgress;
  lastupdated?:string;
  description?:string;
  vaccinationrecords:Array<VaccinationRecord>;

}


