package com.content.security.controller;

import com.content.security.dto.MbiReportDTO;
import com.content.security.service.MbiReportService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/mbireports")
public class MbiReportController {

    private final MbiReportService mbiReportService;

    @GetMapping
    public List<MbiReportDTO> getAll(@RequestParam HashMap<String,String> params){
        return mbiReportService.getAll(params);
    }

    @PostMapping
    public MbiReportDTO save(@RequestBody MbiReportDTO mbiReportDTO){
        return mbiReportService.save(mbiReportDTO);
    }

    @PutMapping
    public MbiReportDTO update(@RequestBody MbiReportDTO mbiReportDTO){
        return mbiReportService.update(mbiReportDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> delete(@PathVariable Integer id){
        String message = mbiReportService.delete(id);

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted",message), HttpStatus.OK
        );
    }


}
