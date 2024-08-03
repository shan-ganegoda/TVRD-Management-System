package com.content.security.service;

import com.content.security.dto.ReviewStatusDTO;
import com.content.security.entity.Reviewstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ReviewStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewStatusServiceIMPL implements ReviewStatusService{

    private final ReviewStatusRepository reviewStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ReviewStatusDTO> getAll() {
        List<Reviewstatus> reviewstatusList = reviewStatusRepository.findAll();
        if(!reviewstatusList.isEmpty()){
            return objectMapper.reviewStatusListToDtoList(reviewstatusList);
        }else{
            throw new ResourceNotFountException("Review Statuses Not Found!");
        }
    }
}
