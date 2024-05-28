package com.content.security.controller;

import com.content.security.dto.GenderDTO;
import com.content.security.dto.RoleDTO;
import com.content.security.service.GenderService;
import com.content.security.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/admin/roles")
public class RoleController {

    private final RoleService roleService;

    @GetMapping
    public List<RoleDTO> getAll(){
        return roleService.getAll();
    }
}
