package com.content.security.report.repository;

import com.content.security.report.entity.CountByDesignation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface CountByDesignationRepository extends JpaRepository<CountByDesignation, Integer> {


    @Query("SELECT NEW CountByDesignation(d.name,COUNT(e.fullname)) FROM Employee e, Designation d WHERE e.designation.id = d.id GROUP BY d.id")
    List<CountByDesignation> countByDesignation();
}
