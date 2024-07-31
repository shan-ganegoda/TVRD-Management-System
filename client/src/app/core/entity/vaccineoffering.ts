import {VaccinationStage} from "./vaccinationstage";
import {Dose} from "./dose";

export class VaccineOffering{
  id:number
  dose:Dose
  vaccinationstage:VaccinationStage
  year:number
  month:number
  title?:string

  constructor(id:number,dose:Dose,vaccinationstage:VaccinationStage,year:number,month:number,title:string) {
    this.id = id;
    this.dose = dose;
    this.vaccinationstage = vaccinationstage;
    this.year = year;
    this.month = month;
    this.title = title;

  }
}
