package com.content.security.controller;

import com.content.security.dto.DistrictDTO;
import com.content.security.service.DistrictService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/rdhs")
public class RdhsController {

    private final DistrictService districtService;

    @GetMapping
    public List<DistrictDTO> getAll(){
        return districtService.getAll();
    }
}
