package com.content.security.controller;


import com.content.security.dto.InventoryDTO;
import com.content.security.service.InventoryService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/inventories")
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    public List<InventoryDTO> getAll(@RequestParam HashMap<String,String> params){
        return inventoryService.getAll(params);
    }

    @PostMapping
    public InventoryDTO save(@RequestBody InventoryDTO inventoryDTO){
        return inventoryService.save(inventoryDTO);
    }

    @PutMapping
    public InventoryDTO update(@RequestBody InventoryDTO inventoryDTO){
        return inventoryService.update(inventoryDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        inventoryService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",null), HttpStatus.OK
        );
    }


}
