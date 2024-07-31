import {VaccineOffering} from "./vaccineoffering";
import {VaccinationStatus} from "./vaccinationstatus";

export class VaccinationRecord{

  id: number;
  vaccineoffering?:VaccineOffering;
  date?:string;
  vaccinationstatus:VaccinationStatus;

  constructor(id: number,vaccineoffering:VaccineOffering,date:string,vaccinationstatus:VaccinationStatus) {
    this.id = id;
    this.vaccineoffering = vaccineoffering;
    this.vaccinationstatus = vaccinationstatus;
    this.date = date;
  }
}


