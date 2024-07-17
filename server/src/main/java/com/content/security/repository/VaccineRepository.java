package com.content.security.repository;

import com.content.security.entity.Vaccine;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccineRepository extends JpaRepository<Vaccine, Integer> {

    boolean existsByCode(String code);
}
