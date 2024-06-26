package com.content.security.controller;

import com.content.security.dto.EmployeeDTO;
import com.content.security.dto.MohDTO;
import com.content.security.dto.ProductOrderDTO;
import com.content.security.dto.UserDTO;
import com.content.security.util.regex.RegexProvider;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;

@CrossOrigin
@RestController
@RequestMapping(value = "/regexes")
public class RegexController {

    @GetMapping(path = "/employee")
    public HashMap<String, HashMap<String,String>> employee(){
        return RegexProvider.get(new EmployeeDTO());
    }

    @GetMapping(path = "/user")
    public HashMap<String, HashMap<String,String>> user(){
        return RegexProvider.get(new UserDTO());
    }

    @GetMapping(path = "/moh")
    public HashMap<String, HashMap<String,String>> moh(){
        return RegexProvider.get(new MohDTO());
    }

    @GetMapping(path = "/productorder")
    public HashMap<String, HashMap<String,String>> productorder(){
        return RegexProvider.get(new ProductOrderDTO());
    }

}

