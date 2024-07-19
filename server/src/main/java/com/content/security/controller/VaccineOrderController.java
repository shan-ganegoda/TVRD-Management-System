package com.content.security.controller;

import com.content.security.dto.VaccineOrderDTO;
import com.content.security.service.VaccineOrderService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/vaccineorders")
public class VaccineOrderController {

    private final VaccineOrderService vaccineOrderService;

    @GetMapping
    public List<VaccineOrderDTO> getAll(@RequestParam HashMap<String,String> params){
        return vaccineOrderService.getAll(params);
    }

    @PostMapping
    public VaccineOrderDTO create(@RequestBody VaccineOrderDTO vaccineOrderDTO){
        return vaccineOrderService.create(vaccineOrderDTO);
    }

    @PutMapping
    public VaccineOrderDTO update(@RequestBody VaccineOrderDTO vaccineOrderDTO){
        return vaccineOrderService.update(vaccineOrderDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        vaccineOrderService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",null), HttpStatus.OK
        );
    }
}
