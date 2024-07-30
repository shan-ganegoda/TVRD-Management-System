package com.content.security.controller;

import com.content.security.dto.DistributionProductStatusDTO;
import com.content.security.service.DistributionProductStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/distributionproductstatuses")
@RequiredArgsConstructor
public class DistributionProductStatusController {

    private final DistributionProductStatusService distributionProductStatusService;

    @GetMapping
    public List<DistributionProductStatusDTO> getAll(){
        return distributionProductStatusService.getAll();
    }
}
