package com.content.security.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "clinic")
public class Clinic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @Column(name = "divisionname")
    private String divisionname;

    @Size(max = 45)
    @Column(name = "divisionno", length = 45)
    private String divisionno;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "moh_id", nullable = false)
    private Moh moh;

    @Column(name = "clinicdate")
    private LocalDate clinicdate;

    @Column(name = "tostart")
    private LocalTime tostart;

    @Column(name = "toend")
    private LocalTime toend;

    @Column(name = "lastupdated")
    private LocalDate lastupdated;

    @Lob
    @Column(name = "location")
    private String location;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "clinictype_id", nullable = false)
    private Clinictype clinictype;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "clinicstatus_id", nullable = false)
    private Clinicstatus clinicstatus;

}