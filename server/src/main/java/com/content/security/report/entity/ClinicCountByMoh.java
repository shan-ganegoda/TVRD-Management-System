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
public class ClinicCountByMoh {

    @Id
    private Integer id;
    private String moh;
    private Long count;

    public ClinicCountByMoh(String moh, Long count){
        this.moh = moh;
        this.count = count;
    }
}
