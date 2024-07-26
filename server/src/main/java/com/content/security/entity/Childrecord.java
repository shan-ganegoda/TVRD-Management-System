package com.content.security.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "childrecords")
public class Childrecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 255)
    @Column(name = "fullname")
    private String fullname;

    @Size(max = 45)
    @Column(name = "regno", length = 45)
    private String regno;

    @Column(name = "dobirth")
    private LocalDate dobirth;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "gender_id", nullable = false)
    private Gender gender;

    @Column(name = "doregistered")
    private LocalDate doregistered;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "mother_id", nullable = false)
    private Mother mother;

    @Column(name = "birthweight", precision = 5, scale = 3)
    private BigDecimal birthweight;

    @Column(name = "headperimeter")
    private Integer headperimeter;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "bloodtype_id", nullable = false)
    private Bloodtype bloodtype;

    @Column(name = "heightinbirth")
    private Integer heightinbirth;

    @Size(max = 255)
    @Column(name = "placeofbirth")
    private String placeofbirth;

    @Column(name = "apgarscore")
    private Integer apgarscore;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "healthstatus_id", nullable = false)
    private Healthstatus healthstatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "involvementstatus_id", nullable = false)
    private Involvementstatus involvementstatus;

}