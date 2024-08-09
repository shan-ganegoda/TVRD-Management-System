package com.content.security.report.repository;

import com.content.security.report.entity.CountByMotherRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface CountByMotherRegistrationRepository extends JpaRepository<CountByMotherRegistration, Integer> {

    @Query("SELECT NEW CountByMotherRegistration (function('DATE_FORMAT', m.doregistered,'%Y-%M'), count (*)) from Mother m where m.doregistered between :startDate and :endDate group by function('DATE_FORMAT',m.doregistered,'%Y-%m') order by function('DATE_FORMAT',m.doregistered,'%Y-%m')")
    List<CountByMotherRegistration> findCountByMotherRegistrations(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
