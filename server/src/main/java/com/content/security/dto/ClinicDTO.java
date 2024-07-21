package com.content.security.dto;

import com.content.security.entity.Clinicstatus;
import com.content.security.entity.Clinictype;
import com.content.security.entity.Employee;
import com.content.security.entity.Moh;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ClinicDTO {

    public ClinicDTO(Integer id,String divisionname,String divisionno){
        this.id=id;
        this.divisionname=divisionname;
        this.divisionno=divisionno;
    }

    private Integer id;
    @Pattern(regexp = "^([A-Z][a-z]+)$", message = "Invalid Division Name")
    private String divisionname;
    @Pattern(regexp = "^[A-Z]{3}\\d{5}$", message = "Invalid Division Number")
    private String divisionno;
    private Moh moh;
    private LocalDate clinicdate;
    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "Invalid Start Time")
    private LocalTime tostart;
    @Pattern(regexp = "^([01]\\d|2[0-3]):([0-5]\\d)$", message = "Invalid End Time")
    private LocalTime toend;
    private LocalDate lastupdated;
    private String location;
    private Employee employee;
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    private Clinictype clinictype;
    private Clinicstatus clinicstatus;
}
