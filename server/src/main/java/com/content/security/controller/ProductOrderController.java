package com.content.security.controller;

import com.content.security.dto.ProductOrderDTO;
import com.content.security.service.ProductOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/productorders")
public class ProductOrderController {

    private final ProductOrderService productOrderService;

    @GetMapping
    public List<ProductOrderDTO> getProductOrders(){
        return productOrderService.getProductOrders();
    }


}
