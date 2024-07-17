package com.content.security.controller;

import com.content.security.dto.DoseDTO;
import com.content.security.service.DoseService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/doses")
@RequiredArgsConstructor
public class DoseController {

    private final DoseService doseService;

    @GetMapping
    public List<DoseDTO> getAll(){
        return doseService.getAll();
    }
}
