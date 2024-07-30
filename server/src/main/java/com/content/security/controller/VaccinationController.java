package com.content.security.controller;

import com.content.security.dto.VaccinationDTO;
import com.content.security.service.VaccinationService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/vaccinations")
public class VaccinationController {

    private final VaccinationService vaccinationService;

    @GetMapping
    public List<VaccinationDTO> getAll(@RequestParam HashMap<String, String> params){
        return vaccinationService.getAll(params);
    }

    @PostMapping
    public VaccinationDTO create(@RequestBody VaccinationDTO vaccinationDTO){
        return vaccinationService.create(vaccinationDTO);
    }

    @PutMapping
    public VaccinationDTO update(@RequestBody VaccinationDTO vaccinationDTO){
        return vaccinationService.update(vaccinationDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        String message = vaccinationService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message), HttpStatus.OK
        );
    }
}
