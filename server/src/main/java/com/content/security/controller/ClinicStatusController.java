package com.content.security.controller;

import com.content.security.dto.ClinicstatusDTO;
import com.content.security.entity.Clinicstatus;
import com.content.security.service.ClinicStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/clinicstatuses")
public class ClinicStatusController {

    private final ClinicStatusService clinicStatusService;

    @GetMapping
    public List<ClinicstatusDTO> getAll(){
        return clinicStatusService.getAll();
    }
}
