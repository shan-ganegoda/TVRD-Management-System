package com.content.security.service;

import com.content.security.dto.ProductOrderStatusDTO;
import com.content.security.entity.Productorderstatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ProductOrderStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductOrderStatusServiceIMPL implements ProductOrderStatusService{

    private final ProductOrderStatusRepository productOrderStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ProductOrderStatusDTO> getProductOrderStatuses() {
        List<Productorderstatus> productOrderStatuses = productOrderStatusRepository.findAll();

        if(!productOrderStatuses.isEmpty()){
            List<ProductOrderStatusDTO> productOrderStatusDTOList = objectMapper.productOrderStatusDTOListToDtoList(productOrderStatuses);
            return productOrderStatusDTOList;
        }else{
            throw new ResourceNotFountException("Product Order Status Not Found");
        }
    }
}
