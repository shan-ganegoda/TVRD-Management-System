package com.content.security.repository;

import com.content.security.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<Employee,Integer> {

    Employee findByNic(String nic);

    boolean existsByNumber(String number);

    Employee findByNumber(String number);

    boolean existsByEmailAndNumberAndNicAndMobileAndLand(String email, String number, String nic, String mobile, String land);
}
