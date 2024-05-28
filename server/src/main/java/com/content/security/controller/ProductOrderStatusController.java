package com.content.security.controller;


import com.content.security.dto.ProductOrderStatusDTO;
import com.content.security.service.ProductOrderStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/productorderstatuses")
public class ProductOrderStatusController {

    private final ProductOrderStatusService productOrderStatusService;

    @GetMapping
    public List<ProductOrderStatusDTO> getProductOrders(){
        return productOrderStatusService.getProductOrderStatuses();
    }


}
