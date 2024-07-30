package com.content.security.controller;

import com.content.security.dto.BloodTypeDTO;
import com.content.security.dto.VaccinationStatusDTO;
import com.content.security.entity.Vaccinationstatus;
import com.content.security.service.BloodTypeService;
import com.content.security.service.VaccinationStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/vaccinationstatuses")
public class VaccinationStatusController {

    private final VaccinationStatusService vaccinationstatus;

    @GetMapping
    public List<VaccinationStatusDTO> getAll(){
        return vaccinationstatus.getAll();
    }
}
