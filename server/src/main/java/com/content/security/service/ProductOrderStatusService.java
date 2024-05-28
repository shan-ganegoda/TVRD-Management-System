package com.content.security.service;

import com.content.security.dto.ProductOrderStatusDTO;

import java.util.List;

public interface ProductOrderStatusService {
    List<ProductOrderStatusDTO> getProductOrderStatuses();
}
