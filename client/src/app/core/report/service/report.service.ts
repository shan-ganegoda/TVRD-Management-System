import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environment";
import {Moh} from "../../entity/moh";
import {CountByPdh} from "../entity/countByPdh";
import {CountByPOrders} from "../entity/countByPOrders";
import {CountByDesignation} from "../entity/countByDesignation";
import {VehicleCountByMoh} from "../entity/vehiclecountbymoh";
import {CountByVOrders} from "../entity/countbyvorders";
import {ProductOrdersByProduct} from "../entity/productordersbyproduct";
import {CountByMotherRegistration} from "../entity/countbymotherregistration";
import {CountByChildRegistration} from "../entity/countbychildregistration";
import {VehicleCountByRdh} from "../entity/vehiclecountbyrdh";
import {Mohcount} from "../entity/mohcount";
import {DistributionCount} from "../entity/distributioncount";

const API_URL = environment.apiUrl + '/admin/reports';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }

  countByPdh(){
    return this.http.get<CountByPdh[]>(API_URL + "/countbypdh");
  }

  mohCountBelowH(){
    return this.http.get<Mohcount[]>(API_URL + "/packetsbelowh");
  }

  countByPorder(query:string){
    return this.http.get<CountByPOrders[]>(API_URL + "/countbyproductorderdate"+ query);
  }

  countByDesignation(){
    return this.http.get<CountByDesignation[]>(API_URL + "/countbydesignation");
  }

  vehicleCountByMoh(){
    return this.http.get<VehicleCountByMoh[]>(API_URL + "/vehiclecountbymoh");
  }
  vehicleCountByRdh(){
    return this.http.get<VehicleCountByRdh[]>(API_URL + "/vehiclecountbyrdh");
  }

  countByVorder(query:string){
    return this.http.get<CountByVOrders[]>(API_URL + "/countbyvaccineorderdate"+ query);
  }

  productOrdersByProduct(query:string){
    return this.http.get<ProductOrdersByProduct[]>(API_URL + "/countbyproductorderdateandproduct"+ query);
  }

  getMotherRegistrationCount(query:string){
    return this.http.get<CountByMotherRegistration[]>(API_URL+"/countbymotherregister"+query);
  }

  getChildRegistrationCount(query:string){
    return this.http.get<CountByChildRegistration[]>(API_URL+"/countbychildregister"+query);
  }

  getDistributionCount(){
    return this.http.get<DistributionCount[]>(API_URL+"/distributioncount");
  }
}
