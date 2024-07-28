package com.content.security.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "grn")
public class Grn {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "code", length = 45)
    private String code;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "productorder_id", nullable = false)
    private Productorder productorder;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "time")
    private LocalTime time;

    @Column(name = "bagscount")
    private Integer bagscount;

    @Size(max = 255)
    @Column(name = "railwaystation")
    private String railwaystation;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "grnstatus_id", nullable = false)
    private Grnstatus grnstatus;

    @OneToMany(mappedBy = "grn", cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Grnproduct> grnproducts = new LinkedHashSet<>();

}