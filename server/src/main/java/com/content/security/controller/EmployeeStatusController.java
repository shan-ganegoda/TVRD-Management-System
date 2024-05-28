package com.content.security.controller;

import com.content.security.dto.EmployeeStatusDTO;
import com.content.security.dto.GenderDTO;
import com.content.security.service.EmployeeStatusService;
import com.content.security.service.GenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/admin/employeestatuses")
public class EmployeeStatusController {

    private final EmployeeStatusService employeeStatusService;

    @GetMapping
    public List<EmployeeStatusDTO> getAll(){
        return employeeStatusService.getAll();
    }
}
