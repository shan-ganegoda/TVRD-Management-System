package com.content.security.controller;


import com.content.security.dto.VehicleStatusDTO;
import com.content.security.service.VehicleStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/vehiclestatuses")
@RequiredArgsConstructor
public class VehicleStatusController {

    private final VehicleStatusService vehicleStatusService;

    @GetMapping
    public List<VehicleStatusDTO> getAll(){
        return vehicleStatusService.getAll();
    }
}
