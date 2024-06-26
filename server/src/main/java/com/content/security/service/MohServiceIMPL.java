package com.content.security.service;


import com.content.security.dto.MohDTO;
import com.content.security.entity.Moh;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.MohRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MohServiceIMPL implements MohService{

    private final MohRepository mohRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<MohDTO> getAllMohs(HashMap<String, String> params) {
        List<Moh> mohList = mohRepository.findAll();

        if(!mohList.isEmpty()){
            List<MohDTO> mohDTOList = objectMapper.MohListToMohDTOList(mohList);
            if(params.isEmpty()){
                return mohDTOList;
            }else{
                String name = params.get("name");
                String email = params.get("email");
                String districtid = params.get("districtid");
                String mohstatusid = params.get("mohstatusid");

                Stream<MohDTO> estreame = mohDTOList.stream();

                if(mohstatusid!=null) estreame = estreame.filter(e-> e.getMohstatus().getId()==Integer.parseInt(mohstatusid));
                if(districtid!=null) estreame = estreame.filter(e-> e.getRdh().getId()==Integer.parseInt(districtid));
                if(email!=null) estreame = estreame.filter(e-> e.getEmail().equals(email));
                if(name!=null) estreame = estreame.filter(e-> e.getName().contains(name));

                return estreame.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("Moh Not Found");
        }
    }

    @Override
    public MohDTO saveMoh(MohDTO mohDTO) {
        if(mohDTO != null){
            Moh moh = objectMapper.mohDtoToMoh(mohDTO);
            moh.setToopen(Time.valueOf("09:00:00"));
            moh.setToclose(Time.valueOf("16:00:00"));
            mohRepository.save(moh);
            return mohDTO;
        }else{
            throw new ResourceNotFountException("Resource Not Found");
        }
    }

    @Override
    public String deleteMoh(Integer id) {
        if(mohRepository.existsById(id)){
            mohRepository.deleteById(id);
            return "Moh Deleted Successfully";
        }else{
            throw new ResourceNotFountException("Moh Not Found");
        }
    }

    @Override
    public String updateMoh(MohDTO mohDTO) {
        if(mohRepository.existsById(mohDTO.getId())){
            Moh moh = objectMapper.dtoToMoh(mohDTO);
            mohRepository.save(moh);
            return "Moh Updated Successfully";
        }else{
            throw new ResourceNotFountException("Moh Not Found");
        }
    }

    @Override
    public MohDTO getMohById(Integer id) {

        if(mohRepository.existsById(id)){
           Moh moh = mohRepository.getReferenceById(id);
           MohDTO mohDTO = objectMapper.MohToDTO(moh);
           return mohDTO;
        }else{
            throw new ResourceNotFountException("Moh Not Found");
        }
    }

    @Override
    public List<MohDTO> getAllMohsList() {

        List<Moh> mohList = mohRepository.findAll();

        if(!mohList.isEmpty()){
            List<MohDTO> mohDTOList = objectMapper.MohListToMohDTOList(mohList);

            mohDTOList = mohDTOList.stream().map(
                    moh -> new MohDTO(moh.getId(),moh.getName())
            ).collect(Collectors.toList());

            return mohDTOList;
        }else{
            throw new ResourceNotFountException("Mohs Not Found");
        }

    }
}
