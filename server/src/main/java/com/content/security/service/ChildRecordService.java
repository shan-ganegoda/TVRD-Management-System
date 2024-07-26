package com.content.security.service;

import com.content.security.dto.ChildRecordDTO;

import java.util.HashMap;
import java.util.List;

public interface ChildRecordService {
    List<ChildRecordDTO> getAll(HashMap<String, String> params);

    ChildRecordDTO update(ChildRecordDTO childRecordDTO);

    String delete(Integer id);

    ChildRecordDTO save(ChildRecordDTO childRecordDTO);
}
