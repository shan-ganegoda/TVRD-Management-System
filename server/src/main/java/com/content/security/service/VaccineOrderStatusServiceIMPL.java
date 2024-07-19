package com.content.security.service;

import com.content.security.dto.VaccineOrderStatusDTO;
import com.content.security.entity.Vaccineorderstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VaccineOrderStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccineOrderStatusServiceIMPL implements VaccineOrderStatusService {

    private final VaccineOrderStatusRepository vaccineOrderStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VaccineOrderStatusDTO> getAll() {
        List<Vaccineorderstatus> vaccineorderstatuses = vaccineOrderStatusRepository.findAll();

        if (!vaccineorderstatuses.isEmpty()) {
            List<VaccineOrderStatusDTO> vaccineOrderStatusDTOs = objectMapper.vaccineOrderStatusListToDtoList(vaccineorderstatuses);
            return vaccineOrderStatusDTOs;
        }else{
            throw new ResourceNotFountException("No VaccineOrderStatus found");
        }
    }
}
