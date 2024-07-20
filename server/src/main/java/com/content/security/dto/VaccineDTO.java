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

    public VaccineDTO(Integer id,String name,String code){
        this.id = id;
        this.name = name;
        this.code = code;
    }

    private Integer id;
    @Pattern(regexp = "^.*$", message = "Invalid Name")
    private String name;
    @Pattern(regexp = "^VC\\d{3}$", message = "Invalid Code")
    private String code;
    @Pattern(regexp = "^\\d+$", message = "Invalid Dose Count")
    private Integer dosecount;
    @Pattern(regexp = "^.*$", message = "Invalid Indications")
    private String containindications;
    private LocalDate dosaved;
    private String offeredinstitute;
    private Vaccinestatus vaccinestatus;
    private Set<Vaccineoffering> vaccineofferings;
    private Employee employee;
}
