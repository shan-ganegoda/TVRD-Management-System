package com.content.security.repository;

import com.content.security.entity.Grn;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GrnRepository extends JpaRepository<Grn, Integer> {

    boolean existsByCode(String code);
}
