package com.content.security.report.repository;

import com.content.security.report.entity.ClinicCountByMoh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClinicCountRepository extends JpaRepository<ClinicCountByMoh, Integer> {

    @Query("select new ClinicCountByMoh (m.name, count(*)) from Clinic c,Moh m where c.moh.id = m.id group by c.moh.id order by m.name")
    List<ClinicCountByMoh> findClinicCountByMoh();


}
