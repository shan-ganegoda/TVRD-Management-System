package com.content.security.repository;

import com.content.security.entity.Healthstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthStatusRepository extends JpaRepository<Healthstatus,Integer> {
}
