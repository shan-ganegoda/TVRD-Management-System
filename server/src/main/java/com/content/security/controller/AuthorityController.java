package com.content.security.controller;

import com.content.security.dto.AuthorityDTO;
import com.content.security.dto.RoleDTO;
import com.content.security.service.AuthorityService;
import com.content.security.service.RoleService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/authorities")
public class AuthorityController {

    private final AuthorityService authorityService;

    @GetMapping
    public List<AuthorityDTO> getAll(@RequestParam HashMap<String,String> params){
        return authorityService.getAll(params);
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
    public ResponseEntity<StandardResponse> deleteAuthority(@PathVariable Integer id){
        String message = authorityService.deleteAuthority(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message), HttpStatus.OK
        );
    }


}
