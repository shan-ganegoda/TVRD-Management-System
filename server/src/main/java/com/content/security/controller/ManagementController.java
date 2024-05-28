package com.content.security.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/management")
public class ManagementController {

    @GetMapping
    public String get(){
        return "GET::managementController";
    }

    @PostMapping
    public String post(){
        return "POST::managementController";
    }

    @PutMapping
    public String put(){
        return "PUT::managementController";
    }

    @DeleteMapping
    public String delete(){
        return "DELETE::managementController";
    }
}
