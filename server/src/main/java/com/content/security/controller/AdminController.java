package com.content.security.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/v1/admin")
public class AdminController {

    @GetMapping
    public String get(){
        return "GET::adminController";
    }

    @PostMapping
    public String post(){
        return "POST::adminController";
    }

    @PutMapping
    public String put(){
        return "PUT::adminController";
    }

    @DeleteMapping
    public String delete(){
        return "DELETE::adminController";
    }
}
