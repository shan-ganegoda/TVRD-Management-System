package com.content.security.service;

import com.content.security.dto.EmployeeDTO;
import com.content.security.dto.EmployeeUpdateDTO;

import java.util.HashMap;
import java.util.List;

public interface EmployeeService {

    List<EmployeeDTO> getAllEmployees(HashMap<String, String> params);

    EmployeeDTO getEmployeeById(Integer id);

    String saveEmployee(EmployeeDTO employeeDTO);

    String deleteEmployee(Integer id);

    String updateEmployee(EmployeeUpdateDTO employeeUpdateDTO);

    EmployeeDTO getEmployeeByNumber(String number);

    String deleteEmployeeByNumber(String number);
}
