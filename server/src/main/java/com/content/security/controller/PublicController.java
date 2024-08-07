package com.content.security.controller;

import com.content.security.dto.ClinicDTO;
import com.content.security.dto.MotherDTO;
import com.content.security.service.ClinicService;
import com.content.security.service.MotherService;
import com.content.security.util.regex.RegexProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/public/mothers")
public class PublicController {

    private final ClinicService clinicService;
    private final MotherService motherService;

    @GetMapping
    public List<MotherDTO> getAllMothers(@RequestParam HashMap<String,String> params){
        return motherService.getAll(params);
    }

    @GetMapping("/clinic")
    public List<ClinicDTO> getAllClinics(){
        return clinicService.getAllList();
    }

    @PostMapping
    public MotherDTO save(@RequestBody MotherDTO motherDTO){
        return motherService.create(motherDTO);
    }

    @GetMapping(path = "/regex")
    public HashMap<String, HashMap<String,String>> mother(){
        return RegexProvider.get(new MotherDTO());
    }
}
