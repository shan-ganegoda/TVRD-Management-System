package com.content.security.repository;

import com.content.security.entity.Mother;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MotherRepository extends JpaRepository<Mother, Integer> {

    boolean existsByRegisterno(String registerno);
    boolean existsByNic(String nic);
    boolean existsByMobileno(String mobileno);
}
