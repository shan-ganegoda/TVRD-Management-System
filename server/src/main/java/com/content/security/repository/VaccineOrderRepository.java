package com.content.security.repository;

import com.content.security.entity.Vaccineorder;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VaccineOrderRepository extends JpaRepository<Vaccineorder,Integer> {

    boolean existsByCode(String code);
}
