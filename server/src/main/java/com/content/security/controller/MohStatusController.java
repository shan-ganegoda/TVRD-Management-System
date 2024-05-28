package com.content.security.controller;

import com.content.security.dto.DistrictDTO;
import com.content.security.dto.MohStatusDTO;
import com.content.security.service.DistrictService;
import com.content.security.service.MohStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/mohstatuses")
public class MohStatusController {

    private final MohStatusService mohStatusService;

    @GetMapping
    public List<MohStatusDTO> getAll(){
        return mohStatusService.getAll();
    }
}
