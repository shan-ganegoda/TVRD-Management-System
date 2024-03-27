package com.content.security.service;

import com.content.security.dto.OperationDTO;
import com.content.security.entity.Operation;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.OperationRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OperationServiceIMPL implements OperationService{

    private final ObjectMapper objectMapper;
    private final OperationRepository operationRepository;

    @Override
    public List<OperationDTO> getAll() {
        List<Operation> operationList = operationRepository.findAll();

        if(!operationList.isEmpty()){
            List<OperationDTO> operationDTOList = objectMapper.operationListToOperationDTOList(operationList);
            return operationDTOList;
        }else{
            throw new ResourceNotFountException("Operations Not Found!");
        }
    }
}
