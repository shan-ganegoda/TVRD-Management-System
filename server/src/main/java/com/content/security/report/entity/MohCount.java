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
public class MohCount {

    @Id
    private Integer id;
    private String name;
    private Integer count;

    public MohCount(String name, Integer count){
        this.name = name;
        this.count = count;
    }
}
