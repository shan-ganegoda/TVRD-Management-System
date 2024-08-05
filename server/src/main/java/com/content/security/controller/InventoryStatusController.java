package com.content.security.controller;


import com.content.security.dto.InventoryStatusDTO;
import com.content.security.service.InventoryStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/inventorystatuses")
public class InventoryStatusController {

    private final InventoryStatusService inventoryStatusService;

    @GetMapping
    public List<InventoryStatusDTO> getAll(){
        return inventoryStatusService.getAll();
    }
}
