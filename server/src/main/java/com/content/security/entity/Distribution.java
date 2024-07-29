package com.content.security.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "distribution")
public class Distribution {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "clinic_id", nullable = false)
    private Clinic clinic;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "mother_id", nullable = false)
    private Mother mother;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "lastupdated")
    private LocalDate lastupdated;

    @OneToMany(mappedBy = "distribution")
    private Set<Distributionproduct> distributionproducts = new LinkedHashSet<>();

}