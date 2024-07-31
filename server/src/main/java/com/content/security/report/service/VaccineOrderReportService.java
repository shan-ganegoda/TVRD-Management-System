package com.content.security.report.service;

import com.content.security.report.dto.CountByVaccineOrderDTO;

import java.util.HashMap;
import java.util.List;

public interface VaccineOrderReportService {
    List<CountByVaccineOrderDTO> getCountByVaccineOrderDate(HashMap<String, String> params);
}
