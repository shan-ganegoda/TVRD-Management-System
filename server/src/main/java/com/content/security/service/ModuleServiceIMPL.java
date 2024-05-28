package com.content.security.service;

import com.content.security.dto.ModuleDTO;
import com.content.security.entity.Module;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ModuleRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ModuleServiceIMPL implements ModuleService{

    private final ObjectMapper objectMapper;
    private final ModuleRepository moduleRepository;

    @Override
    public List<ModuleDTO> getAll() {
        List<Module> moduleList = moduleRepository.findAll();

        if(!moduleList.isEmpty()){
            List<ModuleDTO> moduleDTOList = objectMapper.moduleListToModuleDTOList(moduleList);
            return moduleDTOList;
        }else {
            throw new ResourceNotFountException("Modules Not Found!");
        }
    }
}
