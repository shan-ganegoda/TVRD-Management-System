package com.content.security.controller;

import com.content.security.dto.MotherDTO;
import com.content.security.service.MotherService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/mothers")
@RequiredArgsConstructor
public class MotherController {

    private final MotherService motherService;

    @GetMapping
    public List<MotherDTO> getAll(@RequestParam HashMap<String,String> params){
        return motherService.getAll(params);
    }

    @PostMapping
    public MotherDTO create(@RequestBody MotherDTO motherDTO){
        return motherService.create(motherDTO);
    }

    @PutMapping
    public MotherDTO update(@RequestBody MotherDTO motherDTO){
        return motherService.update(motherDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable int id){
        String message = motherService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message), HttpStatus.OK
        );
    }
}
