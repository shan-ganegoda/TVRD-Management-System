package com.content.security.service;

import com.content.security.dto.DistrictDTO;
import com.content.security.entity.Rdh;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.DistrictRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DistrictServiceIMPL implements DistrictService{

    private final DistrictRepository districtRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<DistrictDTO> getAll() {
        List<Rdh> rdhList = districtRepository.findAll();

        if(!rdhList.isEmpty()){
            return objectMapper.districtListToDtoList(rdhList);
        }else{
            throw new ResourceNotFountException("Districts Not Found");
        }
    }
}
