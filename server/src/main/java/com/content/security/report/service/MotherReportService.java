package com.content.security.report.service;

import com.content.security.report.entity.CountByMotherRegistration;

import java.util.HashMap;
import java.util.List;

public interface MotherReportService {
    List<CountByMotherRegistration> getCountByMotherRegister(HashMap<String, String> params);
}
