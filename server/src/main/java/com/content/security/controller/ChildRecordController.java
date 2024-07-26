package com.content.security.controller;

import com.content.security.dto.ChildRecordDTO;
import com.content.security.service.ChildRecordService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/childrecords")
@RequiredArgsConstructor
public class ChildRecordController {

    private final ChildRecordService childRecordService;

    @GetMapping
    public List<ChildRecordDTO> getAll(@RequestParam HashMap<String,String> params){
        return childRecordService.getAll(params);
    }

    @PostMapping
    public ChildRecordDTO create(@RequestBody ChildRecordDTO childRecordDTO){
        return childRecordService.save(childRecordDTO);
    }

    @PutMapping
    public ChildRecordDTO update(@RequestBody ChildRecordDTO childRecordDTO){
        return childRecordService.update(childRecordDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        String message = childRecordService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Updated",message), HttpStatus.OK
        );
    }
}
