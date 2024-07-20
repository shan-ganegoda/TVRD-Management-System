package com.content.security.service;

import com.content.security.dto.EmployeeDTO;
import com.content.security.dto.ProductOrderDTO;
import com.content.security.dto.VaccineOrderDTO;
import com.content.security.entity.Productorder;
import com.content.security.entity.Productorderproduct;
import com.content.security.entity.Vaccineorder;
import com.content.security.entity.Vaccineordervaccine;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VaccineOrderRepository;
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
public class VaccineOrderServiceIMPL implements VaccineOrderService{

    private final VaccineOrderRepository vaccineOrderRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VaccineOrderDTO> getAll(HashMap<String, String> params) {

        List<Vaccineorder> vaccineorders = vaccineOrderRepository.findAll();

        if(!vaccineorders.isEmpty()){
            List<VaccineOrderDTO> vaccineOrderDTOS = objectMapper.vaccineOrderListToDtoList(vaccineorders);
            if(params.isEmpty()){
                return vaccineOrderDTOS;
            }else{
                String dorequired = params.get("dorequired");
                String dorequested = params.get("dorequested");
                String mohid = params.get("mohid");
                String vostatusid = params.get("vostatusid");
                String code = params.get("code");

                Stream<VaccineOrderDTO> vostream = vaccineOrderDTOS.stream();

                if(mohid!=null) vostream = vostream.filter(e-> e.getMoh().getId()==Integer.parseInt(mohid));
                if(code!=null) vostream = vostream.filter(e-> e.getCode().equals(code));
                if(vostatusid!=null) vostream = vostream.filter(e-> e.getVaccineorderstatus().getId()==Integer.parseInt(vostatusid));
                if(dorequired!=null) vostream = vostream.filter(e-> e.getDorequired().equals(LocalDate.parse(dorequired)));
                if(dorequested!=null) vostream = vostream.filter(e-> e.getDorequested().equals(LocalDate.parse(dorequested)));


                return vostream.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("No VaccineOrder found");
        }
    }

    @Override
    public VaccineOrderDTO create(VaccineOrderDTO vaccineOrderDTO) {
        if(vaccineOrderDTO != null){
            Vaccineorder vorder = objectMapper.vaccineOrderDtoToVaccineOrder(vaccineOrderDTO);

            if(!vaccineOrderRepository.existsByCode(vorder.getCode())){
                for(Vaccineordervaccine i : vorder.getVaccineordervaccines()){
                    i.setVaccineorder(vorder);
                }

                vaccineOrderRepository.save(vorder);
                return vaccineOrderDTO;
            }else{
                throw new ResourceAlreadyExistException("Vaccine Order Already Exist!");
            }
        }else{
            throw new ResourceNotFountException("Vaccine Order Not Found");
        }
    }

    @Override
    public VaccineOrderDTO update(VaccineOrderDTO vaccineOrderDTO) {
        if(vaccineOrderRepository.existsById(vaccineOrderDTO.getId())){
            try{
                Vaccineorder vorder = objectMapper.vaccineOrderDtoToVaccineOrder(vaccineOrderDTO);
                vorder.getVaccineordervaccines().forEach(vovaccines -> vovaccines.setVaccineorder(vorder));
                vaccineOrderRepository.save(vorder);

            }catch(Exception e){
                System.out.println(e);
            }

            return vaccineOrderDTO;
        }else{
            throw new ResourceNotFountException("Vaccine Order Not Found");
        }
    }

    @Override
    public void delete(Integer id) {
        if(vaccineOrderRepository.existsById(id)){

            Vaccineorder vorder = vaccineOrderRepository.findById(id).orElseThrow(null);

            if(vorder != null){
                vaccineOrderRepository.delete(vorder);
            }

        }else{
            throw new ResourceNotFountException("Vaccine Order Not Found");
        }
    }


}
