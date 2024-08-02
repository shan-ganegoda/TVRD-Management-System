package com.content.security.service;

import com.content.security.dto.MbiReportDTO;
import com.content.security.entity.Employee;
import com.content.security.entity.Mbireport;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.MbiReportRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MbiReportServiceIMPL implements MbiReportService{

    private final MbiReportRepository repo;
    private final ObjectMapper objectMapper;

    @Override
    public List<MbiReportDTO> getAll(HashMap<String, String> params) {
        List<Mbireport> list = repo.findAll();
        if(!list.isEmpty()){
            List<MbiReportDTO> dtoList = objectMapper.reportListToDtoList(list);
            if(params.isEmpty()){
                return dtoList;
            }else{

                String code = params.get("code");
                String mohid = params.get("mohid");
                String reviewstatusid = params.get("reviewstatusid");

                Stream<MbiReportDTO> mstream = dtoList.stream();

                if(code != null ) mstream = mstream.filter(e -> e.getCode().equals(code));
                if(mohid != null ) mstream = mstream.filter(e -> e.getMoh().getId() == Integer.parseInt(mohid));
                if(reviewstatusid != null ) mstream = mstream.filter(e -> e.getReviewstatus().getId() == Integer.parseInt(reviewstatusid));

                return mstream.collect(Collectors.toList());
            }
        }else{
            throw new ResourceNotFountException("MbiReports Not Found!");
        }
    }

    @Override
    public MbiReportDTO save(MbiReportDTO mbiReportDTO) {

        if(repo.existsByCode(mbiReportDTO.getCode())){
            throw new ResourceAlreadyExistException("Code Already Exist!");
        }

        Mbireport report = objectMapper.reportDtoToReport(mbiReportDTO);
        repo.save(report);
        return mbiReportDTO;

    }

    @Override
    public MbiReportDTO update(MbiReportDTO mbiReportDTO) {
        Mbireport reportrec = repo.findById(mbiReportDTO.getId()).orElseThrow(() -> new ResourceNotFountException("MbiReports Not Found!"));

        if(!reportrec.getCode().equals(mbiReportDTO.getCode()) && repo.existsByCode(mbiReportDTO.getCode())){
            throw new ResourceAlreadyExistException("Code Already Exist!");
        }

        Mbireport report = objectMapper.reportDtoToReport(mbiReportDTO);
        repo.save(report);
        return mbiReportDTO;
    }

    @Override
    public String delete(Integer id) {
        Mbireport reportrec = repo.findById(id).orElseThrow(() -> new ResourceNotFountException("MbiReports Not Found!"));
        repo.delete(reportrec);
        return "Report Deleted Successfully!";
    }
}
