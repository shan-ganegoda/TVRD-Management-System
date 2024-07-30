package com.content.security.repository;

import com.content.security.entity.Vaccinationprogress;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccinationProgressRepository extends JpaRepository<Vaccinationprogress,Integer> {
}
