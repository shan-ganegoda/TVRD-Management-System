package com.content.security.service;

import com.content.security.dto.HealthStatusDTO;
import com.content.security.entity.Healthstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.HealthStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthStatusServiceIMPL implements HealthStatusService{

    private final ObjectMapper objectMapper;
    private final HealthStatusRepository healthStatusRepository;

    @Override
    public List<HealthStatusDTO> getAll() {
        List<Healthstatus> healthStatusList = healthStatusRepository.findAll();
        if(!healthStatusList.isEmpty()){
            List<HealthStatusDTO> healthStatusDTOList = objectMapper.healthStatusListToDtoList(healthStatusList);
            return healthStatusDTOList;
        }else{
            throw new ResourceNotFountException("Health statuses Not Found!");
        }
    }
}
