package com.content.security.controller;

import com.content.security.dto.EmployeeDTO;
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

}

