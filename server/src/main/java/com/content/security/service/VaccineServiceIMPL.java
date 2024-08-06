package com.content.security.service;

import com.content.security.dto.EmployeeDTO;
import com.content.security.dto.VaccineDTO;
import com.content.security.entity.Productorder;
import com.content.security.entity.Vaccine;
import com.content.security.entity.Vaccineoffering;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.VaccineRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class VaccineServiceIMPL implements VaccineService {

    private final VaccineRepository vaccineRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<VaccineDTO> getAll(HashMap<String, String> params) {
        List<Vaccine> vaccineList = vaccineRepository.findAll();

        if (!vaccineList.isEmpty()) {
            List<VaccineDTO> vaccineDTOList = objectMapper.vaccineListToDtoList(vaccineList);

            if (params.isEmpty()) {
                return vaccineDTOList;
            } else {
                String name = params.get("name");
                String code = params.get("code");
                String vaccinestatusid = params.get("vaccinestatusid");
                String offeredinstitute = params.get("offeredinstitute");

                Stream<VaccineDTO> vstreame = vaccineDTOList.stream();

                if (name != null) vstreame = vstreame.filter(e -> e.getName().contains(name));
                if (offeredinstitute != null)
                    vstreame = vstreame.filter(e -> e.getOfferedinstitute().contains(offeredinstitute));
                if (code != null) vstreame = vstreame.filter(e -> e.getCode().equals(code));
                if (vaccinestatusid != null)
                    vstreame = vstreame.filter(e -> e.getVaccinestatus().getId() == Integer.parseInt(vaccinestatusid));

                return vstreame.collect(Collectors.toList());
            }
        } else {
            throw new ResourceNotFountException("No Vaccine found");
        }
    }

    @Override
    public VaccineDTO saveVaccine(VaccineDTO vaccineDTO) {
        if (vaccineDTO != null) {

            Vaccine vaccine = objectMapper.vaccineDtoToVaccine(vaccineDTO);

            if (!vaccineRepository.existsByCode(vaccine.getCode())) {
                for (Vaccineoffering vo : vaccine.getVaccineofferings()) {
                    vo.setVaccine(vaccine);
                }

                vaccineRepository.save(vaccine);
                return vaccineDTO;
            } else {
                throw new ResourceAlreadyExistException("Vaccine Already Exist!");
            }
        } else {
            throw new ResourceNotFountException("Vaccine Not Found");
        }
    }

    @Override
    public VaccineDTO updateVaccine(VaccineDTO vaccineDTO) {
        Vaccine vaccinerec = vaccineRepository.findById(vaccineDTO.getId()).orElseThrow(() -> new ResourceNotFountException("Vaccine Not Found"));

        if (!vaccinerec.getCode().equals(vaccineDTO.getCode()) && vaccineRepository.existsByCode(vaccineDTO.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exist!");
        }

        Vaccine vaccine = objectMapper.vaccineDtoToVaccine(vaccineDTO);

        try {
            vaccine.getVaccineofferings().forEach(vo -> vo.setVaccine(vaccine));
            vaccineRepository.save(vaccine);
        } catch (Exception e) {
            System.out.println(e);
        }
        return vaccineDTO;


    }

    @Override
    public void deleteVaccine(Integer id) {
        if (vaccineRepository.existsById(id)) {

            Vaccine vaccine = vaccineRepository.findById(id).orElseThrow(() -> new ResourceNotFountException("Vaccine Not Found"));

            if (vaccine != null) {
                vaccineRepository.delete(vaccine);
            }

        } else {
            throw new ResourceNotFountException("Vaccine Not Found");
        }
    }

    @Override
    public List<VaccineDTO> getAllList() {
        List<Vaccine> vaccineList = vaccineRepository.findAll();
        if (!vaccineList.isEmpty()) {
            List<VaccineDTO> vaccineDTO = objectMapper.vaccineListToDtoList(vaccineList);

            vaccineDTO = vaccineDTO.stream().map(
                    vaccinedto -> {
                        VaccineDTO v = new VaccineDTO(vaccinedto.getId(), vaccinedto.getName(), vaccinedto.getCode());
                        return v;
                    }
            ).collect(Collectors.toList());

            return vaccineDTO;
        } else {
            throw new ResourceNotFountException("No Vaccine found");
        }
    }
}
