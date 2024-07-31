package com.content.security.service;

import com.content.security.dto.VaccineOfferingDTO;

import java.util.List;

public interface VaccineOfferingService {
    List<VaccineOfferingDTO> getAll();
}
