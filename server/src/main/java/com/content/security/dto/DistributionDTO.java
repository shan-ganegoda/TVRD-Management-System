package com.content.security.dto;

import com.content.security.entity.Clinic;
import com.content.security.entity.Distributionproduct;
import com.content.security.entity.Mother;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DistributionDTO {

    private Integer id;
    private Clinic clinic;
    private Mother mother;
    private String description;
    private LocalDate lastupdated;
    private Set<Distributionproduct> distributionproducts;
}
