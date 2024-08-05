package com.content.security.service;

import com.content.security.dto.InventoryDTO;

import java.util.HashMap;
import java.util.List;

public interface InventoryService {
    List<InventoryDTO> getAll(HashMap<String, String> params);

    InventoryDTO save(InventoryDTO inventoryDTO);

    InventoryDTO update(InventoryDTO inventoryDTO);

    void delete(Integer id);
}
