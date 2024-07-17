package com.content.security.service;

import com.content.security.dto.VaccineStatusDTO;

import java.util.List;

public interface VaccineStatusService {
    List<VaccineStatusDTO> getAll();
}
