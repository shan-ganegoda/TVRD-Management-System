package com.content.security.report.repository;

import com.content.security.report.entity.DistributionCountByMoh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface DistributionCountRepository extends JpaRepository<DistributionCountByMoh, Integer> {

    @Query("select new DistributionCountByMoh (function('DATE_FORMAT', mb.date,'%Y-%M'), sum(mb.distributedpacketcount)) from Mbireport mb,Moh m where mb.moh.id = m.id group by function('DATE_FORMAT',mb.date,'%Y-%m') order by function('DATE_FORMAT',mb.date,'%Y-%m')")
    List<DistributionCountByMoh> findDistributionCountByMoh();

    @Query("select new DistributionCountByMoh (function('DATE_FORMAT', mb.date,'%Y-%M'), sum(mb.distributedpacketcount)) from Mbireport mb,Moh m where mb.moh.id = m.id and m.id = :id group by function('DATE_FORMAT',mb.date,'%Y-%m') order by function('DATE_FORMAT',mb.date,'%Y-%m')")
    List<DistributionCountByMoh> findDistributionCountByMoh(@Param("id") Integer id);


}
