package com.content.security.service;

import com.content.security.dto.ProductOrderDTO;
import com.content.security.entity.Productorder;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ProductOrderRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductOrderServiceIMPL implements ProductOrderService{

    private final ProductOrderRepository productOrderRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ProductOrderDTO> getProductOrders() {

        List<Productorder> productOrders = productOrderRepository.findAll();

        if(!productOrders.isEmpty()){
            List<ProductOrderDTO> productOrderDTOList = objectMapper.productOrderToDtoList(productOrders);
            return productOrderDTOList;
        }else{
            throw new ResourceNotFountException("Product Orders Not Found");
        }
        
    }
}
