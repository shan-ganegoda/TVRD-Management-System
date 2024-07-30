package com.content.security.service;

import com.content.security.dto.VaccinationStatusDTO;
import com.content.security.entity.Vaccinationstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VaccinationStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccinationStatusServiceIMPL implements VaccinationStatusService{

    private final VaccinationStatusRepository vaccinationStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VaccinationStatusDTO> getAll() {
        List<Vaccinationstatus> vaccinationStatusList = vaccinationStatusRepository.findAll();
        if(!vaccinationStatusList.isEmpty()){
            List<VaccinationStatusDTO> vaccinationStatusDTOList = objectMapper.vaccinationstatusListToDtoList(vaccinationStatusList);
            return vaccinationStatusDTOList;
        }else{
            throw new ResourceNotFountException("Vaccination Status Not Found!");
        }
    }
}
