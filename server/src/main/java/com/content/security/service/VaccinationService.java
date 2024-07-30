package com.content.security.service;

import com.content.security.dto.VaccinationDTO;

import java.util.HashMap;
import java.util.List;

public interface VaccinationService {
    List<VaccinationDTO> getAll(HashMap<String, String> params);

    VaccinationDTO create(VaccinationDTO vaccinationDTO);

    VaccinationDTO update(VaccinationDTO vaccinationDTO);

    String delete(Integer id);
}
