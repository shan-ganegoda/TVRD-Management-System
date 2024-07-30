package com.content.security.service;

import com.content.security.dto.VaccinationProgressDTO;
import com.content.security.entity.Vaccinationprogress;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VaccinationProgressRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VaccinationProgressServiceIMPL implements VaccinationProgressService{

    private final ObjectMapper objectMapper;
    private final VaccinationProgressRepository vaccinationProgressRepository;

    @Override
    public List<VaccinationProgressDTO> getAll() {
        List<Vaccinationprogress> vaccinationprogressList = vaccinationProgressRepository.findAll();
        if(!vaccinationprogressList.isEmpty()){
            List<VaccinationProgressDTO> vaccinationProgressDTOList = objectMapper.vaccinationProgressListToDtoList(vaccinationprogressList);
            return vaccinationProgressDTOList;
        }else{
            throw new ResourceNotFountException("VaccinationProgress Not Found!");
        }
    }
}
