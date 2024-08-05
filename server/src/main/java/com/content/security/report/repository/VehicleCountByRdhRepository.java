package com.content.security.report.repository;

import com.content.security.report.entity.VehicleCountByMoh;
import com.content.security.report.entity.VehicleCountByRdh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface VehicleCountByRdhRepository extends JpaRepository<VehicleCountByRdh, Integer> {

    @Query("SELECT NEW VehicleCountByRdh(r.name, count (v.number)) FROM Vehicle v, Moh m ,Rdh r WHERE v.moh.id = m.id And m.rdh.id = r.id GROUP BY r.id order by r.name")
    List<VehicleCountByRdh> findVehicleCountByRdh();
}
