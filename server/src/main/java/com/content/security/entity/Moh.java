package com.content.security.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.sql.Date;
import java.sql.Time;

@Entity
@Getter
@Setter
@Table(name = "moh")
public class Moh {

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;
    @Basic
    @Column(name = "tele")
    private String tele;
    @Basic
    @Column(name = "faxno")
    private String faxno;
    @Basic
    @Column(name = "email")
    private String email;
    @Basic
    @Column(name = "location")
    private String location;
    @Basic
    @Column(name = "address")
    private String address;
    @Basic
    @Column(name = "toopen")
    private Time toopen;
    @Basic
    @Column(name = "toclose")
    private Time toclose;
    @Basic
    @Column(name = "doestablished")
    private Date doestablished;
    @ManyToOne
    @JoinColumn(name = "mohofficer", referencedColumnName = "id")
    private Employee employee;
    @ManyToOne
    @JoinColumn(name = "rdh_id", referencedColumnName = "id", nullable = false)
    private Rdh rdh;
    @ManyToOne
    @JoinColumn(name = "mohstatus_id", referencedColumnName = "id", nullable = false)
    private Mohstatus mohstatus;

    @Size(max = 45)
    @Column(name = "codename", length = 45)
    private String codename;

}
