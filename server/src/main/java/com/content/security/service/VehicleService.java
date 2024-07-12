package com.content.security.service;

import com.content.security.dto.VehicleDTO;

import java.util.HashMap;
import java.util.List;

public interface VehicleService {
    List<VehicleDTO> getVehicles(HashMap<String, String> params);

    VehicleDTO saveVehicle(VehicleDTO vehicleDTO);

    VehicleDTO updateVehicle(VehicleDTO vehicleDTO);

    void deleteVehicle(Integer id);
}
