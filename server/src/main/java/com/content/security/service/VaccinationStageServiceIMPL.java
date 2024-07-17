package com.content.security.service;

import com.content.security.dto.VaccineStatusDTO;
import com.content.security.entity.Vaccinationstage;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VaccinationStageRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccinationStageServiceIMPL implements VaccinationStageService {

    private final VaccinationStageRepository vaccinationStageRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VaccineStatusDTO> getAll() {
        List<Vaccinationstage> vaccinationstages = vaccinationStageRepository.findAll();

        if (!vaccinationstages.isEmpty()) {
            List<VaccineStatusDTO> vaccineStatusDTOList = objectMapper.vaccinationStageListToVaccinationDtoList(vaccinationstages);
            return vaccineStatusDTOList;
        }else{
            throw new ResourceNotFountException("Vaccination stages not found!");
        }
    }
}
