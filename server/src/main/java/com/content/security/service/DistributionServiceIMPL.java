package com.content.security.service;

import com.content.security.dto.DistributionDTO;
import com.content.security.entity.Distribution;
import com.content.security.entity.Distributionproduct;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.DistributionRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class DistributionServiceIMPL implements DistributionService{

    private final DistributionRepository distributionRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<DistributionDTO> getAll(HashMap<String, String> params) {
        List<Distribution> distributions = distributionRepository.findAll();

        if(!distributions.isEmpty()){
            List<DistributionDTO> distributionDTOS = objectMapper.distributionListToDtoList(distributions);
            if(params.isEmpty()){
                return distributionDTOS;
            }else{

                String clinicid = params.get("clinicid");
                String motherid = params.get("motherid");
                String productid = params.get("productid");

                Stream<DistributionDTO> dstream = distributionDTOS.stream();

                if(clinicid != null) dstream = dstream.filter(d -> d.getClinic().getId() == Integer.parseInt(clinicid));
                if(motherid != null) dstream = dstream.filter(d -> d.getMother().getId() == Integer.parseInt(motherid));
                if(productid != null) dstream = dstream.filter(d -> d.getDistributionproducts().stream().anyMatch(p -> p.getProduct().getId() == Integer.parseInt(productid)));

                return dstream.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("Distributions Not Found!");
        }
    }

    @Override
    public DistributionDTO save(DistributionDTO distributionDTO) {

        if(distributionDTO != null){

            Distribution distribution = objectMapper.distributionDtoToDistribution(distributionDTO);

            if(!distributionRepository.existsByMother(distributionDTO.getMother())){
                for(Distributionproduct i : distribution.getDistributionproducts()){
                    i.setDistribution(distribution);
                }

                distributionRepository.save(distribution);
                return distributionDTO;
            }else{
                throw new ResourceAlreadyExistException("Distribution Already Exist!");
            }
        }else{
            throw new ResourceNotFountException("Distribution Not Found");
        }

    }

    @Override
    public DistributionDTO update(DistributionDTO distributionDTO) {

        Distribution distributionrec = distributionRepository.findById(distributionDTO.getId()).orElseThrow(null);

        if(distributionrec != null){

            Distribution distribution = objectMapper.distributionDtoToDistribution(distributionDTO);

            if(Objects.equals(distributionrec.getClinic().getId(), distribution.getClinic().getId()) && Objects.equals(distributionrec.getMother().getId(), distribution.getMother().getId())){
                try{
                    distribution.getDistributionproducts().forEach(dis -> dis.setDistribution(distribution));
                    distributionRepository.save(distribution);
                }catch(Exception e){System.out.println(e);}
                return distributionDTO;
            } else if(!distributionRepository.existsByMother(distribution.getMother())){
                try{
                    distribution.getDistributionproducts().forEach(dis -> dis.setDistribution(distribution));
                    distributionRepository.save(distribution);
                }catch(Exception e){System.out.println(e);}
                return distributionDTO;
            }else{
                throw new ResourceAlreadyExistException("Distribution Already Exist!");
            }
        }else{
            throw new ResourceNotFountException("Distribution Not Found");
        }
    }

    @Override
    public String delete(Integer id) {
        Distribution distribution = distributionRepository.findById(id).orElseThrow(null);

        if(distribution != null){
          distributionRepository.delete(distribution);
          return "Distribution Deleted Successfully";
        }else{
            throw new ResourceNotFountException("Distribution Not Found");
        }

    }
}
