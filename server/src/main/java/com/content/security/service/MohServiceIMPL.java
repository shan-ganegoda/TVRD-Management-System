package com.content.security.service;


import com.content.security.dto.MohDTO;
import com.content.security.dto.MohPacketUpdateDTO;
import com.content.security.entity.Moh;
import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.MohRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class MohServiceIMPL implements MohService {

    private final MohRepository mohRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<MohDTO> getAllMohs(HashMap<String, String> params) {
        List<Moh> mohList = mohRepository.findAll();

        if (!mohList.isEmpty()) {
            List<MohDTO> mohDTOList = objectMapper.MohListToMohDTOList(mohList);
            if (params.isEmpty()) {
                return mohDTOList;
            } else {
                String name = params.get("name");
                String email = params.get("email");
                String districtid = params.get("districtid");
                String mohstatusid = params.get("mohstatusid");

                Stream<MohDTO> estreame = mohDTOList.stream();

                if (mohstatusid != null)
                    estreame = estreame.filter(e -> e.getMohstatus().getId() == Integer.parseInt(mohstatusid));
                if (districtid != null)
                    estreame = estreame.filter(e -> e.getRdh().getId() == Integer.parseInt(districtid));
                if (email != null) estreame = estreame.filter(e -> e.getEmail().equals(email));
                if (name != null) estreame = estreame.filter(e -> e.getName().contains(name));

                return estreame.collect(Collectors.toList());
            }
        } else {
            throw new ResourceNotFountException("Moh Not Found");
        }
    }

    @Override
    public MohDTO saveMoh(MohDTO mohDTO) {
        if (mohDTO != null) {

            if ( mohRepository.existsByEmail(mohDTO.getEmail())) {
                throw new ResourceAlreadyExistException("Email Already Exist!");
            }
            if ( mohRepository.existsByCodename(mohDTO.getCodename())) {
                throw new ResourceAlreadyExistException("Codename Already Exist!");
            }
            if (mohRepository.existsByTele(mohDTO.getTele())) {
                throw new ResourceAlreadyExistException("Telephone No Already Exist!");
            }
            if (mohRepository.existsByFaxno(mohDTO.getFaxno())) {
                throw new ResourceAlreadyExistException("Fax No Already Exist!");
            }

            Moh moh = objectMapper.mohDtoToMoh(mohDTO);
            moh.setToopen(Time.valueOf("09:00:00"));
            moh.setToclose(Time.valueOf("16:00:00"));
            mohRepository.save(moh);
            return mohDTO;

        } else {
            throw new ResourceNotFountException("MOH Not Found");
        }
    }

    @Override
    public String deleteMoh(Integer id) {

        Moh moh = mohRepository.findById(id).orElseThrow(() -> new ResourceNotFountException("Moh Not Found"));
            mohRepository.delete(moh);
            return "Moh Deleted Successfully";

    }

    @Override
    public MohDTO updateMoh(MohDTO mohDTO) {
        Moh moh = mohRepository.findById(mohDTO.getId()).orElseThrow(() -> new ResourceNotFountException("Moh Not Found"));

        if (!moh.getEmail().equals(mohDTO.getEmail()) && mohRepository.existsByEmail(mohDTO.getEmail())) {
            throw new ResourceAlreadyExistException("Email Already Exist!");
        }
        if (!moh.getCodename().equals(mohDTO.getCodename()) && mohRepository.existsByCodename(mohDTO.getCodename())) {
            throw new ResourceAlreadyExistException("Codename Already Exist!");
        }
        if (!moh.getTele().equals(mohDTO.getTele()) && mohRepository.existsByTele(mohDTO.getTele())) {
            throw new ResourceAlreadyExistException("Telephone No Already Exist!");
        }
        if (!moh.getFaxno().equals(mohDTO.getFaxno()) && mohRepository.existsByFaxno(mohDTO.getFaxno())) {
            throw new ResourceAlreadyExistException("Fax No Already Exist!");
        }

        Moh moh1 = objectMapper.mohDtoToMoh(mohDTO);
        moh1.setToopen(Time.valueOf("09:00:00"));
        moh1.setToclose(Time.valueOf("16:00:00"));
        mohRepository.save(moh1);
        return mohDTO;

    }

    @Override
    public MohDTO getMohById(Integer id) {

        if (mohRepository.existsById(id)) {
            Moh moh = mohRepository.getReferenceById(id);
            MohDTO mohDTO = objectMapper.MohToDTO(moh);
            return mohDTO;
        } else {
            throw new ResourceNotFountException("Moh Not Found");
        }
    }

    @Override
    public List<MohDTO> getAllMohsList() {

        List<Moh> mohList = mohRepository.findAll();

        if (!mohList.isEmpty()) {
            List<MohDTO> mohDTOList = objectMapper.MohListToMohDTOList(mohList);

            mohDTOList = mohDTOList.stream().map(
                    moh -> new MohDTO(moh.getId(), moh.getName())
            ).collect(Collectors.toList());

            return mohDTOList;
        } else {
            throw new ResourceNotFountException("Mohs Not Found");
        }

    }

    @Override
    public MohDTO updateMohPacket(MohPacketUpdateDTO mohPacketUpdateDTO) {

        Moh moh = mohRepository.findById(mohPacketUpdateDTO.getId()).orElseThrow(() -> new ResourceNotFountException("Moh Not Found"));
        Integer totalpacketcount = moh.getPacketcount() + mohPacketUpdateDTO.getPacketcount();
        moh.setPacketcount(totalpacketcount);
        MohDTO mohDTO = objectMapper.MohToDTO(moh);
        mohRepository.save(moh);
        return mohDTO;

    }

    @Override
    public MohDTO updateMohPacketDist(MohPacketUpdateDTO mohPacketUpdateDTO) {

        Moh moh = mohRepository.findById(mohPacketUpdateDTO.getId()).orElseThrow(() -> new ResourceNotFountException("Moh Not Found"));

        if(moh.getPacketcount() <= mohPacketUpdateDTO.getPacketcount()) {
            throw new ResourceNotFountException("Does Not Have Enough Packet Count");
        }

        Integer remainpacketcount = moh.getPacketcount() - mohPacketUpdateDTO.getPacketcount();
        moh.setPacketcount(remainpacketcount);
        MohDTO mohDTO = objectMapper.MohToDTO(moh);
        mohRepository.save(moh);
        return mohDTO;
    }
}
