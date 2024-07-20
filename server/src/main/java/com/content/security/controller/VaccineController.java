package com.content.security.controller;

import com.content.security.dto.VaccineDTO;
import com.content.security.service.VaccineService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/vaccines")
@RequiredArgsConstructor
public class VaccineController {

    private final VaccineService vaccineService;

    @GetMapping
    public List<VaccineDTO> getAll(@RequestParam HashMap<String,String> params){
        return vaccineService.getAll(params);
    }

    @GetMapping(path = "/list")
    public List<VaccineDTO> getAllList(){
        return vaccineService.getAllList();
    }

    @PostMapping
    public VaccineDTO save(@RequestBody VaccineDTO vaccineDTO){
        return vaccineService.saveVaccine(vaccineDTO);
    }

    @PutMapping
    public VaccineDTO update(@RequestBody VaccineDTO vaccineDTO){
        return vaccineService.updateVaccine(vaccineDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        vaccineService.deleteVaccine(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",null), HttpStatus.OK
        );
    }
}
