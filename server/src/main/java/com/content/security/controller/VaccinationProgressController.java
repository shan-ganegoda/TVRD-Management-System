package com.content.security.controller;

import com.content.security.dto.VaccinationProgressDTO;
import com.content.security.service.VaccinationProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/vaccinationprogresses")
public class VaccinationProgressController {

    private final VaccinationProgressService vaccinationProgressService;

    @GetMapping
    public List<VaccinationProgressDTO> getAll(){
        return vaccinationProgressService.getAll();
    }
}
