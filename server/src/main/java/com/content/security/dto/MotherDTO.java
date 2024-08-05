package com.content.security.dto;

import com.content.security.entity.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MotherDTO {

    private Integer id;
    @Pattern(regexp = "^[A-Z]-\\d{3}-\\d{3}$", message = "Invalid Registration No")
    private String registerno;
    private Clinic clinic;
    @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Mother Name")
    private String mothername;
    @Pattern(regexp = "^(([\\d]{9}[vVxX])|([\\d]{12}))$", message = "Invalid NIC")
    private String nic;
    @Pattern(regexp = "^0\\d{9}$", message = "Invalid Mobile Number")
    private String mobileno;
    private LocalDate dopregnant;
    private Bloodtype bloodtype;
    private Maritalstatus maritalstatus;
    @Pattern(regexp = "^\\d{2}$", message = "Invalid Age")
    private Integer age;
    @Pattern(regexp = "^.*$", message = "Invalid Address")
    private String address;
    @Pattern(regexp = "^\\d{2,}$", message = "Invalid Weight")
    private Integer currentweight;
    private LocalDate doregistered;
    private Involvementstatus involvementstatus;
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    private Motherstatus motherstatus;
}
