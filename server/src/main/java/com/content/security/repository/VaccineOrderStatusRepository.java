package com.content.security.repository;

import com.content.security.entity.Vaccineorderstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccineOrderStatusRepository extends JpaRepository<Vaccineorderstatus,Integer> {
}
