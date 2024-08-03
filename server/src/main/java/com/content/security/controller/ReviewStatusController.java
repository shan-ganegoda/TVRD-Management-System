package com.content.security.controller;

import com.content.security.dto.ReviewStatusDTO;
import com.content.security.service.ReviewStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/reviewstatuses")
public class ReviewStatusController {

    private final ReviewStatusService reviewStatusService;

    @GetMapping
    public List<ReviewStatusDTO> getAll(){

        return reviewStatusService.getAll();
    }
}
