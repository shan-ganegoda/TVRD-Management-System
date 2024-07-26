package com.content.security.controller;

import com.content.security.dto.HealthStatusDTO;
import com.content.security.entity.Healthstatus;
import com.content.security.service.HealthStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/healthstatuses")
@RequiredArgsConstructor
public class HealthStatusController {

    private final HealthStatusService healthStatusService;

    @GetMapping
    public List<HealthStatusDTO> getAll(){
        return healthStatusService.getAll();
    }
}
