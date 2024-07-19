package com.content.security.controller;

import com.content.security.dto.VaccineOrderStatusDTO;
import com.content.security.service.VaccineOrderStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/vaccineorderstatuses")
public class VaccineOrderStatusController {

    private final VaccineOrderStatusService vaccineOrderStatusService;

    @GetMapping
    public List<VaccineOrderStatusDTO> getAll(){
        return vaccineOrderStatusService.getAll();
    }
}
