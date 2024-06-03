package com.content.security.controller;

import com.content.security.repository.ProductOrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/hello")
public class DemoController {

    private final ProductOrderRepository po;

    @GetMapping
    public String sayHello(){

        if(po.existsByCode("OATG20240603")){
            return "Exist";
        }else{
            return "Not Exist";
        }

    }
}
