package com.content.security.controller;

import com.content.security.dto.*;
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

    @GetMapping(path = "/vehicle")
    public HashMap<String, HashMap<String,String>> vehicle(){
        return RegexProvider.get(new VehicleDTO());
    }

    @GetMapping(path = "/vaccine")
    public HashMap<String, HashMap<String,String>> vaccine(){
        return RegexProvider.get(new VaccineDTO());
    }

    @GetMapping(path = "/vaccineorder")
    public HashMap<String, HashMap<String,String>> vaccineorder(){
        return RegexProvider.get(new VaccineOrderDTO());
    }

    @GetMapping(path = "/clinic")
    public HashMap<String, HashMap<String,String>> clinic(){
        return RegexProvider.get(new ClinicDTO());
    }

    @GetMapping(path = "/mother")
    public HashMap<String, HashMap<String,String>> mother(){
        return RegexProvider.get(new MotherDTO());
    }

}

