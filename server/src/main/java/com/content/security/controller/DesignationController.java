package com.content.security.controller;

import com.content.security.dto.DesignationDTO;
import com.content.security.service.DesignationService;
import com.content.security.service.GenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/admin/designations")
public class DesignationController {

    private final DesignationService designationService;

    @GetMapping
    public List<DesignationDTO> getAll(){
        return designationService.getAll();
    }
}
