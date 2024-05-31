package com.content.security.controller;

import com.content.security.dto.ProductOrderDTO;
import com.content.security.service.ProductOrderService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        productOrderService.deleteProductOrder(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",null), HttpStatus.OK
        );
    }


}
