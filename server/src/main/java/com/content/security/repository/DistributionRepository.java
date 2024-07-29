package com.content.security.repository;

import com.content.security.entity.Clinic;
import com.content.security.entity.Distribution;
import com.content.security.entity.Mother;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DistributionRepository extends JpaRepository<Distribution, Integer> {

    boolean existsByMotherAndClinic(Mother mother, Clinic clinic);
}
