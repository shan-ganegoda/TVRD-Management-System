package com.content.security.service;

import com.content.security.dto.AuthorityDTO;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.HashMap;
import java.util.List;

public interface AuthorityService {
    List<AuthorityDTO> getAll(@RequestParam HashMap<String,String> params);

    AuthorityDTO saveAuthority(AuthorityDTO authorityDTO);

    AuthorityDTO updateAuthority(AuthorityDTO authorityDTO);

    String deleteAuthority(Integer id);
}
