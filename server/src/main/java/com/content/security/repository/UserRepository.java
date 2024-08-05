package com.content.security.repository;

import com.content.security.entity.Employee;
import com.content.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Integer> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
    boolean existsByEmployee(Employee employee);
}
