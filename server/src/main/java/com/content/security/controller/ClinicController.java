package com.content.security.controller;

import com.content.security.dto.ClinicDTO;
import com.content.security.service.ClinicService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/clinics")
public class ClinicController {

    private final ClinicService clinicService;

    @GetMapping
    public List<ClinicDTO> getAll(@RequestParam HashMap<String, String> params){
        return clinicService.getAll(params);
    }

    @GetMapping(path = "/list")
    public List<ClinicDTO> getList(){
        return clinicService.getAllList();
    }

    @PostMapping
    public ClinicDTO create(@RequestBody ClinicDTO clinicDTO){
        return clinicService.create(clinicDTO);
    }

    @PutMapping
    public ClinicDTO update(@RequestBody ClinicDTO clinicDTO){
        return clinicService.update(clinicDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        clinicService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",null), HttpStatus.OK
        );
    }

}
