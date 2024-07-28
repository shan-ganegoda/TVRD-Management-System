package com.content.security.service;

import com.content.security.dto.AuthorityDTO;
import com.content.security.entity.Authority;
import com.content.security.entity.Module;
import com.content.security.entity.Operation;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.AuthorityRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class AuthorityServiceIMPL implements AuthorityService{

    private final ObjectMapper objectMapper;
    private final AuthorityRepository authorityRepository;

    @Override
    public List<AuthorityDTO> getAll(@RequestParam HashMap<String,String> params) {
        List<Authority> authorityList = authorityRepository.findAll();

        if(!authorityList.isEmpty()){
            List<AuthorityDTO> authorityDTOList = objectMapper.authorityListToDtoList(authorityList);
            if(params.isEmpty()){
                return authorityDTOList;
            }else{
                String roleid = params.get("roleid");
                String moduleid = params.get("moduleid");
                String operatorid = params.get("operationid");

                Stream<AuthorityDTO> astreame = authorityDTOList.stream();

                if(roleid != null) astreame = astreame.filter(e ->e.getRole().getId() == Integer.parseInt(roleid));
                if(moduleid != null) astreame = astreame.filter(e ->e.getModule().getId() == Integer.parseInt(moduleid));
                if(operatorid != null) astreame = astreame.filter(e ->e.getOperation().getId() == Integer.parseInt(operatorid));

                return astreame.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("No Authority Found!");
        }
    }

    @Override
    public AuthorityDTO saveAuthority(AuthorityDTO authorityDTO) {

        Module module = objectMapper.moduleDtoToModule(authorityDTO.getModule());
        Operation operation = objectMapper.operationDtoToOperation(authorityDTO.getOperation());

        if(!authorityRepository.existsByRoleAndModuleAndOperation(authorityDTO.getRole(),module,operation)){
            Authority authority = objectMapper.dtoToAuthority(authorityDTO);
            authorityRepository.save(authority);
            return authorityDTO;
        }else{
            throw new ResourceAlreadyExistException("Privilege Already Exists!");
        }


    }

    @Override
    public AuthorityDTO updateAuthority(AuthorityDTO authorityDTO) {
        if(authorityRepository.existsById(authorityDTO.getId())){

            Module module = objectMapper.moduleDtoToModule(authorityDTO.getModule());
            Operation operation = objectMapper.operationDtoToOperation(authorityDTO.getOperation());

            Authority autho = authorityRepository.findById(authorityDTO.getId()).orElseThrow(null);

            if(Objects.equals(autho.getModule().getId(), module.getId()) && Objects.equals(autho.getOperation().getId(), operation.getId()) && Objects.equals(autho.getRole().getId(), authorityDTO.getRole().getId())){
                Authority authority = objectMapper.dtoToAuthority(authorityDTO);
                authorityRepository.save(authority);
                return authorityDTO;
            }else if(!authorityRepository.existsByRoleAndModuleAndOperation(authorityDTO.getRole(),module,operation)){
                Authority authority = objectMapper.dtoToAuthority(authorityDTO);
                authorityRepository.save(authority);
                return authorityDTO;
            }else{
                throw new ResourceAlreadyExistException("Privilege Already Exists!");
            }

        }else{
            throw new ResourceNotFountException("Authority Not Exist!");
        }

    }

    @Override
    public String deleteAuthority(Integer id) {
        if(authorityRepository.existsById(id)){
            authorityRepository.deleteById(id);
            return "Privilege Deleted Successfully";
        }else{
            throw new ResourceNotFountException("Authority Not Found!");
        }
    }
}
