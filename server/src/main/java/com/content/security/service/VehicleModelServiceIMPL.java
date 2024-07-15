package com.content.security.service;

import com.content.security.dto.VehicleModelDTO;
import com.content.security.entity.Vehiclemodel;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VehicleModelRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VehicleModelServiceIMPL implements VehicleModelService {

    private final VehicleModelRepository vehicleModelRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VehicleModelDTO> getAll() {
        List<Vehiclemodel> vehicleModelList = vehicleModelRepository.findAll();

        if (!vehicleModelList.isEmpty()) {
            List<VehicleModelDTO> vehicleModelDTOList = objectMapper.vehicleModelListToDtoList(vehicleModelList);
            return vehicleModelDTOList;
        }else {
            throw new ResourceNotFountException("Vehicle Models Not Found!");
        }
    }
}
