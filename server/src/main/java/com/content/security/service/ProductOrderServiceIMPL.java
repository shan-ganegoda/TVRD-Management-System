package com.content.security.service;

import com.content.security.dto.EmployeeDTO;
import com.content.security.dto.ProductOrderDTO;
import com.content.security.entity.Productorder;
import com.content.security.entity.Productorderproduct;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ProductOrderRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ProductOrderServiceIMPL implements ProductOrderService{

    private final ProductOrderRepository productOrderRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ProductOrderDTO> getProductOrders(HashMap<String,String> params) {

        List<Productorder> productOrders = productOrderRepository.findAll();

        if(!productOrders.isEmpty()){
            List<ProductOrderDTO> productOrderDTOList = objectMapper.productOrderToDtoList(productOrders);
            if(params.isEmpty()){
                return productOrderDTOList;
            }else{
                String dorequired = params.get("dorequired");
                String dorequested = params.get("dorequested");
                String mohid = params.get("mohid");
                String postatusid = params.get("postatusid");

                Stream<ProductOrderDTO> postream = productOrderDTOList.stream();

                if(mohid!=null) postream = postream.filter(e-> e.getMoh().getId()==Integer.parseInt(mohid));
                if(postatusid!=null) postream = postream.filter(e-> e.getProductorderstatus().getId()==Integer.parseInt(postatusid));
                if(dorequired!=null) postream = postream.filter(e-> e.getDorequired().equals(LocalDate.parse(dorequired)));
                if(dorequested!=null) postream = postream.filter(e-> e.getDorequested().equals(LocalDate.parse(dorequested)));


                return postream.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("Product Orders Not Found");
        }
        
    }

    @Override
    public ProductOrderDTO saveProductOrder(ProductOrderDTO productOrderDTO) {
        if(productOrderDTO != null){
            Productorder porder = objectMapper.productOrderDtoToProductOrder(productOrderDTO);

            if(!productOrderRepository.existsByCode(porder.getCode())){
                for(Productorderproduct i : porder.getProductorderproducts()){
                    i.setProductorder(porder);
                }

                productOrderRepository.save(porder);
                return productOrderDTO;
            }else{
                throw new ResourceAlreadyExistException("Product Order Already Exist!");
            }
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
