package com.content.security.repository;

import com.content.security.entity.Authority;
import com.content.security.entity.Module;
import com.content.security.entity.Operation;
import com.content.security.entity.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthorityRepository extends JpaRepository<Authority,Integer> {

    boolean existsByRoleAndModuleAndOperation(Role role, Module module, Operation operation);
}
