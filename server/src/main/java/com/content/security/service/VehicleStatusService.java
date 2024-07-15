package com.content.security.service;

import com.content.security.dto.VehicleStatusDTO;

import java.util.List;

public interface VehicleStatusService {
    List<VehicleStatusDTO> getAll();
}
