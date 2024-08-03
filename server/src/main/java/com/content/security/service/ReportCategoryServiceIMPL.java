package com.content.security.service;

import com.content.security.dto.ReportCategoryDTO;
import com.content.security.entity.Reportcategory;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ReportCategoryRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportCategoryServiceIMPL implements ReportCategoryService{

    private final ReportCategoryRepository reportCategoryRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ReportCategoryDTO> getAll() {
        List<Reportcategory> reportCategories = reportCategoryRepository.findAll();
        if(!reportCategories.isEmpty()){
            return objectMapper.reportCategoryListToDtoList(reportCategories);
        }else{
            throw new ResourceNotFountException("Report Categories Not Found!");
        }
    }
}
