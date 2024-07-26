import {Role} from "./role";
import {Module} from "./module";
import {Operation} from "./operation";

export interface Authority{

  id?: number;
  role?:Role;
  module?:Module;
  operation?:Operation;

}


