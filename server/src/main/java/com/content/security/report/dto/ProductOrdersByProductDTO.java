package com.content.security.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.YearMonth;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductOrdersByProductDTO {

    private Integer id;
    private YearMonth requestedDate;
    private Long product1count;
    private Long product2count;

    public ProductOrdersByProductDTO(YearMonth requestedDate, Long product1count, Long product2count){
        this.requestedDate = requestedDate;
        this.product1count = product1count;
        this.product2count = product2count;
    }

}
