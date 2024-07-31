package com.content.security.report.service;

import com.content.security.report.entity.CountByMotherRegistration;
import com.content.security.report.repository.CountByMotherRegistrationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MotherReportServiceIMPL implements MotherReportService{

    private final CountByMotherRegistrationRepository countByMotherRegistrationRepository;

    @Override
    public List<CountByMotherRegistration> getCountByMotherRegister(HashMap<String, String> params) {

        LocalDate startDate;
        LocalDate endDate;

        String startDateStr = params.getOrDefault("startDate","2015-01-01");
        String endDateStr = params.getOrDefault("endDate","2024-12-31");

        startDate = LocalDate.parse(startDateStr);
        endDate = LocalDate.parse(endDateStr);

        return countByMotherRegistrationRepository.findCountByMotherRegistrations(startDate,endDate);

    }
}
