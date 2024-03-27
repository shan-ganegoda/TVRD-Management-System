package com.content.security.service;

import com.content.security.dto.RoleDTO;
import com.content.security.entity.Role;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.RoleRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoleServiceIMPL implements RoleService{

    private final RoleRepository roleRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<RoleDTO> getAll() {

        List<Role> roleList =  roleRepository.findAll();

        if(!roleList.isEmpty()){
            List<RoleDTO> roleDTOList = objectMapper.roleListToRoleDTOList(roleList);
            return roleDTOList;
        }else{
            throw new ResourceNotFountException("Roles Not Found!");
        }
    }
}
