package com.content.security.service;

import com.content.security.dto.ProductDTO;
import com.content.security.entity.Product;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ProductRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceIMPL implements ProductService{

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ProductDTO> getProducts() {

        List<Product> products = productRepository.findAll();

        if(!products.isEmpty()){
            List<ProductDTO> productDTOs = objectMapper.ProductListToDtoList(products);
            return productDTOs;
        }else{
            throw new ResourceNotFountException("Products not found");
        }
    }

    @Override
    public ProductDTO getProductById(int id) {

        Product product = productRepository.findById(id).orElse(null);

        if(product != null){
            return objectMapper.ProductToDto(product);
        }else{
            throw new ResourceNotFountException("Product not found");
        }
    }
}
