package com.content.security.service;

import com.content.security.dto.ClinicDTO;
import com.content.security.dto.EmployeeDTO;
import com.content.security.entity.Clinic;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ClinicRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class ClinicServiceIMPL implements ClinicService {

    private final ClinicRepository clinicRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ClinicDTO> getAll(HashMap<String, String> params) {
        List<Clinic> clinics = clinicRepository.findAll();
        if(!clinics.isEmpty()){
            List<ClinicDTO> clinicDTOList = objectMapper.clinicListToDtoList(clinics);
            if(params.isEmpty()){
                return clinicDTOList;
            }else{

                String divisionname = params.get("divisionname");
                String divisionno = params.get("divisionno");
                String clinicstatusid = params.get("clinicstatusid");
                String clinictypeid = params.get("clinictypeid");

                Stream<ClinicDTO> cstreame = clinicDTOList.stream();

                if(divisionname!=null) cstreame = cstreame.filter(c-> c.getDivisionname().equals(divisionname));
                if(divisionno!=null) cstreame = cstreame.filter(c-> c.getDivisionno().equals(divisionno));
                if(clinicstatusid!=null) cstreame = cstreame.filter(c-> c.getClinicstatus().getId() == Integer.parseInt(clinicstatusid));
                if(clinictypeid!=null) cstreame = cstreame.filter(c-> c.getClinictype().getId() == Integer.parseInt(clinictypeid));

                return cstreame.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("Clinics Not Found!");
        }
    }

    @Override
    public List<ClinicDTO> getAllList() {
        List<Clinic> clinics = clinicRepository.findAll();
        if(!clinics.isEmpty()){
            List<ClinicDTO> clinicDTOList = objectMapper.clinicListToDtoList(clinics);
                return clinicDTOList.stream().map(
                        clinicdto -> {
                            ClinicDTO c = new ClinicDTO(clinicdto.getId(),clinicdto.getDivisionname(),clinicdto.getDivisionno());
                            return c;
                        }
                ).collect(Collectors.toList());
            }else{
                throw new ResourceNotFountException("Clinics Not Found!");
            }
    }


    @Override
    public ClinicDTO create(ClinicDTO clinicDTO) {
        if(!clinicRepository.existsByDivisionno(clinicDTO.getDivisionno())){
            Clinic clinic = objectMapper.clinicDtoToClinic(clinicDTO);
            clinicRepository.save(clinic);
            return clinicDTO;
        }else{
            throw new ResourceAlreadyExistException("Clinic already exists!");
        }
    }

    @Override
    public ClinicDTO update(ClinicDTO clinicDTO) {

        Clinic clinicRecord = clinicRepository.findById(clinicDTO.getId()).orElse(null);
        if(clinicRecord != null){
            Clinic clinic = objectMapper.clinicDtoToClinic(clinicDTO);
            if(clinicRecord.getDivisionno().equals(clinicDTO.getDivisionno())){
                clinicRepository.save(clinic);
                return clinicDTO;
            }else if(clinicRepository.existsByDivisionno(clinicDTO.getDivisionno())){
                throw new ResourceAlreadyExistException("Clinic already exists!");
            }else{
                clinicRepository.save(clinic);
                return clinicDTO;
            }

        }else{
            throw new ResourceNotFountException("Clinic Not Found!");
        }
    }

    @Override
    public void delete(Integer id) {
        if(clinicRepository.existsById(id)){
            clinicRepository.findById(id).ifPresent(clinicRepository::delete);
        }else{
            throw new ResourceNotFountException("Clinic Not Found!");
        }
    }
}
