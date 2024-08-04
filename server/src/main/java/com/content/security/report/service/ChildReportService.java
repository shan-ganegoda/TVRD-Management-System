package com.content.security.report.service;

import com.content.security.report.entity.CountByChildRegistration;

import java.util.HashMap;
import java.util.List;

public interface ChildReportService {
    List<CountByChildRegistration> getCountByChildRegister(HashMap<String, String> params);
}
