package com.content.security.service;

import com.content.security.dto.ClinicDTO;

import java.util.HashMap;
import java.util.List;

public interface ClinicService {

    List<ClinicDTO> getAll(HashMap<String, String> params);

    List<ClinicDTO> getAllList();

    ClinicDTO create(ClinicDTO clinicDTO);

    ClinicDTO update(ClinicDTO clinicDTO);

    void delete(Integer id);
}
