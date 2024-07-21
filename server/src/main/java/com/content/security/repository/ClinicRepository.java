package com.content.security.repository;

import com.content.security.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository extends JpaRepository<Clinic, Integer> {

    boolean existsByDivisionno(String divisionno);
}
