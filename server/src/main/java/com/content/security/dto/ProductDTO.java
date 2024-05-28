package com.content.security.dto;

import com.content.security.entity.Employee;
import com.content.security.entity.Moh;
import com.content.security.entity.Productorderproduct;
import com.content.security.entity.Productorderstatus;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {

        private Integer id;
        private String name;
        private BigDecimal cost;

}
