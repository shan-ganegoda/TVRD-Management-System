package com.content.security.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "authority")
public class Authority {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne(optional = false)
    @JoinColumn(name = "module_id", nullable = false)
    private Module module;

    @ManyToOne(optional = false)
    @JoinColumn(name = "operation_id", nullable = false)
    private Operation operation;
}
