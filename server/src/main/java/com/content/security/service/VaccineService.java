package com.content.security.service;

import com.content.security.dto.VaccineDTO;

import java.util.HashMap;
import java.util.List;

public interface VaccineService {
    List<VaccineDTO> getAll(HashMap<String, String> params);


    VaccineDTO saveVaccine(VaccineDTO vaccineDTO);

    VaccineDTO updateVaccine(VaccineDTO vaccineDTO);

    void deleteVaccine(Integer id);
}
