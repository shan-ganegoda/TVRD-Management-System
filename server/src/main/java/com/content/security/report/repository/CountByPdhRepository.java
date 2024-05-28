package com.content.security.report.repository;

import com.content.security.report.entity.CountByPdh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CountByPdhRepository extends JpaRepository<CountByPdh, Integer> {

    @Query("select new CountByPdh(p.name, count(*)) from Rdh r,Pdh p,Moh m where p.id = r.pdh.id and r.id = m.rdh.id group by p.name order by count(*)")
    List<CountByPdh> findCountByRdh();
}
