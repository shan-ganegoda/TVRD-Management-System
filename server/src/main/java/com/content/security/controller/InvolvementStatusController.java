package com.content.security.controller;

import com.content.security.dto.InvolvementStatusDTO;
import com.content.security.service.InvolvementStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/involvementstatuses")
public class InvolvementStatusController {

    private final InvolvementStatusService involvementStatusService;

    @GetMapping
    public List<InvolvementStatusDTO> getAll(){
        return involvementStatusService.getAll();
    }
}
