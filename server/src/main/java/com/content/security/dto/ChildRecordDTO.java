package com.content.security.dto;

import com.content.security.entity.*;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChildRecordDTO {

    private Integer id;
    @Pattern(regexp = "^([A-Z][a-z]*[.]?[\\s]?)*([A-Z][a-z]*)$", message = "Invalid Fullname")
    private String fullname;
    @Pattern(regexp = "^[A-Z]-\\d{4}-\\d{3}$", message = "Invalid Registration No")
    private String regno;
    private LocalDate dobirth;
    private Gender gender;
    private LocalDate doregistered;
    private Mother mother;
    @Pattern(regexp = "^(\\d.\\d+)|(\\d)$", message = "Invalid Birth Weight")
    private BigDecimal birthweight;
    @Pattern(regexp = "^\\d{2}$", message = "Invalid Head Perimeter")
    private Integer headperimeter;
    private Bloodtype bloodtype;
    @Pattern(regexp = "^\\d{2}$", message = "Invalid Height")
    private Integer heightinbirth;
    @Pattern(regexp = "^.*$", message = "Invalid Place of Birth")
    private String placeofbirth;
    @Pattern(regexp = "^([1-9]|10)$", message = "Invalid Apgar Score")
    private Integer apgarscore;
    private Healthstatus healthstatus;
    private Involvementstatus involvementstatus;
    private Clinic clinic;

}
