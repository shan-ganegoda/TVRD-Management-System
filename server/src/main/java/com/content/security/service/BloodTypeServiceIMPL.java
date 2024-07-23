package com.content.security.service;

import com.content.security.dto.BloodTypeDTO;
import com.content.security.entity.Bloodtype;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.BloodTypeRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BloodTypeServiceIMPL implements BloodTypeService {

    private final BloodTypeRepository bloodTypeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<BloodTypeDTO> getAll() {
        List<Bloodtype> bloodTypeList = bloodTypeRepository.findAll();
        if(!bloodTypeList.isEmpty()){
            List<BloodTypeDTO> bloodTypeDTOList = objectMapper.bloodTypeListToDtoList(bloodTypeList);
            return bloodTypeDTOList;
        }else{
            throw new ResourceNotFountException("Blood Types Not Found!");
        }
    }
}
