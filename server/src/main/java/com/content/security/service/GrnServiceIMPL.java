package com.content.security.service;

import com.content.security.dto.GrnDTO;
import com.content.security.entity.Grn;
import com.content.security.entity.Grnproduct;

import com.content.security.exception.ResourceAlreadyExistException;
import com.content.security.exception.ResourceNotFountException;
import com.content.security.repository.GrnRepository;
import com.content.security.util.mapper.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

import java.util.HashMap;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class GrnServiceIMPL implements GrnService {

    private final GrnRepository grnRepository;
    private final ObjectMapper objectMapper;

    @Override
    public List<GrnDTO> getAll(HashMap<String, String> params) {
        List<Grn> grns = grnRepository.findAll();
        if (!grns.isEmpty()) {
            List<GrnDTO> grnDTOs = objectMapper.grnListToDtoList(grns);
            if (params.isEmpty()) {
                return grnDTOs;
            } else {
                String code = params.get("code");
                String date = params.get("date");
                String grnstatusid = params.get("grnstatusid");

                Stream<GrnDTO> gstream = grnDTOs.stream();

                if (code != null) gstream = gstream.filter(g -> g.getCode().equals(code));
                if (date != null) gstream = gstream.filter(g -> g.getDate().equals(LocalDate.parse(date)));
                if (grnstatusid != null)
                    gstream = gstream.filter(g -> g.getGrnstatus().getId() == Integer.parseInt(grnstatusid));

                return gstream.collect(Collectors.toList());
            }
        } else {
            throw new ResourceNotFountException("GRNs Not Found!");
        }
    }

    @Override
    public GrnDTO save(GrnDTO grnDTO) {
        if (grnDTO != null) {
            Grn grn = objectMapper.grnDtoToGrn(grnDTO);

            if (!grnRepository.existsByCode(grnDTO.getCode())) {
                for (Grnproduct i : grn.getGrnproducts()) {
                    i.setGrn(grn);
                }

                grnRepository.save(grn);
                return grnDTO;
            } else {
                throw new ResourceAlreadyExistException("GRN Already Exist!");
            }
        } else {
            throw new ResourceNotFountException("GRN Not Found");
        }
    }

    @Override
    public GrnDTO update(GrnDTO grnDTO) {

        Grn grnrec = grnRepository.findById(grnDTO.getId()).orElseThrow(() -> new ResourceNotFountException("GRN Not Found"));

        if (!grnrec.getCode().equals(grnDTO.getCode()) && grnRepository.existsByCode(grnDTO.getCode())) {
            throw new ResourceAlreadyExistException("Code Already Exist!");
        }

        try {
            Grn grn = objectMapper.grnDtoToGrn(grnDTO);
            grn.getGrnproducts().forEach(grnroducts -> grnroducts.setGrn(grn));
            grnRepository.save(grn);

        } catch (Exception e) {
            System.out.println(e);
        }
        return grnDTO;

    }

    @Override
    public void delete(Integer id) {
        Grn grn = grnRepository.findById(id).orElseThrow(() -> new ResourceNotFountException("GRN Not Found"));
        grnRepository.delete(grn);
    }
}
