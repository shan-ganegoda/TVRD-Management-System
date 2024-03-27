package com.content.security.controller;

import com.content.security.dto.OperationDTO;
import com.content.security.service.OperationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin
@RequestMapping("/api/v1/admin/operations")
public class OperationController {

    private final OperationService operationService;

    @GetMapping
    public List<OperationDTO> getAll(){
        return operationService.getAll();
    }
}
