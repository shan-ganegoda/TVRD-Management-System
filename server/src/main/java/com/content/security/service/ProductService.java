package com.content.security.service;

import com.content.security.dto.ProductDTO;

import java.util.List;

public interface ProductService {
    List<ProductDTO> getProducts();

    ProductDTO getProductById(int id);
}
