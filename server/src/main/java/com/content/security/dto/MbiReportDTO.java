package com.content.security.dto;

import com.content.security.entity.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MbiReportDTO {

    private Integer id;
    private String code;
    private LocalDate date;
    private Moh moh;
    private Rdh rdh;
    private Employee employee;
    private Integer motherregcount;
    private Integer motherattendacecount;
    private Integer mdistributionscount;
    private Integer issuedmpackets;
    private Integer childregcount;
    private Integer childattendacecount;
    private Integer cdistributionscount;
    private Integer issuedcpacketscount;
    private Integer heldcliniccount;
    private Integer receivedpacketcount;
    private Integer distributedpacketcount;
    private Integer remainingpacketscount;
    private Reviewstatus reviewstatus;
    private Reportcategory reportcategory;
    private String description;
}
