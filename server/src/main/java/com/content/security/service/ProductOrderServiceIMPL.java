package com.content.security.service;

import com.content.security.dto.ProductOrderDTO;
import com.content.security.entity.Productorder;
import com.content.security.entity.Productorderproduct;
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

    @Override
    public ProductOrderDTO saveProductOrder(ProductOrderDTO productOrderDTO) {
        if(productOrderDTO != null){
            Productorder porder = objectMapper.productOrderDtoToProductOrder(productOrderDTO);

            for(Productorderproduct i : porder.getProductorderproducts()){
                i.setProductorder(porder);
            }

            productOrderRepository.save(porder);
            return productOrderDTO;
        }else{
            throw new ResourceNotFountException("Product Order Not Found");
        }
    }

    @Override
    public ProductOrderDTO updateProductOrder(ProductOrderDTO productOrderDTO) {

        if(productOrderRepository.existsById(productOrderDTO.getId())){
            try{
                Productorder porder = objectMapper.productOrderDtoToProductOrder(productOrderDTO);
                porder.getProductorderproducts().forEach(poproducts -> poproducts.setProductorder(porder));
                productOrderRepository.save(porder);

            }catch(Exception e){
                System.out.println(e);
            }

            return productOrderDTO;
        }else{
            throw new ResourceNotFountException("Product Order Not Found");
        }
    }

    @Override
    public void deleteProductOrder(Integer id) {

        if(productOrderRepository.existsById(id)){

            Productorder porder = productOrderRepository.findById(id).orElseThrow(null);

            if(porder != null){
                productOrderRepository.delete(porder);
            }

        }else{
            throw new ResourceNotFountException("Product Order Not Found");
        }
    }
}
