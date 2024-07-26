package com.content.security.report.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProductOrdersByProduct {
    @Id
    private Integer id;
    private LocalDate requestedDate;
    private Long product1count;
    private Long product2count;

    public ProductOrdersByProduct(LocalDate date,Long product1count, Long product2count) {
        this.requestedDate = date;
        this.product1count = product1count;
        this.product2count = product2count;
    }
}
