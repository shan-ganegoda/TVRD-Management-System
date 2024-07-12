package com.content.security.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "vehicle")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "number", length = 45)
    private String number;

    @Column(name = "doattached")
    private LocalDate doattached;

    @Column(name = "yom")
    private Integer yom;

    @Column(name = "capacity")
    private Integer capacity;

    @Lob
    @Column(name = "description")
    private String description;

    @Column(name = "currentmeterreading")
    private Integer currentmeterreading;

    @Column(name = "lastregdate")
    private LocalDate lastregdate;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vehiclestatus_id", nullable = false)
    private Vehiclestatus vehiclestatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vehicletype_id", nullable = false)
    private Vehicletype vehicletype;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "vehiclemodel_id", nullable = false)
    private Vehiclemodel vehiclemodel;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "moh_id", nullable = false)
    private Moh moh;

}