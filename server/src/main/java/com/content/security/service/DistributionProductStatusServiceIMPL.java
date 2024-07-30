package com.content.security.service;

import com.content.security.dto.DistributionProductStatusDTO;
import com.content.security.entity.Distributionproductstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.DistributionProductStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DistributionProductStatusServiceIMPL implements DistributionProductStatusService {

    private final DistributionProductStatusRepository statusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<DistributionProductStatusDTO> getAll() {
        List<Distributionproductstatus> statusList = statusRepository.findAll();
        if(!statusList.isEmpty()){
            List<DistributionProductStatusDTO> statusDTOList = objectMapper.dpstatusListToDtoList(statusList);
            return statusDTOList;
        }else{
            throw new ResourceNotFountException("DistributionProductStatus Not Found!");
        }
    }
}
