package com.content.security.controller;


import com.content.security.dto.MohDTO;
import com.content.security.dto.MohPacketUpdateDTO;
import com.content.security.service.MohService;
import com.content.security.util.StandardResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin/mohdetails")
public class MohController {

    private final MohService mohService;

    @GetMapping
    public List<MohDTO> getAllMohs(@RequestParam HashMap<String,String> params){
        return mohService.getAllMohs(params);
    }

    @GetMapping(path = "/list")
    public List<MohDTO> getAllMohsList(){
        return mohService.getAllMohsList();
    }

    @GetMapping("/{id}")
    public MohDTO getMohById(@PathVariable Integer id){
        return mohService.getMohById(id);
    }

    @PostMapping
    public MohDTO saveMoh(@RequestBody MohDTO mohDTO){
        return mohService.saveMoh(mohDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<StandardResponse> deleteMoh(@PathVariable Integer id){

        return new ResponseEntity<StandardResponse>(
                new StandardResponse(200,"Deleted", mohService.deleteMoh(id)), HttpStatus.OK
        );
    }

    @PutMapping
    public MohDTO updateMoh(@RequestBody MohDTO mohDTO){
        return mohService.updateMoh(mohDTO);
    }

    @PutMapping("/packetupdate")
    public MohDTO updateMohPacket(@RequestBody MohPacketUpdateDTO mohPacketUpdateDTO){
        return mohService.updateMohPacket(mohPacketUpdateDTO);
    }

    @PutMapping("/packetdistribution")
    public MohDTO updateMohPacketDist(@RequestBody MohPacketUpdateDTO mohPacketUpdateDTO){
        return mohService.updateMohPacketDist(mohPacketUpdateDTO);
    }
}
