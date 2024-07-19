package com.content.security.report.repository;

import com.content.security.report.entity.VehicleCountByMoh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VehicleCountByMohRepository extends JpaRepository<VehicleCountByMoh, Integer> {

    @Query("SELECT NEW VehicleCountByMoh(m.name, count (v.number)) FROM Vehicle v, Moh m WHERE v.moh.id = m.id GROUP BY v.id")
    List<VehicleCountByMoh> findVehicleCountByMoh();
}
