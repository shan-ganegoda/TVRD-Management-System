package com.content.security.service;

import com.content.security.dto.InventoryStatusDTO;

import java.util.List;

public interface InventoryStatusService {
    List<InventoryStatusDTO> getAll();
}
