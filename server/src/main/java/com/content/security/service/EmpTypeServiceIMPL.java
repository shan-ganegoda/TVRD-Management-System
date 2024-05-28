package com.content.security.service;

import com.content.security.dto.EmpTypeDTO;
import com.content.security.entity.EmpType;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.EmpTypeRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpTypeServiceIMPL implements EmpTypeService{

    private final ObjectMapper objectMapper;
    private final EmpTypeRepository empTypeRepository;

    @Override
    public List<EmpTypeDTO> getAll() {
        List<EmpType> empTypeList = empTypeRepository.findAll();

        if(!empTypeList.isEmpty()){
            List<EmpTypeDTO> empTypeDTOList = objectMapper.empTypeListToEmpTypeDTOList(empTypeList);
            return empTypeDTOList;
        }else {
            throw new ResourceNotFountException("EmpType Not Found");
        }
    }
}
