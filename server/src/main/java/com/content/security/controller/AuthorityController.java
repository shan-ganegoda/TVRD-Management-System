package com.content.security.controller;

import com.content.security.dto.AuthorityDTO;
import com.content.security.dto.RoleDTO;
import com.content.security.service.AuthorityService;
import com.content.security.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/admin/authorities")
public class AuthorityController {

    private final AuthorityService authorityService;

    @GetMapping
    public List<AuthorityDTO> getAll(){
        return authorityService.getAll();
    }

    @PostMapping
    public AuthorityDTO saveAuthority(@RequestBody AuthorityDTO authorityDTO){
        return authorityService.saveAuthority(authorityDTO);
    }

    @PutMapping
    public AuthorityDTO updateAuthority(@RequestBody AuthorityDTO authorityDTO){
        return authorityService.updateAuthority(authorityDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteAuthority(@PathVariable Integer id){
        authorityService.deleteAuthority(id);
    }


}
