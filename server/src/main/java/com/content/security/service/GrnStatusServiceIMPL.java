package com.content.security.service;

import com.content.security.dto.GrnStatusDTO;
import com.content.security.entity.Grnstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.GrnStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GrnStatusServiceIMPL implements GrnStatusService {

    private final ObjectMapper objectMapper;
    private final GrnStatusRepository grnStatusRepository;

    @Override
    public List<GrnStatusDTO> getAll() {
        List<Grnstatus> grnStatusList = grnStatusRepository.findAll();
        if(!grnStatusList.isEmpty()){
            return objectMapper.GrnStatusListToDtoList(grnStatusList);
        }else{
            throw new ResourceNotFountException("GRN Status Not Found");
        }
    }
}
