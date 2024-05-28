package com.content.security.service;

import com.content.security.dto.EmployeeStatusDTO;
import com.content.security.entity.Employeestatus;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.EmployeeStatusRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeStatusServiceIMPL implements EmployeeStatusService{

    private final EmployeeStatusRepository employeeStatusRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<EmployeeStatusDTO> getAll() {
        List<Employeestatus> employeestatusList = employeeStatusRepository.findAll();

        if(!employeestatusList.isEmpty()){
            List<EmployeeStatusDTO> employeeStatusDTOList = objectMapper.employeeStatusListToEmployeeStatusDTOList(employeestatusList);
            return employeeStatusDTOList;
        }else{
            throw new ResourceNotFountException("EmployeeStatus Not Found");
        }
    }
}
