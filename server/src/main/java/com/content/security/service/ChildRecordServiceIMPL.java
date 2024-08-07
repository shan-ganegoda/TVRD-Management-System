package com.content.security.service;

import com.content.security.controller.ChildRecordController;
import com.content.security.dto.ChildRecordDTO;
import com.content.security.entity.Childrecord;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.ChildRecordRepository;
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
public class ChildRecordServiceIMPL implements ChildRecordService {

    private final ChildRecordRepository childRecordRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<ChildRecordDTO> getAll(HashMap<String, String> params) {
        List<Childrecord> childRecords = childRecordRepository.findAll();
        if (!childRecords.isEmpty()) {
            List<ChildRecordDTO> childRecordDTOS = objectMapper.childRecordListToDtoList(childRecords);
            if (params.isEmpty()) {
                return childRecordDTOS;
            } else {
                String regno = params.get("regno");
                String fullname = params.get("fullname");
                String genderid = params.get("genderid");
                String healthstatusid = params.get("healthstatusid");
                String clinicid = params.get("clinicid");

                Stream<ChildRecordDTO> cstreame = childRecordDTOS.stream();

                if (regno != null) cstreame = cstreame.filter(e -> e.getRegno().equals(regno));
                if (fullname != null) cstreame = cstreame.filter(e -> e.getFullname().contains(fullname));
                if (genderid != null)
                    cstreame = cstreame.filter(e -> e.getGender().getId() == Integer.parseInt(genderid));
                if (healthstatusid != null)
                    cstreame = cstreame.filter(e -> e.getHealthstatus().getId() == Integer.parseInt(healthstatusid));
                if (clinicid != null)
                    cstreame = cstreame.filter(e -> e.getClinic().getId() == Integer.parseInt(clinicid));

                return cstreame.collect(Collectors.toList());
            }
        } else {
            throw new ResourceNotFountException("Child Records Not Found!");
        }
    }

    @Override
    public ChildRecordDTO update(ChildRecordDTO childRecordDTO) {
        if (childRecordDTO != null) {
            Childrecord childrecord = childRecordRepository.findById(childRecordDTO.getId()).orElseThrow(() -> new ResourceNotFountException("Child Records Not Found!"));

            if (!childrecord.getRegno().equals(childRecordDTO.getRegno()) && childRecordRepository.existsByRegno(childRecordDTO.getRegno())) {
                throw new ResourceAlreadyExistException("RegNo Already Exist!");
            }

            Childrecord ch = objectMapper.childRecordDtoToChildRecord(childRecordDTO);
            childRecordRepository.save(ch);
            return childRecordDTO;
        } else {
            throw new ResourceNotFountException("ChildRecords Data Not Found!");
        }

    }

    @Override
    public String delete(Integer id) {
        Childrecord ch = childRecordRepository.findById(id).orElseThrow(() -> new ResourceNotFountException("Child Record Not Found!"));
        childRecordRepository.delete(ch);
        return "Child Record Successfully Deleted!";

    }

    @Override
    public ChildRecordDTO save(ChildRecordDTO childRecordDTO) {
        if (!childRecordRepository.existsByRegno(childRecordDTO.getRegno())) {
            Childrecord childrecord = objectMapper.childRecordDtoToChildRecord(childRecordDTO);
            childRecordRepository.save(childrecord);
            return childRecordDTO;
        } else {
            throw new ResourceAlreadyExistException("RegNo Already Exist!");
        }
    }
}
