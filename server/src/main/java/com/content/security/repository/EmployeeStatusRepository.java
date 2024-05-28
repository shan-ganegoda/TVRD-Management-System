package com.content.security.repository;

import com.content.security.entity.Employeestatus;
import com.content.security.entity.Gender;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeStatusRepository extends JpaRepository<Employeestatus,Integer> {

}
