package com.content.security.controller;

import com.content.security.dto.VehicleDTO;
import com.content.security.service.VehicleService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping
    public List<VehicleDTO> getVehicles(@RequestParam HashMap<String,String> params){
        return vehicleService.getVehicles(params);
    }

    @PostMapping
    public VehicleDTO save(@RequestBody VehicleDTO vehicleDTO){
        return vehicleService.saveVehicle(vehicleDTO);
    }

    @PutMapping
    public VehicleDTO update(@RequestBody VehicleDTO vehicleDTO){
        return vehicleService.updateVehicle(vehicleDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        vehicleService.deleteVehicle(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",null), HttpStatus.OK
        );
    }


}
