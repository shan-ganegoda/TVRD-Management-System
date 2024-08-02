package com.content.security.repository;

import com.content.security.entity.Mbireport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MbiReportRepository extends JpaRepository<Mbireport,Integer> {

    boolean existsByCode(String code);

}
