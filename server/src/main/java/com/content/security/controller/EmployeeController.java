package com.content.security.controller;

import com.content.security.dto.EmployeeDTO;
import com.content.security.dto.EmployeeUpdateDTO;
import com.content.security.entity.Employee;
import com.content.security.service.EmployeeService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @GetMapping
    public List<EmployeeDTO> getAllEmployees(@RequestParam HashMap<String,String> params){
        List<EmployeeDTO> allEmployees = employeeService.getAllEmployees(params);
        return allEmployees;

    }

    @GetMapping(path = "/list")
    public List<EmployeeDTO> getEmployees(@RequestParam HashMap<String,String> params){
        return employeeService.getEmployees(params);
    }

    @GetMapping("/{id}")
    public EmployeeDTO getEmployeeById(@PathVariable Integer id){
        EmployeeDTO employee = employeeService.getEmployeeById(id);
        return employee;

//        return new ResponseEntity<StandardResponse>(
//                new StandardResponse(200,"Success",employee),HttpStatus.OK
//        );
    }

    @GetMapping("/snumber/{number}")
    public EmployeeDTO getEmployeeByNumber(@PathVariable String number){
        EmployeeDTO employee = employeeService.getEmployeeByNumber(number);
        return employee;
    }

    @PostMapping
    public ResponseEntity<StandardResponse> saveEmployee(@RequestBody EmployeeDTO employeeDTO){
        String message = employeeService.saveEmployee(employeeDTO);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(201,"Created",message),HttpStatus.CREATED
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteEmployee(@PathVariable Integer id){
        String message = employeeService.deleteEmployee(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message),HttpStatus.OK
        );
    }

    @DeleteMapping("/dnumber/{number}")
    public ResponseEntity<StandardResponse> deleteEmployeeByNumber(@PathVariable String number){
        String message = employeeService.deleteEmployeeByNumber(number);
        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message),HttpStatus.OK
        );
    }


    @PutMapping
    public ResponseEntity<StandardResponse> updateEmployee(@RequestBody EmployeeUpdateDTO employeeUpdateDTO){
        String message = employeeService.updateEmployee(employeeUpdateDTO);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Updated",message),HttpStatus.OK
        );
    }
}
