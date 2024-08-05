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
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "moh_id", nullable = false)
    private Moh moh;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "bagscount")
    private Integer bagscount;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "date")
    private LocalDate date;

    @Column(name = "totalpacketcount")
    private Integer totalpacketcount;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "inventorystatus_id", nullable = false)
    private Inventorystatus inventorystatus;

}