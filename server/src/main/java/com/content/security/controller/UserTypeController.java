package com.content.security.controller;


import com.content.security.dto.UserTypeDTO;
import com.content.security.service.UserTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/usertypes")
public class UserTypeController {

    private final UserTypeService userTypeService;

    @GetMapping
    public List<UserTypeDTO> getAll(){
        return userTypeService.getAll();
    }
}
