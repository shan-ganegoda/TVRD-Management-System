package com.content.security.controller;


import com.content.security.dto.VaccineStatusDTO;
import com.content.security.service.VaccinationStageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/vaccinationstages")
@RequiredArgsConstructor
public class VaccinationStageController {

    private final VaccinationStageService vaccinationStageService;

    @GetMapping
    public List<VaccineStatusDTO> getAll(){
        return vaccinationStageService.getAll();
    }
}
