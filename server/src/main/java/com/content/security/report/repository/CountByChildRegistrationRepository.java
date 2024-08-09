package com.content.security.report.repository;

import com.content.security.report.entity.CountByChildRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CountByChildRegistrationRepository extends JpaRepository<CountByChildRegistration, Integer> {

    @Query("SELECT NEW CountByChildRegistration (function('DATE_FORMAT', c.doregistered,'%Y-%M'), count (*)) from Childrecord c where c.doregistered between :startDate and :endDate group by function('DATE_FORMAT',c.doregistered,'%Y-%m') order by function('DATE_FORMAT',c.doregistered,'%Y-%m')")
    List<CountByChildRegistration> findCountByChildRegistrations(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
