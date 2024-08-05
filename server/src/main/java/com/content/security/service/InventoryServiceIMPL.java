package com.content.security.service;

import com.content.security.dto.InventoryDTO;
import com.content.security.entity.Inventory;
import com.content.security.entity.Inventoryproduct;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.InventoryRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class InventoryServiceIMPL implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<InventoryDTO> getAll(HashMap<String, String> params) {
        List<Inventory> inventoryList = inventoryRepository.findAll();
        if(!inventoryList.isEmpty()){
            List<InventoryDTO> inventoryDTOList = objectMapper.inventoryListToDtoList(inventoryList);
            if(params.isEmpty()){
                return inventoryDTOList;
            }else{

                String mohid = params.get("mohid");
                String grnid = params.get("grnid");

                Stream<InventoryDTO> stream = inventoryDTOList.stream();

                if(mohid != null) stream = stream.filter(s -> s.getMoh().getId() == Integer.parseInt(mohid));
                if(grnid != null) stream = stream.filter(s -> s.getGrn().getId() == Integer.parseInt(grnid));

                return stream.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("Inventory Data Not Found");
        }
    }

    @Override
    public InventoryDTO save(InventoryDTO inventoryDTO) {
        if (inventoryDTO != null) {

            if (inventoryRepository.existsByGrn(inventoryDTO.getGrn())) {
                throw new ResourceAlreadyExistException("GRN Already Exist!");
            }

            Inventory inventory = objectMapper.inventoryDtoToInventory(inventoryDTO);

            for (Inventoryproduct i : inventory.getInventoryproducts()) {
                i.setInventory(inventory);
            }

            inventoryRepository.save(inventory);
            return inventoryDTO;
        }else{
            throw new ResourceNotFountException("Inventory Data Not Found");
        }
    }

    @Override
    public InventoryDTO update(InventoryDTO inventoryDTO) {
        Inventory inventoryrec = inventoryRepository.findById(inventoryDTO.getId()).orElseThrow(() -> new ResourceNotFountException("Inventory Not Found"));

        if (!inventoryrec.getGrn().equals(inventoryDTO.getGrn()) && inventoryRepository.existsByGrn(inventoryDTO.getGrn())) {
            throw new ResourceAlreadyExistException("GRN Already Exist!");
        }

        try {
            Inventory inventory = objectMapper.inventoryDtoToInventory(inventoryDTO);
            inventory.getInventoryproducts().forEach(ip -> ip.setInventory(inventory));
            inventoryRepository.save(inventory);

        } catch (Exception e) {
            System.out.println(e);
        }

        return inventoryDTO;
    }

    @Override
    public void delete(Integer id) {
        if (inventoryRepository.existsById(id)) {

            Inventory inventory = inventoryRepository.findById(id).orElseThrow(() -> new ResourceNotFountException("Inventory Not Found"));
            inventoryRepository.delete(inventory);
        } else {
            throw new ResourceNotFountException("Inventory Not Found");
        }
    }
}
