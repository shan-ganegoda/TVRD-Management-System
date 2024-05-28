package com.content.security.controller;

import com.content.security.dto.ModuleDTO;
import com.content.security.service.ModuleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/admin/modules")
public class ModuleController {

    private final ModuleService moduleService;

    @GetMapping
    public List<ModuleDTO> getAll(){
        return moduleService.getAll();
    }
}
