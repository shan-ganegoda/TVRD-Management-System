package com.content.security.dto;

import com.content.security.entity.Dose;
import com.content.security.entity.Vaccinationstage;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VaccineOfferingDTO {

    private Integer id;
    private Dose dose;
    private Vaccinationstage vaccinationstage;
    private Integer year;
    private Integer month;
    private String title;
}
