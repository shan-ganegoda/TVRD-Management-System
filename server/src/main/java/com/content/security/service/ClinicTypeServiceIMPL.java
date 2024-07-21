package com.content.security.service;

import com.content.security.dto.ClinictypeDTO;
import com.content.security.entity.Clinictype;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ClinicTypeRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClinicTypeServiceIMPL implements ClinicTypeService {

    private final ClinicTypeRepository clinicTypeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ClinictypeDTO> getAll() {
        List<Clinictype> clinictypes = clinicTypeRepository.findAll();
        if(!clinictypes.isEmpty()) {
            List<ClinictypeDTO> clinictypeDTOList = objectMapper.clinicTypeListToDtoList(clinictypes);
            return clinictypeDTOList;
        }else{
            throw new ResourceNotFountException("Clinic Types Not Found!");
        }
    }
}
