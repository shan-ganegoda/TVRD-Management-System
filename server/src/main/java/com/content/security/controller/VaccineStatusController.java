package com.content.security.controller;

import com.content.security.dto.VaccineStatusDTO;
import com.content.security.service.VaccineStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/vaccinestatuses")
public class VaccineStatusController {

    private final VaccineStatusService vaccineStatusService;

    @GetMapping
    public List<VaccineStatusDTO> getAll(){
        return vaccineStatusService.getAll();
    }
}
