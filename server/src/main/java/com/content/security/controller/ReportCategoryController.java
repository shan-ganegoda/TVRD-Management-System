package com.content.security.controller;

import com.content.security.dto.BloodTypeDTO;
import com.content.security.dto.ReportCategoryDTO;
import com.content.security.service.BloodTypeService;
import com.content.security.service.ReportCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/reportcategories")
public class ReportCategoryController {

    private final ReportCategoryService reportCategoryService;

    @GetMapping
    public List<ReportCategoryDTO> getAll(){
        return reportCategoryService.getAll();
    }
}
