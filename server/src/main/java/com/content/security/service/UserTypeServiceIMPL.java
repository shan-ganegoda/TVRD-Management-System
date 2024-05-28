package com.content.security.service;

import com.content.security.dto.UserStatusDTO;
import com.content.security.dto.UserTypeDTO;
import com.content.security.entity.UserStatus;
import com.content.security.entity.UserType;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.UserStatusRepository;
import com.content.security.repository.UserTypeRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserTypeServiceIMPL implements UserTypeService{

    private final UserTypeRepository userTypeRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<UserTypeDTO> getAll() {
        List<UserType> userTypeList = userTypeRepository.findAll();

        if(!userTypeList.isEmpty()){
            List<UserTypeDTO> userTypeDTOList = objectMapper.userTypeListToUserTypeDTOList(userTypeList);
            return userTypeDTOList;
        }else{
            throw new ResourceNotFountException("No User Statuses Found");
        }
    }
}
