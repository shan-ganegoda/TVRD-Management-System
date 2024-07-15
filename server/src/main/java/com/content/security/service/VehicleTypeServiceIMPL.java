package com.content.security.service;

import com.content.security.dto.VehicleTypeDTO;
import com.content.security.entity.Vehicletype;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VehicleTypeRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleTypeServiceIMPL implements VehicleTypeService {

    private final VehicleTypeRepository vehicleTypeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VehicleTypeDTO> getAll() {
        List<Vehicletype> vehicletypes = vehicleTypeRepository.findAll();

        if(!vehicletypes.isEmpty()){
            List<VehicleTypeDTO> vehicleTypeDTOList = objectMapper.vehicleTypeListToDtoList(vehicletypes);
            return vehicleTypeDTOList;
        }else{
            throw new ResourceNotFountException("No Vehicle Types found!");
        }
    }
}
