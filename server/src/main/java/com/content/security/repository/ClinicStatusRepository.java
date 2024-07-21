package com.content.security.repository;

import com.content.security.entity.Clinicstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicStatusRepository extends JpaRepository<Clinicstatus,Integer> {
}
