package com.content.security.service;

import com.content.security.dto.DoseDTO;
import com.content.security.entity.Dose;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.DoseRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoseServiceIMPL implements DoseService{

    private final DoseRepository doseRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<DoseDTO> getAll() {
        List<Dose> doses = doseRepository.findAll();

        if(!doses.isEmpty()){
            List<DoseDTO> doseDTOS = objectMapper.doseListToDtoList(doses);
            return doseDTOS;
        }else{
            throw new ResourceNotFountException("Doses Not Found!");
        }
    }
}
