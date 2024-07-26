package com.content.security.service;

import com.content.security.dto.HealthStatusDTO;

import java.util.List;

public interface HealthStatusService {
    List<HealthStatusDTO> getAll();
}
