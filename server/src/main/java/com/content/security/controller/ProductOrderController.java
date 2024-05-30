package com.content.security.controller;

import com.content.security.dto.ProductOrderDTO;
import com.content.security.service.ProductOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping
    public ProductOrderDTO save(@RequestBody ProductOrderDTO productOrderDTO){
        return productOrderService.saveProductOrder(productOrderDTO);
    }

    @PutMapping
    public ProductOrderDTO update(@RequestBody ProductOrderDTO productOrderDTO){
        return productOrderService.updateProductOrder(productOrderDTO);
    }


}
