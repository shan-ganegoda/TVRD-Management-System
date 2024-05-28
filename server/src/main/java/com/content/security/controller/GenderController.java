package com.content.security.controller;

import com.content.security.dto.GenderDTO;
import com.content.security.service.GenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/genders")
public class GenderController {

    private final GenderService genderService;

    @GetMapping
    public List<GenderDTO> getAll(){
        return genderService.getAll();
    }
}
