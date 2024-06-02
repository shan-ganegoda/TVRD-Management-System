package com.content.security.service;


import com.content.security.dto.ProductOrderDTO;

import java.util.HashMap;
import java.util.List;

public interface ProductOrderService {
    List<ProductOrderDTO> getProductOrders(HashMap<String,String> params);

    ProductOrderDTO saveProductOrder(ProductOrderDTO productOrderDTO);

    ProductOrderDTO updateProductOrder(ProductOrderDTO productOrderDTO);

    void deleteProductOrder(Integer id);
}
