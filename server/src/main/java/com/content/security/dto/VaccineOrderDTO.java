package com.content.security.dto;

import com.content.security.entity.Employee;
import com.content.security.entity.Moh;
import com.content.security.entity.Vaccineorderstatus;
import com.content.security.entity.Vaccineordervaccine;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class VaccineOrderDTO {

    private Integer id;
    private String code;
    private LocalDate dorequired;
    private LocalDate dorequested;
    private String description;
    private Vaccineorderstatus vaccineorderstatus;
    private Employee employee;
    private Moh moh;
    private Set<Vaccineordervaccine> vaccineordervaccines = new LinkedHashSet<>();
}
