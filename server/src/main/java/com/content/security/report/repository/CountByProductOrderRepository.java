package com.content.security.report.repository;


import com.content.security.report.entity.CountByProductOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CountByProductOrderRepository extends JpaRepository<CountByProductOrder, Integer> {

    @Query("select new CountByProductOrder (po.dorequested, sum(pop.quentity)) from Productorderproduct pop,Productorder po where pop.productorder.id = po.id  group by po.dorequested order by po.dorequested desc ")
    List<CountByProductOrder> findCountByProductOrder();

    @Query("select new CountByProductOrder (po.dorequested, sum(pop.quentity)) from Productorderproduct pop,Productorder po where pop.productorder.id = po.id and po.dorequested BETWEEN :startDate And :endDate group by po.dorequested order by po.dorequested desc ")
    List<CountByProductOrder> findCountByProductOrderBetween(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
