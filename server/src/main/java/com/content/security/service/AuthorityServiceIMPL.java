package com.content.security.service;

import com.content.security.dto.AuthorityDTO;
import com.content.security.entity.Authority;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.AuthorityRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthorityServiceIMPL implements AuthorityService{

    private final ObjectMapper objectMapper;
    private final AuthorityRepository authorityRepository;

    @Override
    public List<AuthorityDTO> getAll() {
        List<Authority> authorityList = authorityRepository.findAll();

        if(!authorityList.isEmpty()){
            List<AuthorityDTO> authorityDTOList = objectMapper.authorityListToDtoList(authorityList);
            return authorityDTOList;
        }else{
            throw new ResourceNotFountException("No Authority Found!");
        }
    }

    @Override
    public AuthorityDTO saveAuthority(AuthorityDTO authorityDTO) {

        Authority authority = objectMapper.dtoToAuthority(authorityDTO);
        authorityRepository.save(authority);
        return authorityDTO;
    }

    @Override
    public AuthorityDTO updateAuthority(AuthorityDTO authorityDTO) {
        if(authorityRepository.existsById(authorityDTO.getId())){
            Authority authority = objectMapper.dtoToAuthority(authorityDTO);
            authorityRepository.save(authority);
            return authorityDTO;
        }else{
            throw new ResourceNotFountException("Authority Not Exist!");
        }

    }

    @Override
    public void deleteAuthority(Integer id) {
        if(authorityRepository.existsById(id)){
            authorityRepository.deleteById(id);
        }else{
            throw new ResourceNotFountException("Authority Not Found!");
        }
    }
}
