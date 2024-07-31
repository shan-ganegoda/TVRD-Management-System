package com.content.security.service;

import com.content.security.dto.VaccineOfferingDTO;
import com.content.security.entity.Vaccineoffering;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VaccineOfferingRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccineOfferingServiceIMPL implements VaccineOfferingService{

    private final VaccineOfferingRepository vaccineOfferingRepository;
    private final ObjectMapper objectMapper;


    @Override
    public List<VaccineOfferingDTO> getAll() {
        List<Vaccineoffering> vaccineOfferingList = vaccineOfferingRepository.findAll();
        if(!vaccineOfferingList.isEmpty()){
            return objectMapper.vaccineOfferingListToDtoList(vaccineOfferingList);
        }else{
            throw new ResourceNotFountException("VaccineOfferings Not Found!");
        }
    }
}
