package com.content.security.service;

import com.content.security.dto.VaccineStatusDTO;
import com.content.security.entity.Vaccinestatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VaccineStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccineStatusServiceIMPL implements VaccineStatusService {

    private final VaccineStatusRepository repository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VaccineStatusDTO> getAll() {
        List<Vaccinestatus> vaccinestatuses = repository.findAll();

        if(!vaccinestatuses.isEmpty()){
            List<VaccineStatusDTO> vaccineStatusDTOList = objectMapper.vaccineStatusListToDtoList(vaccinestatuses);
            return vaccineStatusDTOList;
        }else{
            throw new ResourceNotFountException("Vaccine Statuses Not Found!");
        }
    }
}
