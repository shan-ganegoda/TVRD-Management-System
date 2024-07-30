package com.content.security.repository;

import com.content.security.entity.Vaccinationstatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccinationStatusRepository extends JpaRepository<Vaccinationstatus,Integer> {
}
