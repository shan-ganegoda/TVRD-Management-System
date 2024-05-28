package com.content.security.service;

import com.content.security.dto.GenderDTO;
import com.content.security.entity.Gender;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.GenderRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class GenderServiceIMPL implements GenderService{

    private final ObjectMapper mapper;
    private final GenderRepository genderRepository;

    @Override
    public List<GenderDTO> getAll() {
        List<Gender> genderList = genderRepository.findAll();

        if (!genderList.isEmpty()) {
            List<GenderDTO> genderDTOList = mapper.genderListToGenderDTOList(genderList);
            return genderDTOList;
        } else {
            throw new ResourceNotFountException("Gender Not Found");
        }
    }
}
