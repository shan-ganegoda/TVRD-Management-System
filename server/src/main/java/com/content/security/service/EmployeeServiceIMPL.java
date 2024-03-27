package com.content.security.service;

import com.content.security.dto.EmployeeDTO;
import com.content.security.dto.EmployeeUpdateDTO;
import com.content.security.entity.Employee;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.EmployeeRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class EmployeeServiceIMPL implements EmployeeService{

    private final EmployeeRepository employeeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<EmployeeDTO> getAllEmployees(HashMap<String, String> params) {

        List<Employee> employees = employeeRepository.findAll();

        if(!employees.isEmpty()){
            List<EmployeeDTO> employeeDTOList = objectMapper.EmployeeListToEmployeeDTOList(employees);
            if(params.isEmpty()){
                return employeeDTOList;
            }else{

                String number = params.get("number");
                String genderid = params.get("genderid");
                String designationid = params.get("designationid");
                String fullname = params.get("fullname");

                Stream<EmployeeDTO> estreame = employeeDTOList.stream();

                if(designationid!=null) estreame = estreame.filter(e-> e.getDesignation().getId()==Integer.parseInt(designationid));
                if(genderid!=null) estreame = estreame.filter(e-> e.getGender().getId()==Integer.parseInt(genderid));
                if(number!=null) estreame = estreame.filter(e-> e.getNumber().equals(number));
                if(fullname!=null) estreame = estreame.filter(e-> e.getFullname().contains(fullname));

                return estreame.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("Employees Not Found");
        }
    }

    @Override
    public EmployeeDTO getEmployeeById(Integer id) {

        Employee employee = employeeRepository.getReferenceById(id);

        if(employee != null){
            EmployeeDTO employeeDTO = objectMapper.employeeToEmployeeDTO(employee);
            return employeeDTO;
        }else{
            throw new ResourceNotFountException("Employee Not Found");
        }

    }



    @Override
    public String saveEmployee(EmployeeDTO employeeDTO) {

        Employee employee = employeeRepository.findByNic(employeeDTO.getNic());
        Employee employee1 = employeeRepository.findByNicAndNumber(employeeDTO.getNic(),employeeDTO.getNumber());



        if(employee ==  null && employee1 == null){
            Employee employeeRecord = objectMapper.employeeDTOTOEmployee(employeeDTO);
            employeeRepository.save(employeeRecord);
            return employeeDTO.getFullname() + " Saved Successfully";
        }else{
            throw new RuntimeException("Employee Already Exist");
        }
    }

    @Override
    public String deleteEmployee(Integer id) {

        if(employeeRepository.existsById(id)){
            employeeRepository.deleteById(id);
            return "Successfully Deleted!";
        }else{
            throw new ResourceNotFountException("Employee Not Found!");
        }

    }

    @Override
    public String updateEmployee(EmployeeUpdateDTO employeeUpdateDTO) {

        if(employeeRepository.existsById(employeeUpdateDTO.getId())){
            Employee employee = objectMapper.employeeUpdateDtoToEmployee(employeeUpdateDTO);
            //System.out.println(employee);
            employeeRepository.save(employee);
            return employeeUpdateDTO.getFullname() + " Successfully Updated!";
        }else{
            throw new ResourceNotFountException("Employee Not Found!");
        }
    }

    @Override
    public EmployeeDTO getEmployeeByNumber(String number) {

        if(employeeRepository.existsByNumber(number)){
            Employee employee = employeeRepository.findByNumber(number);
            return objectMapper.employeeToEmployeeDTO(employee);
        }else{
            throw new ResourceNotFountException("No Employee Found");
        }
    }

    @Override
    public String deleteEmployeeByNumber(String number) {
        Employee employee = employeeRepository.findByNumber(number);
        if(employee != null){
            employeeRepository.delete(employee);
            return "Successfully Deleted!";
        }else{
            throw new ResourceNotFountException("No Employee Found!");
        }
    }
}
