package com.content.security.controller;

import com.content.security.dto.ClinictypeDTO;
import com.content.security.service.ClinicTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/clinictypes")
public class ClinicTypeController {

    private final ClinicTypeService clinicTypeService;

    @GetMapping
    public List<ClinictypeDTO> getAll(){
        return clinicTypeService.getAll();
    }
}
