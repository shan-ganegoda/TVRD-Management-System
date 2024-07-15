package com.content.security.controller;

import com.content.security.dto.VehicleTypeDTO;
import com.content.security.service.VehicleTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/vehicletypes")
@RequiredArgsConstructor
public class VehicleTypeController {

    private final VehicleTypeService vehicleTypeService;

    @GetMapping
    public List<VehicleTypeDTO> getAll(){
        return vehicleTypeService.getAll();
    }
}
