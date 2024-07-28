package com.content.security.service;

import com.content.security.dto.GrnDTO;

import java.util.HashMap;
import java.util.List;

public interface GrnService {
    List<GrnDTO> getAll(HashMap<String, String> params);

    GrnDTO save(GrnDTO grnDTO);

    GrnDTO update(GrnDTO grnDTO);

    void delete(Integer id);
}
