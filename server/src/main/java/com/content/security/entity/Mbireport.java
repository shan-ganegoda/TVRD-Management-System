package com.content.security.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "mbireport")
public class Mbireport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @Size(max = 45)
    @Column(name = "code", length = 45)
    private String code;

    @Column(name = "date")
    private LocalDate date;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "moh_id", nullable = false)
    private Moh moh;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "rdh_id", nullable = false)
    private Rdh rdh;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    @Column(name = "motherregcount")
    private Integer motherregcount;

    @Column(name = "motherattendacecount")
    private Integer motherattendacecount;

    @Column(name = "mdistributionscount")
    private Integer mdistributionscount;

    @Column(name = "issuedmpackets")
    private Integer issuedmpackets;

    @Column(name = "childregcount")
    private Integer childregcount;

    @Column(name = "childattendacecount")
    private Integer childattendacecount;

    @Column(name = "cdistributionscount")
    private Integer cdistributionscount;

    @Column(name = "issuedcpacketscount")
    private Integer issuedcpacketscount;

    @Column(name = "heldcliniccount")
    private Integer heldcliniccount;

    @Column(name = "receivedpacketcount")
    private Integer receivedpacketcount;

    @Column(name = "distributedpacketcount")
    private Integer distributedpacketcount;

    @Column(name = "remainingpacketscount")
    private Integer remainingpacketscount;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "reviewstatus_id", nullable = false)
    private Reviewstatus reviewstatus;

    @NotNull
    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "reportcategory_id", nullable = false)
    private Reportcategory reportcategory;

    @Lob
    @Column(name = "description")
    private String description;

}