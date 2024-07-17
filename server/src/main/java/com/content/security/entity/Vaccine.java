package com.content.security.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vaccine")
public class Vaccine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @Column(name = "name")
    private String name;

    @Size(max = 45)
    @Column(name = "code", length = 45)
    private String code;

    @Column(name = "dosecount")
    private Integer dosecount;

    @Lob
    @Column(name = "containindications")
    private String containindications;

    @Column(name = "dosaved")
    private LocalDate dosaved;

    @Size(max = 255)
    @Column(name = "offeredinstitute")
    private String offeredinstitute;

    @JsonIgnore
    @OneToMany(mappedBy = "vaccine")
    private Set<Vaccinationstagetype> vaccinationstagetypes = new LinkedHashSet<>();

    @OneToMany(mappedBy = "vaccine", cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Vaccineoffering> vaccineofferings = new LinkedHashSet<>();

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vaccinestatus_id", nullable = false)
    private Vaccinestatus vaccinestatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

}