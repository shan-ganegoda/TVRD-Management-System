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
public class CountByPdh {

    @Id
    private Integer id;
    private String name;
    private Long count;

    public CountByPdh(String name, Long count){
        this.name = name;
        this.count = count;
    }
}
