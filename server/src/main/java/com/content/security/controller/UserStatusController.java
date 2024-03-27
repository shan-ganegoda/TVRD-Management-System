package com.content.security.controller;

import com.content.security.dto.GenderDTO;
import com.content.security.dto.UserStatusDTO;
import com.content.security.service.GenderService;
import com.content.security.service.UserStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/userstatuses")
public class UserStatusController {

    private final UserStatusService userStatusService;

    @GetMapping
    public List<UserStatusDTO> getAll(){
        return userStatusService.getAll();
    }
}
