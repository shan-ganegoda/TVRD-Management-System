package com.content.security.controller;

import com.content.security.dto.MaritalstatusDTO;
import com.content.security.service.MaritalStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/maritalstatuses")
public class MaritalStatusController {

    private final MaritalStatusService maritalStatusService;

    @GetMapping
    public List<MaritalstatusDTO> getAll(){
        return maritalStatusService.getAll();
    }
}
