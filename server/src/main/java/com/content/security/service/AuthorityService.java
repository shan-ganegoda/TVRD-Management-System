package com.content.security.service;

import com.content.security.dto.AuthorityDTO;

import java.util.List;

public interface AuthorityService {
    List<AuthorityDTO> getAll();

    AuthorityDTO saveAuthority(AuthorityDTO authorityDTO);

    AuthorityDTO updateAuthority(AuthorityDTO authorityDTO);

    void deleteAuthority(Integer id);
}
