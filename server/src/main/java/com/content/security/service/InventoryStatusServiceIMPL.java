package com.content.security.service;

import com.content.security.dto.InventoryStatusDTO;
import com.content.security.entity.Inventorystatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.InventoryStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryStatusServiceIMPL implements InventoryStatusService{

    private final ObjectMapper objectMapper;
    private final InventoryStatusRepository inventoryStatusRepository;

    @Override
    public List<InventoryStatusDTO> getAll() {
        List<Inventorystatus> inventorystatusList = inventoryStatusRepository.findAll();
        if(!inventorystatusList.isEmpty()){
            List<InventoryStatusDTO> inventoryStatusDTOList = objectMapper.inventoryStatusListToDtoList(inventorystatusList);
            return inventoryStatusDTOList;
        }else{
            throw new ResourceNotFountException("Inventory Status Not Found");
        }
    }
}
