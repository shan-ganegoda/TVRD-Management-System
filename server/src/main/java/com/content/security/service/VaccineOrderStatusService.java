package com.content.security.service;

import com.content.security.dto.VaccineOrderStatusDTO;

import java.util.List;

public interface VaccineOrderStatusService {
    List<VaccineOrderStatusDTO> getAll();
}
