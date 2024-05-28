package com.content.security.service;

import com.content.security.dto.EmployeeDTO;
import com.content.security.dto.EmployeeUpdateDTO;
import com.content.security.entity.Employee;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.EmployeeRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeServiceIMPL implements EmployeeService{

    private final EmployeeRepository employeeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<EmployeeDTO> getAllEmployees() {

        List<Employee> employees = employeeRepository.findAll();

        if(!employees.isEmpty()){
            List<EmployeeDTO> employeeDTOList = objectMapper.EmployeeListToEmployeeDTOList(employees);
            return employeeDTOList;
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

        if(employee ==  null){
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
}
