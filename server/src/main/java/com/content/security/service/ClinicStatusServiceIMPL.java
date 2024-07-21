package com.content.security.service;

import com.content.security.dto.ClinicstatusDTO;
import com.content.security.entity.Clinicstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ClinicStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClinicStatusServiceIMPL implements ClinicStatusService {

    private final ClinicStatusRepository clinicStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ClinicstatusDTO> getAll() {
        List<Clinicstatus> clinicStatusList = clinicStatusRepository.findAll();
        if(!clinicStatusList.isEmpty()){
            List<ClinicstatusDTO> clinicstatusDTOS = objectMapper.clinicStatusListToDtoList(clinicStatusList);
            return clinicstatusDTOS;
        }else{
            throw new ResourceNotFountException("No clinicstatus found");
        }
    }
}
