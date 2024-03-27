package com.content.security.service;

import com.content.security.dto.DesignationDTO;
import com.content.security.entity.Designation;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.DesignationRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DesignationServiceIMPL implements DesignationService{

    private final ObjectMapper objectMapper;
    private final DesignationRepository designationRepository;
    @Override
    public List<DesignationDTO> getAll() {
        List<Designation> designationList = designationRepository.findAll();

        if(!designationList.isEmpty()){
            List<DesignationDTO> designationDTOList = objectMapper.designationListToDesignationDTOList(designationList);
            return designationDTOList;
        }else{
            throw new ResourceNotFountException("Designations Not Found");
        }
    }
}
