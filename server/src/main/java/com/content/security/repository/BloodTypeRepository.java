package com.content.security.repository;

import com.content.security.entity.Bloodtype;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BloodTypeRepository extends JpaRepository<Bloodtype,Integer> {
}
