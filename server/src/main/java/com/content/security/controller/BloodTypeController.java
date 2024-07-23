package com.content.security.controller;

import com.content.security.dto.BloodTypeDTO;
import com.content.security.service.BloodTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/bloodtypes")
public class BloodTypeController {

    private final BloodTypeService bloodTypeService;

    @GetMapping
    public List<BloodTypeDTO> getAll(){
        return bloodTypeService.getAll();
    }
}
