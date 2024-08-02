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

    List<VehicleTypeDTO> vehicleTypeListToDtoList(List<Vehicletype> vehicletypes);

    List<VehicleStatusDTO> vehicleStatusListToDtoList(List<Vehiclestatus> vehiclestatuses);

    List<VehicleModelDTO> vehicleModelListToDtoList(List<Vehiclemodel> vehicleModelList);

    List<VaccineDTO> vaccineListToDtoList(List<Vaccine> vaccineList);

    Vaccine vaccineDtoToVaccine(VaccineDTO vaccineDTO);

    List<DoseDTO> doseListToDtoList(List<Dose> doses);

    List<VaccineStatusDTO> vaccineStatusListToDtoList(List<Vaccinestatus> vaccinestatuses);

    List<VaccineStatusDTO> vaccinationStageListToVaccinationDtoList(List<Vaccinationstage> vaccinationstages);

    List<VaccineOrderDTO> vaccineOrderListToDtoList(List<Vaccineorder> vaccineorders);

    Vaccineorder vaccineOrderDtoToVaccineOrder(VaccineOrderDTO vaccineOrderDTO);

    List<VaccineOrderStatusDTO> vaccineOrderStatusListToDtoList(List<Vaccineorderstatus> vaccineorderstatuses);

    List<ClinicDTO> clinicListToDtoList(List<Clinic> clinics);

    Clinic clinicDtoToClinic(ClinicDTO clinicDTO);

    List<ClinicstatusDTO> clinicStatusListToDtoList(List<Clinicstatus> clinicStatusList);

    List<ClinictypeDTO> clinicTypeListToDtoList(List<Clinictype> clinictypes);

    List<MotherDTO> motherListToDtoList(List<Mother> mothers);

    Mother motherDtoToMother(MotherDTO motherDTO);

    List<BloodTypeDTO> bloodTypeListToDtoList(List<Bloodtype> bloodTypeList);

    List<InvolvementStatusDTO> involvementStatusListToDtoList(List<Involvementstatus> all);

    List<MaritalstatusDTO> maritalStatusListToDtoList(List<Maritalstatus> maritalStatuses);
    
    Operation operationDtoToOperation(OperationDTO operation);

    Module moduleDtoToModule(ModuleDTO module);

    List<ChildRecordDTO> childRecordListToDtoList(List<Childrecord> childRecords);

    Childrecord childRecordDtoToChildRecord(ChildRecordDTO childRecordDTO);

    List<HealthStatusDTO> healthStatusListToDtoList(List<Healthstatus> healthStatusList);

    List<GrnDTO> grnListToDtoList(List<Grn> grns);

    Grn grnDtoToGrn(GrnDTO grnDTO);

    List<GrnStatusDTO> GrnStatusListToDtoList(List<Grnstatus> grnStatusList);

    List<DistributionDTO> distributionListToDtoList(List<Distribution> distributions);

    Distribution distributionDtoToDistribution(DistributionDTO distributionDTO);

    List<DistributionProductStatusDTO> dpstatusListToDtoList(List<Distributionproductstatus> statusList);

    List<VaccinationDTO> vaccinationListToDtoList(List<Vaccination> vaccinations);

    Vaccination vaccinationDtoToVaccination(VaccinationDTO vaccinationDTO);

    List<VaccinationProgressDTO> vaccinationProgressListToDtoList(List<Vaccinationprogress> vaccinationprogressList);

    List<VaccinationStatusDTO> vaccinationstatusListToDtoList(List<Vaccinationstatus> vaccinationStatusList);

    List<VaccineOfferingDTO> vaccineOfferingListToDtoList(List<Vaccineoffering> vaccineOfferingList);

    List<MbiReportDTO> reportListToDtoList(List<Mbireport> list);

    Mbireport reportDtoToReport(MbiReportDTO mbiReportDTO);
}
