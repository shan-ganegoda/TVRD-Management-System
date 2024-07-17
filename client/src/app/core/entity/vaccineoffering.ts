import {VaccinationStage} from "./vaccinationstage";

export class VaccineOffering{
  id:number
  dose:number
  vaccinationstage:VaccinationStage
  year:number
  month:number

  constructor(id:number,dose:number,vaccinationstage:VaccinationStage,year:number,month:number) {
    this.id = id;
    this.dose = dose;
    this.vaccinationstage = vaccinationstage;
    this.year = year;
    this.month = month;

  }
}
