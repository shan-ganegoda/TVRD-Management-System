package com.content.security.service;

import com.content.security.dto.OperationDTO;

import java.util.List;

public interface OperationService {
    List<OperationDTO> getAll();
}
