package com.content.security.service;


import com.content.security.dto.ProductOrderDTO;
import com.content.security.dto.ProductOrderStatusUpdateDTO;

import java.util.HashMap;
import java.util.List;

public interface ProductOrderService {
    List<ProductOrderDTO> getProductOrders(HashMap<String,String> params);

    ProductOrderDTO saveProductOrder(ProductOrderDTO productOrderDTO);

    ProductOrderDTO updateProductOrder(ProductOrderDTO productOrderDTO);

    void deleteProductOrder(Integer id);

    ProductOrderDTO updateStatus(ProductOrderStatusUpdateDTO productOrderStatusUpdateDTO);
}
