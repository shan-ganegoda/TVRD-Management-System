package com.content.security.service;

import com.content.security.dto.MotherDTO;
import com.content.security.entity.Mother;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.MotherRepository;
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
public class MotherServiceIMPL implements MotherService {

    private final MotherRepository motherRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<MotherDTO> getAll(HashMap<String, String> params) {
        List<Mother> mothers = motherRepository.findAll();
        if (!mothers.isEmpty()) {
            List<MotherDTO> motherDTOS = objectMapper.motherListToDtoList(mothers);
            if (params.isEmpty()) {
                return motherDTOS;
            } else {

                String registerno = params.get("registerno");
                String nic = params.get("nic");
                String mothername = params.get("mothername");
                String clinicid = params.get("clinicid");

                Stream<MotherDTO> mstream = motherDTOS.stream();

                if (registerno != null) mstream = mstream.filter(e -> e.getRegisterno().equals(registerno));
                if (nic != null) mstream = mstream.filter(e -> e.getNic().equals(nic));
                if (mothername != null) mstream = mstream.filter(e -> e.getMothername().contains(mothername));
                if (clinicid != null)
                    mstream = mstream.filter(e -> e.getClinic().getId() == Integer.parseInt(clinicid));

                return mstream.collect(Collectors.toList());
            }
        } else {
            throw new ResourceNotFountException("Mothers Not Found");
        }
    }

    @Override
    public MotherDTO create(MotherDTO motherDTO) {
        if (motherDTO != null) {

            if (motherRepository.existsByRegisterno(motherDTO.getRegisterno())) {
                throw new ResourceAlreadyExistException("Register No Already Exist!");
            }

            if (motherRepository.existsByMobileno(motherDTO.getMobileno())) {
                throw new ResourceAlreadyExistException("Mobile No Already Exist!");
            }

            if (motherRepository.existsByNic(motherDTO.getNic())) {
                throw new ResourceAlreadyExistException("Nic Already Exist!");
            }

            LocalDate today = LocalDate.now();
            Mother mother = objectMapper.motherDtoToMother(motherDTO);
            mother.setDoregistered(today);
            motherRepository.save(mother);
            return motherDTO;

        } else {
            throw new ResourceNotFountException("Input is Not Given");
        }
    }

    @Override
    public MotherDTO update(MotherDTO motherDTO) {
        Mother motherRecord = motherRepository.findById(motherDTO.getId()).orElseThrow(() -> new ResourceNotFountException("Mother Not Found!"));
        if (motherRecord != null) {

            if (!motherRecord.getRegisterno().equals(motherDTO.getRegisterno()) && motherRepository.existsByRegisterno(motherDTO.getRegisterno())) {
                throw new ResourceAlreadyExistException("Register No Already Exist!");
            }

            if (!motherRecord.getMobileno().equals(motherDTO.getMobileno()) && motherRepository.existsByMobileno(motherDTO.getMobileno())) {
                throw new ResourceAlreadyExistException("Mobile No Already Exist!");
            }

            if (!motherRecord.getNic().equals(motherDTO.getNic()) && motherRepository.existsByNic(motherDTO.getNic())) {
                throw new ResourceAlreadyExistException("Nic Already Exist!");
            }

            Mother mother = objectMapper.motherDtoToMother(motherDTO);
            motherRepository.save(mother);
            return motherDTO;
        } else {
            throw new ResourceNotFountException("Mother Not Found!");
        }
    }

    @Override
    public String delete(int id) {
        Mother mother = motherRepository.findById(id).orElseThrow(() -> new ResourceNotFountException("Mother Not Found!"));
        motherRepository.delete(mother);
        return "Mother Deleted Successfully";
    }
}
