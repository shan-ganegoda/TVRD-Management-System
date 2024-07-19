package com.content.security.service;

import com.content.security.dto.VaccineOrderDTO;

import java.util.HashMap;
import java.util.List;

public interface VaccineOrderService {
    List<VaccineOrderDTO> getAll(HashMap<String, String> params);

    VaccineOrderDTO create(VaccineOrderDTO vaccineOrderDTO);

    VaccineOrderDTO update(VaccineOrderDTO vaccineOrderDTO);

    void delete(Integer id);
}
