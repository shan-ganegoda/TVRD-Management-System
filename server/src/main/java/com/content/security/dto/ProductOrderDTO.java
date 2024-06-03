package com.content.security.dto;

import com.content.security.entity.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Time;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductOrderDTO {

        private Integer id;
        private String code;
        private LocalDate dorequired;
        private BigDecimal grandtotal;
        private LocalDate dorequested;
        private String description;
        private Productorderstatus productorderstatus;
        private Employee employee;
        private Moh moh;
        private Set<Productorderproduct> productorderproducts = new LinkedHashSet<>();

}
