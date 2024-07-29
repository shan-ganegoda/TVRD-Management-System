package com.content.security.service;

import com.content.security.dto.DistributionDTO;

import java.util.HashMap;
import java.util.List;

public interface DistributionService {
    List<DistributionDTO> getAll(HashMap<String, String> params);

    DistributionDTO save(DistributionDTO distributionDTO);

    DistributionDTO update(DistributionDTO distributionDTO);

    String delete(Integer id);
}
