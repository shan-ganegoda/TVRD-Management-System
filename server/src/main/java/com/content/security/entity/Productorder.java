package com.content.security.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "productorder")
public class Productorder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Column(name ="code")
    private String code;

    @Column(name = "dorequired")
    private LocalDate dorequired;

    @Column(name = "grandtotal", precision = 7, scale = 2)
    private BigDecimal grandtotal;

    @Column(name = "dorequested")
    private LocalDate dorequested;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "productorderstatus_id", nullable = false)
    private Productorderstatus productorderstatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "moh_id", nullable = false)
    private Moh moh;

    @OneToMany(mappedBy = "productorder", cascade = CascadeType.ALL,orphanRemoval = true)
    private Set<Productorderproduct> productorderproducts = new LinkedHashSet<>();

}