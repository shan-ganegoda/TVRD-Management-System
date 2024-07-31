package com.content.security.report.service;

import com.content.security.report.dto.CountByProductOrderDTO;
import com.content.security.report.dto.ProductOrdersByProductDTO;

import java.util.HashMap;
import java.util.List;

public interface ProductOrderReportService {
    List<CountByProductOrderDTO> getCountByProductOrderDate(HashMap<String, String> params);

    List<ProductOrdersByProductDTO> getCountByProductOrderDateAndProduct(HashMap<String, String> params);
}
