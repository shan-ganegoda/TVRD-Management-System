package com.content.security.service;

import com.content.security.dto.MotherDTO;

import java.util.HashMap;
import java.util.List;

public interface MotherService {
    List<MotherDTO> getAll(HashMap<String, String> params);

    MotherDTO create(MotherDTO motherDTO);

    MotherDTO update(MotherDTO motherDTO);

    String delete(int id);
}
