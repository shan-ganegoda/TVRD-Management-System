package com.content.security.report.service;

import com.content.security.report.entity.CountByChildRegistration;
import com.content.security.report.repository.CountByChildRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChildReportServiceIMPL implements ChildReportService{

    private final CountByChildRegistrationRepository countByChildRegistrationRepository;

    @Override
    public List<CountByChildRegistration> getCountByChildRegister(HashMap<String, String> params) {

        LocalDate startDate;
        LocalDate endDate;

        String startDateStr = params.getOrDefault("startDate","2015-01-01");
        String endDateStr = params.getOrDefault("endDate","2024-12-31");

        startDate = LocalDate.parse(startDateStr);
        endDate = LocalDate.parse(endDateStr);

        return countByChildRegistrationRepository.findCountByChildRegistrations(startDate,endDate);

    }
}
