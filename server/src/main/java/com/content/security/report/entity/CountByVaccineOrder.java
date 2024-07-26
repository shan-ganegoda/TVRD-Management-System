package com.content.security.report.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class CountByVaccineOrder {

    @Id
    private Integer id;
    private LocalDate requestedDate;
    private Long count;

    public CountByVaccineOrder(LocalDate requestedDate, Long count){
        this.requestedDate = requestedDate;
        this.count = count;
    }
}
