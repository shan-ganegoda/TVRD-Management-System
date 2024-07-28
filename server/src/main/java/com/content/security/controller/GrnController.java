package com.content.security.controller;

import com.content.security.dto.GrnDTO;
import com.content.security.dto.ProductOrderDTO;
import com.content.security.service.GrnService;
import com.content.security.service.ProductOrderService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/grns")
public class GrnController {

    private final GrnService grnService;

    @GetMapping
    public List<GrnDTO> getAll(@RequestParam HashMap<String,String> params){
        return grnService.getAll(params);
    }

    @PostMapping
    public GrnDTO save(@RequestBody GrnDTO grnDTO){
        return grnService.save(grnDTO);
    }

    @PutMapping
    public GrnDTO update(@RequestBody GrnDTO grnDTO){
        return grnService.update(grnDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        grnService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",null), HttpStatus.OK
        );
    }


}
