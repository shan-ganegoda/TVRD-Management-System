package com.content.security.service;

import com.content.security.dto.MohStatusDTO;
import com.content.security.entity.Mohstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.MohStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MohStatusServiceIMPL implements MohStatusService{

    private final ObjectMapper objectMapper;
    private final MohStatusRepository mohStatusRepository;

    @Override
    public List<MohStatusDTO> getAll() {
        List<Mohstatus> mohstatusList = mohStatusRepository.findAll();

        if(!mohstatusList.isEmpty()){
            return objectMapper.mohStatusListToMohStatusDtoList(mohstatusList);
        }else{
            throw new ResourceNotFountException("MohStatus Not Found");
        }
    }
}
