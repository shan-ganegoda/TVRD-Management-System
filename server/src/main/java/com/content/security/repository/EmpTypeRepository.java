package com.content.security.repository;

import com.content.security.entity.EmpType;
import com.content.security.entity.Gender;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpTypeRepository extends JpaRepository<EmpType,Integer> {

}
