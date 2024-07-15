package com.content.security.service;

import com.content.security.dto.VehicleStatusDTO;
import com.content.security.entity.Vehiclestatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VehicleStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleStatusServiceIMPL implements VehicleStatusService{

    private final VehicleStatusRepository vehicleStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VehicleStatusDTO> getAll() {
        List<Vehiclestatus> vehiclestatuses = vehicleStatusRepository.findAll();

        if(!vehiclestatuses.isEmpty()){
            List<VehicleStatusDTO> vehicleStatusDTOs = objectMapper.vehicleStatusListToDtoList(vehiclestatuses);
            return vehicleStatusDTOs;
        }else{
            throw new ResourceNotFountException("Vehicle status list is empty!");
        }
    }
}
