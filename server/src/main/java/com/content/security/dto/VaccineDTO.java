package com.content.security.dto;

import com.content.security.entity.Employee;
import com.content.security.entity.Vaccineoffering;
import com.content.security.entity.Vaccinestatus;

import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VaccineDTO {

    private Integer id;
    @Pattern(regexp = "^.*$", message = "Invalid Name")
    private String name;
    private String code;
    private Integer dosecount;
    private String containindications;
    private LocalDate dosaved;
    private String offeredinstitute;
    private Vaccinestatus vaccinestatus;
    private Set<Vaccineoffering> vaccineofferings;
    private Employee employee;
}
