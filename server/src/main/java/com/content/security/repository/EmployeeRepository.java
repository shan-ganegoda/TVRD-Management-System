package com.content.security.repository;

import com.content.security.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {

    boolean existsByNumber(String number);
    Employee findByNumber(String number);
    boolean existsByEmail(String email);
    boolean existsByNic(String nic);
    boolean existsByMobile(String mobile);
    boolean existsByLand(String land);
}
