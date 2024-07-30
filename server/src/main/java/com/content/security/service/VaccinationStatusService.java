package com.content.security.service;

import com.content.security.dto.VaccinationStatusDTO;

import java.util.List;

public interface VaccinationStatusService {
    List<VaccinationStatusDTO> getAll();
}
