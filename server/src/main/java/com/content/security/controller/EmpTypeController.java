package com.content.security.controller;

import com.content.security.dto.EmpTypeDTO;
import com.content.security.service.EmpTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/emptypes")
public class EmpTypeController {

    private final EmpTypeService empTypeService;

    @GetMapping
    public List<EmpTypeDTO> getAll(){
        return empTypeService.getAll();
    }
}
