package com.content.security.service;


import com.content.security.dto.MohDTO;
import com.content.security.dto.MohPacketUpdateDTO;

import java.util.HashMap;
import java.util.List;

public interface MohService {
    List<MohDTO> getAllMohs(HashMap<String, String> params);

    MohDTO saveMoh(MohDTO mohDTO);

    String deleteMoh(Integer id);

    MohDTO updateMoh(MohDTO mohDTO);

    MohDTO getMohById(Integer id);

    List<MohDTO> getAllMohsList();

    MohDTO updateMohPacket(MohPacketUpdateDTO mohPacketUpdateDTO);

    MohDTO updateMohPacketDist(MohPacketUpdateDTO mohPacketUpdateDTO);
}
