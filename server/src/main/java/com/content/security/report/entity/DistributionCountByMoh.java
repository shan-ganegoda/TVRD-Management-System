package com.content.security.report.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class DistributionCountByMoh {

    @Id
    private Integer id;
    private Object yearmonth;
    private Long count;

    public DistributionCountByMoh(Object yearmonth, Long count){
        this.yearmonth = yearmonth;
        this.count = count;
    }
}
