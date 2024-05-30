package com.content.security.service;


import com.content.security.dto.ProductOrderDTO;

import java.util.List;

public interface ProductOrderService {
    List<ProductOrderDTO> getProductOrders();

    ProductOrderDTO saveProductOrder(ProductOrderDTO productOrderDTO);

    ProductOrderDTO updateProductOrder(ProductOrderDTO productOrderDTO);
}
