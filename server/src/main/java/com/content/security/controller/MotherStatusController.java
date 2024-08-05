package com.content.security.controller;


import com.content.security.dto.MotherStatusDTO;

import com.content.security.service.MotherStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/motherstatuses")
public class MotherStatusController {

    private final MotherStatusService motherStatusService;

    @GetMapping
    public List<MotherStatusDTO> getAll(){
        return motherStatusService.getAll();
    }
}
