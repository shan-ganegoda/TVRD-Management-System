import {Role} from "./role";
import {Employee} from "./employee";
import {UserType} from "./usertype";
import {UserStatus} from "./userstatus";

export interface User{

  id?: number;
  email: string;
  password: string;
  roles: Role[];
  employee: Employee;
  docreated?: string;
  tocreated?: string;
  userstatus: UserStatus;
  usertype: UserType;
  description?: string;

}

