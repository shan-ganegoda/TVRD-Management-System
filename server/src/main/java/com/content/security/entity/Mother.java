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
@Table(name = "mother")
public class Mother {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "registerno", length = 45)
    private String registerno;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "clinic_id", nullable = false)
    private Clinic clinic;

    @Size(max = 45)
    @Column(name = "mothername", length = 45)
    private String mothername;

    @Size(max = 12)
    @Column(name = "nic", length = 12)
    private String nic;

    @Size(max = 10)
    @Column(name = "mobileno", length = 10)
    private String mobileno;

    @Column(name = "dopregnant")
    private LocalDate dopregnant;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "bloodtype_id", nullable = false)
    private Bloodtype bloodtype;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "maritalstatus_id", nullable = false)
    private Maritalstatus maritalstatus;

    @Column(name = "age")
    private Integer age;

    @Lob
    @Column(name = "address")
    private String address;

    @Column(name = "currentweight")
    private Integer currentweight;

    @Column(name = "doregistered")
    private LocalDate doregistered;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "involvementstatus_id", nullable = false)
    private Involvementstatus involvementstatus;

    @Lob
    @Column(name = "description")
    private String description;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "motherstatus_id", nullable = false)
    private Motherstatus motherstatus;

}