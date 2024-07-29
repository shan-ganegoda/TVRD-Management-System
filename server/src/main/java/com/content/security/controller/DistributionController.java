package com.content.security.controller;

import com.content.security.dto.DistributionDTO;
import com.content.security.service.DistributionService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/distributions")
@RequiredArgsConstructor
public class DistributionController {

    private final DistributionService distributionService;

    @GetMapping
    public List<DistributionDTO> getAll(@RequestParam HashMap<String,String> params){
        return distributionService.getAll(params);
    }

    @PostMapping
    public DistributionDTO create(@RequestBody DistributionDTO distributionDTO){
        return distributionService.save(distributionDTO);
    }

    @PutMapping
    public DistributionDTO update(@RequestBody DistributionDTO distributionDTO){
        return distributionService.update(distributionDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        String message = distributionService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message), HttpStatus.OK
        );
    }
}
