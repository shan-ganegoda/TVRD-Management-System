package com.content.security.util.mapper;

import com.content.security.dto.*;
import com.content.security.entity.*;
import com.content.security.entity.Module;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ObjectMapper {


    List<UserDTO> userListToUserDTOList(List<User> userList);

    UserDTO userToUserDTO(User user);

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

    User UserDtoToUser(UserDTO userdto);

    List<UserStatusDTO> userStatusListToUserStatusDTOList(List<UserStatus> userStatusList);

    List<UserTypeDTO> userTypeListToUserTypeDTOList(List<UserType> userTypeList);

    List<MohDTO> MohListToMohDTOList(List<Moh> mohList);

    Moh mohDtoToMoh(MohDTO mohDTO);

    Moh dtoToMoh(MohDTO mohDTO);

    MohDTO MohToDTO(Moh moh);

    List<DistrictDTO> districtListToDtoList(List<Rdh> rdhList);

    List<MohStatusDTO> mohStatusListToMohStatusDtoList(List<Mohstatus> mohstatusList);

    List<ProductOrderDTO> productOrderToDtoList(List<Productorder> productOrders);

    List<ProductDTO> ProductListToDtoList(List<Product> products);

    List<ProductOrderStatusDTO> productOrderStatusDTOListToDtoList(List<Productorderstatus> productOrderStatuses);

    ProductDTO ProductToDto(Product product);

    Productorder productOrderDtoToProductOrder(ProductOrderDTO productOrderDTO);

    List<VehicleDTO> vehicleListToDtoList(List<Vehicle> vehicles);

    Vehicle vehicleDtoToVehicle(VehicleDTO vehicleDTO);
}
