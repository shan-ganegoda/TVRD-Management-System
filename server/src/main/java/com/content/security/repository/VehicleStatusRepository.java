package com.content.security.repository;

import com.content.security.entity.Vehiclestatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VehicleStatusRepository extends JpaRepository<Vehiclestatus,Integer> {
}
