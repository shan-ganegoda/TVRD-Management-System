package com.content.security.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Employee {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "number")
    private String number;
    @Basic
    @Column(name = "fullname")
    private String fullname;
    @Basic
    @Column(name = "callingname")
    private String callingname;
    @Basic
    @Column(name = "photo")
    private byte[] photo;
    @Basic
    @Column(name = "dobirth")
    private Date dobirth;
    @Basic
    @Column(name = "nic")
    private String nic;
    @Basic
    @Column(name = "address")
    private String address;
    @Basic
    @Column(name = "mobile")
    private String mobile;
    @Basic
    @Column(name = "land")
    private String land;
    @Basic
    @Column(name = "description")
    private String description;
    @Basic
    @Column(name = "email")
    private String email;

    @ManyToOne
    @JoinColumn(name = "gender_id", referencedColumnName = "id", nullable = false)
    private Gender gender;
    @ManyToOne
    @JoinColumn(name = "designation_id", referencedColumnName = "id", nullable = false)
    private Designation designation;
    @ManyToOne
    @JoinColumn(name = "emptype_id", referencedColumnName = "id", nullable = false)
    private EmpType emptype;
    @ManyToOne
    @JoinColumn(name = "employeestatus_id", referencedColumnName = "id", nullable = false)
    private Employeestatus employeestatus;
}
