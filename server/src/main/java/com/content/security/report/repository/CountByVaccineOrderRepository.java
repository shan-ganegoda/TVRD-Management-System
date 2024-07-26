package com.content.security.report.repository;

import com.content.security.report.entity.CountByVaccineOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CountByVaccineOrderRepository extends JpaRepository<CountByVaccineOrder, Integer> {

    @Query("SELECT NEW CountByVaccineOrder (vo.dorequested,sum(vov.quentity)) FROM Vaccineordervaccine vov,Vaccineorder vo WHERE vov.vaccineorder.id = vo.id AND vo.dorequested BETWEEN :startDate AND :endDate GROUP BY vo.dorequested ORDER BY vo.dorequested")
    List<CountByVaccineOrder> findCountByVaccineOrderBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
