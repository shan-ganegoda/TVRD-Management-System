package com.content.security.service;

import com.content.security.dto.UserStatusDTO;
import com.content.security.entity.UserStatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.UserStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserStatusServiceIMPL implements UserStatusService{

    private final UserStatusRepository userStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<UserStatusDTO> getAll() {
        List<UserStatus> userStatusList = userStatusRepository.findAll();

        if(!userStatusList.isEmpty()){
            List<UserStatusDTO> userStatusDTOList = objectMapper.userStatusListToUserStatusDTOList(userStatusList);
            return userStatusDTOList;
        }else{
            throw new ResourceNotFountException("No User Statuses Found");
        }
    }
}
