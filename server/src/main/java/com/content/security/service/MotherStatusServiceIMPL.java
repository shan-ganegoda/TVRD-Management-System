package com.content.security.service;

import com.content.security.dto.MotherStatusDTO;
import com.content.security.entity.Motherstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.MotherStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MotherStatusServiceIMPL implements MotherStatusService {

    private final MotherStatusRepository motherStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<MotherStatusDTO> getAll() {
        List<Motherstatus> motherStatusList = motherStatusRepository.findAll();
        if(!motherStatusList.isEmpty()){
            List<MotherStatusDTO> motherStatusDTOList = objectMapper.motherStatusListToDtoList(motherStatusList);
            return motherStatusDTOList;
        }else{
            throw new ResourceNotFountException("Mother Statuses Not Found!");
        }
    }
}
