package com.content.security.service;

import com.content.security.dto.MaritalstatusDTO;
import com.content.security.entity.Maritalstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.MaritalStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MaritalStatusServiceIMPL implements MaritalStatusService {

    private final MaritalStatusRepository maritalStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<MaritalstatusDTO> getAll() {
        List<Maritalstatus> maritalStatuses = maritalStatusRepository.findAll();
        if(!maritalStatuses.isEmpty()){
            List<MaritalstatusDTO> maritalstatusDTOS = objectMapper.maritalStatusListToDtoList(maritalStatuses);
            return maritalstatusDTOS;
        }else{
            throw new ResourceNotFountException("No marital status found");
        }
    }
}
