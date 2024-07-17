package com.content.security.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "vaccinationstage")
public class Vaccinationstage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @Column(name = "name")
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "vaccinationstage")
    private Set<Vaccinationstagetype> vaccinationstagetypes = new LinkedHashSet<>();

    @JsonIgnore
    @OneToMany(mappedBy = "vaccinationstage")
    private Set<Vaccineoffering> vaccineofferings = new LinkedHashSet<>();

}