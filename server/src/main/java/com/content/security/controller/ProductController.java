package com.content.security.controller;

import com.content.security.dto.ProductDTO;
import com.content.security.dto.ProductOrderDTO;
import com.content.security.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/products")
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<ProductDTO> getProductOrders(){
        return productService.getProducts();
    }

    @GetMapping("/{id}")
    public ProductDTO getProductById(@PathVariable int id){
        return productService.getProductById(id);
    }


}
