package com.content.security.controller;

import com.content.security.dto.VehicleModelDTO;
import com.content.security.service.VehicleModelService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/vehiclemodels")
@RequiredArgsConstructor
public class VehicleModelController {

    private final VehicleModelService vehicleModelService;

    @GetMapping
    public List<VehicleModelDTO> getAll(){
        return vehicleModelService.getAll();
    }
}
