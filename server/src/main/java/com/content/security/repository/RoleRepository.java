package com.content.security.repository;

import com.content.security.entity.Role;
import com.content.security.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role,Integer> {

    Optional<Role> findByName(String name);
}
