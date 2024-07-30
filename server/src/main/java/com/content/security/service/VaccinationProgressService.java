package com.content.security.service;

import com.content.security.dto.VaccinationProgressDTO;

import java.util.List;

public interface VaccinationProgressService {
    List<VaccinationProgressDTO> getAll();
}
