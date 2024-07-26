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
public class CountByVaccineOrderDTO {

    private Integer id;
    private YearMonth requestedDate;
    private Long count;

    public CountByVaccineOrderDTO(YearMonth requestedDate, Long count){
        this.requestedDate = requestedDate;
        this.count = count;
    }

}
