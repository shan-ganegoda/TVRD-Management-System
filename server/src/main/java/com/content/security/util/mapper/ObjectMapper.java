package com.content.security.util.mapper;

import com.content.security.dto.*;
import com.content.security.entity.*;
import com.content.security.entity.Module;
import org.mapstruct.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper(componentModel = "spring")
public interface ObjectMapper {


    List<UserDTO> userListToUserDTOList(List<User> userList);

    UserDTO userToUserDTO(Optional<User> user);

    User userDTOToUser(UserDTO userdto);

    List<EmployeeDTO> EmployeeListToEmployeeDTOList(List<Employee> employees);

    EmployeeDTO employeeToEmployeeDTO(Employee employee);

    Employee employeeDTOTOEmployee(EmployeeDTO employeeDTO);

    Employee employeeUpdateDtoToEmployee(EmployeeUpdateDTO employeeUpdateDTO);

    List<GenderDTO> genderListToGenderDTOList(List<Gender> genderList);

    List<DesignationDTO> designationListToDesignationDTOList(List<Designation> designationList);

    List<EmployeeStatusDTO> employeeStatusListToEmployeeStatusDTOList(List<Employeestatus> employeestatusList);

    List<EmpTypeDTO> empTypeListToEmpTypeDTOList(List<EmpType> empTypeList);

    List<RoleDTO> roleListToRoleDTOList(List<Role> roleList);

    List<AuthorityDTO> authorityListToDtoList(List<Authority> authorityList);

    Authority dtoToAuthority(AuthorityDTO authorityDTO);

    List<OperationDTO> operationListToOperationDTOList(List<Operation> operationList);

    List<ModuleDTO> moduleListToModuleDTOList(List<Module> moduleList);
}
