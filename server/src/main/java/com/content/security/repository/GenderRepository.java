package com.content.security.repository;

import com.content.security.entity.Employee;
import com.content.security.entity.Gender;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenderRepository extends JpaRepository<Gender,Integer> {

}
