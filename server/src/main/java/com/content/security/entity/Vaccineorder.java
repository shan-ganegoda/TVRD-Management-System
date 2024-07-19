package com.content.security.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "vaccineorder")
public class Vaccineorder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "code", length = 45)
    private String code;

    @Column(name = "dorequired")
    private LocalDate dorequired;

    @Column(name = "dorequested")
    private LocalDate dorequested;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vaccineorderstatus_id", nullable = false)
    private Vaccineorderstatus vaccineorderstatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "moh_id", nullable = false)
    private Moh moh;

    @OneToMany(mappedBy = "vaccineorder")
    private Set<Vaccineordervaccine> vaccineordervaccines = new LinkedHashSet<>();

}