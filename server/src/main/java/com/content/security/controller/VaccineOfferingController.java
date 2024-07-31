package com.content.security.controller;

import com.content.security.dto.VaccineOfferingDTO;
import com.content.security.service.VaccineOfferingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/vaccineofferings")
public class VaccineOfferingController {

    private final VaccineOfferingService vaccineOfferingService;

    @GetMapping
    public List<VaccineOfferingDTO> getAll(){
        return vaccineOfferingService.getAll();
    }
}
