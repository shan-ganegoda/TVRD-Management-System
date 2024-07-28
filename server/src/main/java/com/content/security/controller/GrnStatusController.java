package com.content.security.controller;

import com.content.security.dto.GrnStatusDTO;
import com.content.security.service.GrnStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/grnstatuses")
@RequiredArgsConstructor
public class GrnStatusController {

    private final GrnStatusService grnStatusService;

    @GetMapping
    public List<GrnStatusDTO> getAll(){
        return grnStatusService.getAll();
    }

}
