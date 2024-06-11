package com.content.security.report.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.YearMonth;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CountByProductOrderDTO {

    private Integer id;
    private YearMonth requestedDate;
    private Long count;

    public CountByProductOrderDTO(YearMonth requestedDate, Long count){
        this.requestedDate = requestedDate;
        this.count = count;
    }

}
