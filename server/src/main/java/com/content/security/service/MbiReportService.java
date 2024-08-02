package com.content.security.service;

import com.content.security.dto.MbiReportDTO;

import java.util.HashMap;
import java.util.List;

public interface MbiReportService {
    List<MbiReportDTO> getAll(HashMap<String, String> params);

    MbiReportDTO save(MbiReportDTO mbiReportDTO);

    MbiReportDTO update(MbiReportDTO mbiReportDTO);

    String delete(Integer id);
}
