package com.content.security.repository;

import com.content.security.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VaccinationRepository extends JpaRepository<Vaccination,Integer> {

    boolean existsByChildrecords(Childrecord childrecord);
}
