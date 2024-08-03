package com.content.security.dto;

import com.content.security.entity.*;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Pattern;
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
    @Pattern(regexp = "^T/\\d{5}$", message = "Invalid Code")
    private String code;
    private LocalDate date;
    private Moh moh;
    private Rdh rdh;
    private Employee employee;
    @Pattern(regexp = "^\\d+$", message = "Invalid Mother Reg Count")
    private Integer motherregcount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Mother Attendance Count")
    private Integer motherattendacecount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Mother Distribution Count")
    private Integer mdistributionscount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Issued MPackets Count")
    private Integer issuedmpackets;
    @Pattern(regexp = "^\\d+$", message = "Invalid Child Reg Count")
    private Integer childregcount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Child Attendance Count")
    private Integer childattendacecount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Child Distribution Count")
    private Integer cdistributionscount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Issued CPackets Count")
    private Integer issuedcpacketscount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Held Clinic Count")
    private Integer heldcliniccount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Received Packet Count")
    private Integer receivedpacketcount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Distributed Packet Count")
    private Integer distributedpacketcount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Remaining Packet Count")
    private Integer remainingpacketscount;
    private Reviewstatus reviewstatus;
    private Reportcategory reportcategory;
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    @Pattern(regexp = "^\\d+$", message = "Invalid Total Reg Count")
    private Integer totalregcount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Total Attendance Count")
    private Integer totalattendacecount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Total Distribution Count")
    private Integer totaldistributionscount;
    @Pattern(regexp = "^\\d+$", message = "Invalid Total Issued Packets Count")
    private Integer totalissuedpacketscount;
}
