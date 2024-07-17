package com.content.security.repository;

import com.content.security.entity.Vaccinestatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccineStatusRepository extends JpaRepository<Vaccinestatus,Integer> {
}
