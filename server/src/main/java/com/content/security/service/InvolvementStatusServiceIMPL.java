package com.content.security.service;

import com.content.security.dto.InvolvementStatusDTO;
import com.content.security.entity.Involvementstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.InvolvementStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InvolvementStatusServiceIMPL implements InvolvementStatusService {

    private final InvolvementStatusRepository repository;
    private final ObjectMapper objectMapper;

    @Override
    public List<InvolvementStatusDTO> getAll() {
        List<Involvementstatus> all = repository.findAll();
        if(!all.isEmpty()){
            List<InvolvementStatusDTO> dtos = objectMapper.involvementStatusListToDtoList(all);
            return dtos;
        }else{
            throw new ResourceNotFountException("InvolvementStatus list is empty");
        }
    }
}
