package com.content.security.dto;

import com.content.security.entity.Employee;
import com.content.security.entity.Grnproduct;
import com.content.security.entity.Grnstatus;
import com.content.security.entity.Productorder;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GrnDTO {
    private Integer id;
    @Pattern(regexp = "^R\\d{7}$", message = "Invalid Code")
    private String code;
    private Productorder productorder;
    private LocalDate date;
    private LocalTime time;
    @Pattern(regexp = "^\\d+$", message = "Invalid Bags Count")
    private Integer bagscount;
    @Pattern(regexp = "^.*$", message = "Invalid Railway Station")
    private String railwaystation;
    private Employee employee;
    @Pattern(regexp = "^.*$", message = "Invalid Description")
    private String description;
    private Grnstatus grnstatus;
    private Set<Grnproduct> grnproducts = new LinkedHashSet<>();
}
