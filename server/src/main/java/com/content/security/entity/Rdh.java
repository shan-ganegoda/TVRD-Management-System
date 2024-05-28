package com.content.security.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Collection;

@Entity
@Getter
@Setter
@Table(name = "rdh")
public class Rdh {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "name")
    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "rdh")
    private Collection<Moh> mohs;

    @ManyToOne
    @JoinColumn(name = "pdh_id", referencedColumnName = "id")
    private Pdh pdh;
}
