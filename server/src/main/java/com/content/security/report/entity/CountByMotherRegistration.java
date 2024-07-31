package com.content.security.report.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Entity
public class CountByMotherRegistration {

    @Id
    private Integer id;
    private Object yearmonth;
    private Long count;

    public CountByMotherRegistration(Object yearmonth, Long count) {
        this.yearmonth = yearmonth;
        this.count = count;
    }
}
